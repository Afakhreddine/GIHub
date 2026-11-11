import { test } from "node:test";
import assert from "node:assert/strict";
import scheduleResources from "../src/data/scheduleResources.js";
import {
  buildScheduleApprovalSummary,
  canPublishScheduleReview,
  filterScheduleReviewItems,
  flattenScheduleResources,
  flattenScheduleReviewItems,
  isReviewHomePath,
  isScheduleReviewPath,
  scheduleReviewItemId,
  scheduleReviewSourceFromLocation,
} from "../src/scheduleReviewModel.js";

test("schedule review route and source parsing work", () => {
  assert.equal(isReviewHomePath("/review"), true);
  assert.equal(isReviewHomePath("/review/"), true);
  assert.equal(isScheduleReviewPath("/review/schedule"), true);
  assert.equal(isScheduleReviewPath("/review/schedule/"), true);
  assert.equal(isScheduleReviewPath("/review/weekly"), false);
  assert.deepEqual(scheduleReviewSourceFromLocation("https://gi-hub.vercel.app/review?tab=schedule&pr=28"), { pr:"28", latest:false });
  assert.deepEqual(scheduleReviewSourceFromLocation("/review/schedule"), { pr:"", latest:true });
});

test("schedule resources flatten into reviewable guideline and article cards", () => {
  const items = flattenScheduleResources(scheduleResources);
  assert.ok(items.length > 0);
  assert.ok(items.some(item => item.kind === "Guideline"));
  assert.ok(items.some(item => item.kind === "News and Articles"));
  assert.ok(items.every(item => item.slug && item.title));
});

test("schedule review queues new guideline and article candidates but not trusted cards", () => {
  const resources = {
    "topic-a": {
      guidelines:[
        { org:"ACG", title:"Already trusted guideline", url:"https://example.com/g" },
        { org:"AASLD", title:"New guideline candidate", url:"https://example.com/new-g", status:"candidate" },
      ],
      newsAndArticles:[
        { title:"Already approved archive card", url:"https://example.com/archive", sourceRepository:"weekly-archive" },
        { title:"New online candidate", url:"https://example.com/new", sourceRepository:"targeted-online-pull" },
      ],
    },
  };
  const allItems = flattenScheduleResources(resources);
  const reviewItems = flattenScheduleReviewItems(resources, new Set(["topic-a"]));
  assert.equal(allItems.length, 4);
  assert.deepEqual(reviewItems.map(item => item.title), ["New guideline candidate", "New online candidate"]);
});

test("schedule review defaults to the current published schedule slugs", () => {
  const resources = {
    "stomach-pathology": {
      newsAndArticles:[
        { title:"Old September card", url:"https://example.com/old", sourceRepository:"targeted-online-pull" },
      ],
    },
    "portal-hypertension": {
      newsAndArticles:[
        { title:"Pending November lecture card", url:"https://example.com/portal", sourceRepository:"targeted-online-pull" },
      ],
    },
    "appendix-and-anus-pathology": {
      newsAndArticles:[
        { title:"Current November card", url:"https://example.com/current", sourceRepository:"targeted-online-pull" },
      ],
    },
  };
  const items = flattenScheduleReviewItems(resources);
  assert.deepEqual(items.map(item => item.title), ["Pending November lecture card", "Current November card"]);

});

test("Schedule shortlist requires one selected citation per reader suggestion", () => {
  const options = flattenScheduleReviewItems({ "portal-hypertension":{ newsAndArticles:[
    { title:"Option A", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/", pmid:"42476609", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional" },
    { title:"Option B", url:"https://pubmed.ncbi.nlm.nih.gov/34414201/", pmid:"34414201", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional" },
  ] } }, new Set(["portal-hypertension"]));
  const both = Object.fromEntries(options.map(item => [scheduleReviewItemId(item), "Approve"]));
  assert.equal(canPublishScheduleReview(options, both), false);
  assert.equal(canPublishScheduleReview(options, { ...both, [scheduleReviewItemId(options[1])]:"Reject" }), true);

});

test("schedule review filters and publication readiness mirror weekly review", () => {
  const resources = {
    "topic-a": {
      newsAndArticles:[
        { title:"New stomach candidate", url:"https://example.com/a", source:"Journal", sourceRepository:"targeted-online-pull" },
        { title:"New bleeding candidate", url:"https://example.com/b", source:"Journal", sourceRepository:"targeted-online-pull" },
        { title:"New liver candidate", url:"https://example.com/c", source:"Journal", sourceRepository:"targeted-online-pull" },
      ],
    },
  };
  const items = flattenScheduleReviewItems(resources, new Set(["topic-a"]));
  const first = items[0];
  const decisions = Object.fromEntries(items.map(item => [scheduleReviewItemId(item), "Approve"]));
  assert.equal(canPublishScheduleReview(items, decisions), true);
  assert.equal(filterScheduleReviewItems(items, { query:first.title.slice(0, 8), slug:"All", kind:"All", decision:"All", decisions }).length >= 1, true);
  assert.equal(filterScheduleReviewItems(items, { query:"", slug:first.slug, kind:first.kind, decision:"Approve", decisions }).every(item => item.slug === first.slug && item.kind === first.kind), true);
  const summary = buildScheduleApprovalSummary(items, decisions);
  assert.match(summary, /Schedule resource approval summary/);
  assert.match(summary, /Approved \(3\)/);
});
