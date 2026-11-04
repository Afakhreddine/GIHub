import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import scheduleResources from "../src/data/scheduleResources.js";
import ScheduleReview from "../src/ScheduleReview.jsx";
import ReviewHub from "../src/ReviewHub.jsx";
import WeeklyReview from "../src/WeeklyReview.jsx";
import { parseScheduleResourcesModuleSource } from "../api/schedule-review-data.js";
import { filterScheduleResourcesToApproved, parseScheduleResourcesSource, scheduleResourcesMatchApproved, validateScheduleCommunityBranch, validateSchedulePublishRequest } from "../api/schedule-review-publish.js";
import { flattenScheduleReviewItems, scheduleReviewItemId } from "../src/scheduleReviewModel.js";
import { sanitizeScheduleResourceForPublic } from "../src/scheduleResourcesModel.js";

test("schedule review route renders cards and publish controls", () => {
  const html = renderToStaticMarkup(React.createElement(ScheduleReview, { resources:scheduleResources }));
  assert.match(html, /Schedule Resource Review/);
  assert.match(html, /Search Schedule cards/);
  assert.match(html, /Publish approved/);
  assert.match(html, /Approve/);
  assert.match(html, /Hold/);
  assert.match(html, /Reject/);
});

test("reader-suggested Weekly card has a distinct purple review treatment", () => {
  const card = { type:"Research", topic:"IBD", date:"Nov 2026", title:"Verified article", summary:"For editorial review.", source:"PubMed", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/12345678/", sourceRepository:"community-suggestion", status:"candidate" };
  const html = renderToStaticMarkup(React.createElement(WeeklyReview, { items:[card] }));
  assert.match(html, /Reader suggestion/);
  assert.match(html, /border-left:3px solid #b36df8/);
});

test("reader-suggested Schedule card is purple, reviewable, and hidden until approved", () => {
  const suggested = { title:"Verified study", url:"https://pubmed.ncbi.nlm.nih.gov/12345678/", pmid:"12345678", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional", matchRank:1, matchCount:2, suggestedLecture:{ slug:"portal-hypertension", label:"Portal Hypertension", confidence:"moderate", reason:"Study aligns with the named lecture topic" }, relevanceReason:"Best-guess match to Portal Hypertension lecture" };
  const resources = { "portal-hypertension":{ topic:"Portal Hypertension", guidelines:[], newsAndArticles:[suggested], quiz:[] } };
  const reviewItems = flattenScheduleReviewItems(resources, new Set(["portal-hypertension"]));
  assert.equal(reviewItems.length, 1);
  const html = renderToStaticMarkup(React.createElement(ScheduleReview, { resources }));
  assert.match(html, /Reader suggestion/);
  assert.match(html, /border-left:3px solid #b36df8/);
  assert.match(html, /Best guess: Portal Hypertension \(moderate confidence\)/);
  assert.match(html, /Best guess · option 1 of 2 · PMID 12345678 \(provisional match\)/);
  assert.deepEqual(sanitizeScheduleResourceForPublic(resources["portal-hypertension"]).newsAndArticles, []);
  assert.deepEqual(filterScheduleResourcesToApproved(resources, [reviewItems[0]])["portal-hypertension"].newsAndArticles.map(item => item.status), ["approved"]);
  assert.deepEqual(filterScheduleResourcesToApproved(resources, [])["portal-hypertension"].newsAndArticles, []);
});

test("Schedule reader suggestion does not inherit a targeted card's decision", () => {
  const shared = { title:"Shared citation", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/", status:"candidate" };
  const resources = { "portal-hypertension":{ topic:"Portal Hypertension", guidelines:[], newsAndArticles:[
    { ...shared, sourceRepository:"targeted-online-pull" },
    { ...shared, sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", matchRank:1, matchCount:1, pmid:"42476609" },
  ] } };
  const cards = flattenScheduleReviewItems(resources, new Set(["portal-hypertension"]));
  assert.notEqual(scheduleReviewItemId(cards[0]), scheduleReviewItemId(cards[1]));
  const filtered = filterScheduleResourcesToApproved(resources, [cards[1]]);
  assert.deepEqual(filtered["portal-hypertension"].newsAndArticles.map(item => item.sourceRepository), ["community-suggestion"]);
});

test("Schedule alternatives sharing a journal URL keep PMID-specific decisions and publication", () => {
  const shared = { title:"Possible study", url:"https://journal.example/issue", sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", status:"candidate" };
  const resources = { "portal-hypertension":{ topic:"Portal Hypertension", guidelines:[], newsAndArticles:[
    { ...shared, pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" },
    { ...shared, pmid:"34414201", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" },
  ] } };
  const cards = flattenScheduleReviewItems(resources, new Set(["portal-hypertension"]));
  assert.notEqual(scheduleReviewItemId(cards[0]), scheduleReviewItemId(cards[1]));
  const filtered = filterScheduleResourcesToApproved(resources, [cards[0]]);
  assert.deepEqual(filtered["portal-hypertension"].newsAndArticles.map(item => item.pmid), ["42476609"]);
  const prepared = { "portal-hypertension":{ ...resources["portal-hypertension"], newsAndArticles:[{ ...resources["portal-hypertension"].newsAndArticles[1], status:"approved" }] } };
  assert.equal(validateScheduleCommunityBranch(prepared, { "portal-hypertension":{ guidelines:[], newsAndArticles:[] } }, [cards[0]]), false);
});

test("Schedule publish rejects preapproved unresolved and unselected reader cards", () => {
  const candidate = { title:"Selected", pmid:"42476609", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/", sourceRepository:"community-suggestion", suggestionId:"lead-a", matchStatus:"provisional", status:"candidate" };
  const injected = { title:"Unverified", sourceRepository:"community-suggestion", suggestionId:"lead-b", matchStatus:"unresolved", status:"approved" };
  const base = { "portal-hypertension":{ newsAndArticles:[], guidelines:[] } };
  const branch = { "portal-hypertension":{ newsAndArticles:[candidate, injected], guidelines:[] } };
  const selected = flattenScheduleReviewItems(branch, new Set(["portal-hypertension"]))[0];
  assert.equal(validateScheduleCommunityBranch(branch, base, [selected]), false);
  assert.deepEqual(sanitizeScheduleResourceForPublic(branch["portal-hypertension"]).newsAndArticles, []);
  assert.throws(() => filterScheduleResourcesToApproved(branch, [selected]), /unverified reader suggestion/);
});

test("Schedule publish API rejects multiple candidate citations for one suggestion", () => {
  const env = { WEEKLY_REVIEW_PUBLISH_TOKEN:"review-secret", GITHUB_TOKEN:"github-token", VERCEL_GIT_PULL_REQUEST_ID:"15" };
  const one = { sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional", pmid:"42476609", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/" };
  const two = { ...one, pmid:"34414201", url:"https://pubmed.ncbi.nlm.nih.gov/34414201/" };
  assert.equal(validateSchedulePublishRequest({ body:{ token:"review-secret", approved:true, approvedItems:[one] } }, env).ok, true);
  assert.equal(validateSchedulePublishRequest({ body:{ token:"review-secret", approved:true, approvedItems:[one, two] } }, env).status, 400);
});

test("combined review hub renders Weekly and Schedule tabs", () => {
  const html = renderToStaticMarkup(React.createElement(ReviewHub));
  assert.match(html, /Weekly Update/);
  assert.match(html, /Schedule Cards/);
});

test("schedule review data parser extracts scheduleResources object", () => {
  const source = `const scheduleResources = {"topic-a":{"guidelines":[],"newsAndArticles":[],"quiz":[]}};\n\nexport default scheduleResources;\n`;
  assert.deepEqual(parseScheduleResourcesModuleSource(source), { "topic-a":{ guidelines:[], newsAndArticles:[], quiz:[] } });
  assert.deepEqual(parseScheduleResourcesSource(source), { "topic-a":{ guidelines:[], newsAndArticles:[], quiz:[] } });
});

test("schedule publish filter preserves prior-approved resources and filters only new search cards", () => {
  const resources = {
    "topic-a": {
      guidelines:[
        { org:"ACG", title:"Preserve guideline", url:"https://example.com/g1", status:"approved" },
        { org:"AASLD", title:"Keep new guideline", url:"https://example.com/g2", status:"candidate" },
        { org:"ASGE", title:"Drop new guideline", url:"https://example.com/g3", status:"candidate" },
      ],
      newsAndArticles:[
        { title:"Preserve archive article", url:"https://example.com/archive", source:"Journal", sourceRepository:"weekly-archive" },
        { title:"Preserve older targeted article", url:"https://example.com/older", source:"Journal", sourceRepository:"targeted-online-pull", status:"approved" },
        { title:"Keep new article", url:"https://example.com/a1", source:"Journal", sourceRepository:"targeted-online-pull", status:"candidate" },
        { title:"Drop new article", url:"https://example.com/a2", source:"Journal", sourceRepository:"targeted-online-pull", status:"candidate" },
      ],
      quiz:[],
      quizStatus:"pending-autocontent-pdf-pull",
    },
  };
  const items = flattenScheduleReviewItems(resources, new Set(["topic-a"]));
  const approvedItems = items.filter(item => /Keep/.test(item.title));
  const filtered = filterScheduleResourcesToApproved(resources, approvedItems);
  assert.deepEqual(filtered["topic-a"].guidelines.map(item => item.title), ["Preserve guideline", "Keep new guideline"]);
  assert.ok(filtered["topic-a"].guidelines.every(item => item.status === "approved"));
  assert.deepEqual(filtered["topic-a"].newsAndArticles.map(item => item.title), ["Preserve archive article", "Preserve older targeted article", "Keep new article"]);
  assert.equal(filtered["topic-a"].newsAndArticles[1].status, "approved");
  assert.equal(filtered["topic-a"].newsAndArticles[2].status, "approved");
  assert.equal(scheduleResourcesMatchApproved(resources, approvedItems), false, "candidate status requires branch preparation before merge");
  assert.equal(scheduleResourcesMatchApproved(filtered, approvedItems), true);
  assert.equal(filtered["topic-a"].quizStatus, "pending-autocontent-pdf-pull");
  assert.equal(filtered["topic-a"].resourceStatus, "approved");
});
