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

test("schedule review only queues new targeted online search-result cards", () => {
  const resources = {
    "topic-a": {
      guidelines:[{ org:"ACG", title:"Already trusted guideline", url:"https://example.com/g" }],
      newsAndArticles:[
        { title:"Already approved archive card", url:"https://example.com/archive", sourceRepository:"weekly-archive" },
        { title:"New online candidate", url:"https://example.com/new", sourceRepository:"targeted-online-pull" },
      ],
    },
  };
  const allItems = flattenScheduleResources(resources);
  const reviewItems = flattenScheduleReviewItems(resources);
  assert.equal(allItems.length, 3);
  assert.deepEqual(reviewItems.map(item => item.title), ["New online candidate"]);
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
  const items = flattenScheduleReviewItems(resources);
  const first = items[0];
  const decisions = Object.fromEntries(items.map(item => [scheduleReviewItemId(item), "Approve"]));
  assert.equal(canPublishScheduleReview(items, decisions), true);
  assert.equal(filterScheduleReviewItems(items, { query:first.title.slice(0, 8), slug:"All", kind:"All", decision:"All", decisions }).length >= 1, true);
  assert.equal(filterScheduleReviewItems(items, { query:"", slug:first.slug, kind:first.kind, decision:"Approve", decisions }).every(item => item.slug === first.slug && item.kind === first.kind), true);
  const summary = buildScheduleApprovalSummary(items, decisions);
  assert.match(summary, /Schedule resource approval summary/);
  assert.match(summary, /Approved \(3\)/);
});
