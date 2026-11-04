import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPublishPayload,
  canPublishWeeklyReview,
  weeklyReviewDecisionCounts,
  weeklyItemId,
} from "../src/weeklyReviewModel.js";
import { isPublicApprovedResource } from "../src/scheduleResourcesModel.js";
import { buildUpdatedWeeklyFile, prepareApprovedWeeklyItems, resolvePublishConfig, validatePublishRequest, weeklyItemsMatchApproved } from "../api/weekly-review-publish.js";

const items = [
  { date:"Sep 1, 2026", title:"First update", source:"news.gastro.org" },
  { date:"Sep 1, 2026", title:"Second update", source:"healio.com" },
];

test("weekly review publish is allowed when every card is reviewed and at least one is approved", () => {
  const mixedReview = {
    "Sep 1, 2026|First update":"Approve",
    "Sep 1, 2026|Second update":"Reject",
  };
  assert.deepEqual(weeklyReviewDecisionCounts(items, mixedReview), {
    approved: 1,
    held: 0,
    rejected: 1,
    reviewed: 2,
    total: 2,
    unreviewed: 0,
  });
  assert.equal(canPublishWeeklyReview(items, mixedReview), true);
  assert.equal(canPublishWeeklyReview(items, { ...mixedReview, "Sep 1, 2026|First update":"Hold" }), false);
  assert.equal(canPublishWeeklyReview(items, { "Sep 1, 2026|First update":"Approve" }), false);
});

test("a reader suggestion shortlist permits at most one approved match", () => {
  const options = [
    { ...items[0], sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" },
    { ...items[1], sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", pmid:"34414201", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" },
  ];
  assert.equal(canPublishWeeklyReview(options, { [weeklyItemId(options[0])]:"Approve", [weeklyItemId(options[1])]:"Approve" }), false);
  assert.equal(canPublishWeeklyReview(options, { [weeklyItemId(options[0])]:"Approve", [weeklyItemId(options[1])]:"Reject" }), true);
  const unresolved = { ...items[0], sourceRepository:"community-suggestion", matchStatus:"unresolved" };
  assert.equal(canPublishWeeklyReview([unresolved], { [weeklyItemId(unresolved)]:"Approve" }), false);
});

test("shortlist options with the same title/date have distinct Weekly review decisions", () => {
  const first = { ...items[0], title:"Same title", sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" };
  const second = { ...first, pmid:"34414201", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" };
  assert.notEqual(weeklyItemId(first), weeklyItemId(second));
  const decisions = { [weeklyItemId(first)]:"Approve", [weeklyItemId(second)]:"Reject" };
  assert.equal(buildPublishPayload([first, second], decisions).approvedItems.length, 1);
});

test("Weekly publish stamps an approved reader candidate and checks provenance", () => {
  const candidate = { ...items[0], sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", status:"candidate", pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" };
  const expected = prepareApprovedWeeklyItems([candidate]);
  assert.equal(expected[0].status, "approved");
  assert.equal(isPublicApprovedResource(expected[0]), true);
  assert.equal(weeklyItemsMatchApproved([candidate], expected), false);
  assert.equal(weeklyItemsMatchApproved([{ ...expected[0], matchStatus:"unresolved" }], expected), false);
  assert.equal(weeklyItemsMatchApproved(expected, expected), true);
});

test("weekly review publish payload includes only approved items plus decisions and summary", () => {
  const decisions = {
    "Sep 1, 2026|First update":"Approve",
    "Sep 1, 2026|Second update":"Reject",
  };
  const payload = buildPublishPayload(items, decisions);
  assert.equal(payload.approved, true);
  assert.equal(payload.counts.approved, 1);
  assert.equal(payload.approvedItems.length, 1);
  assert.equal(payload.approvedItems[0].title, "First update");
  assert.match(payload.summary, /Weekly Update approval summary/);
  assert.match(payload.summary, /Approved \(1\)/);
  assert.match(payload.summary, /Rejected \(1\)/);
});

test("publish API writes weekly data containing only approved cards", () => {
  const weeklySource = buildUpdatedWeeklyFile(items.slice(0, 1));
  assert.match(weeklySource, /^const weekly = /);
  assert.match(weeklySource, /First update/);
  assert.doesNotMatch(weeklySource, /Second update/);
  assert.match(weeklySource, /export default weekly;/);
});

test("weekly review publish detects when PR branch already contains only approved cards", () => {
  const approvedOnly = [items[0]];
  assert.equal(weeklyItemsMatchApproved(approvedOnly, approvedOnly), true);
  assert.equal(weeklyItemsMatchApproved(items, approvedOnly), false);
  assert.equal(weeklyItemsMatchApproved(approvedOnly, items), false);
  assert.equal(weeklyItemsMatchApproved([{ ...items[0], sourceRepository:"community-suggestion" }], approvedOnly), false);
});

test("publish API refuses missing token, wrong token, and non-preview deployments", () => {
  const env = {
    WEEKLY_REVIEW_PUBLISH_TOKEN:"review-secret",
    GITHUB_TOKEN:"github-token",
    VERCEL_GIT_PULL_REQUEST_ID:"15",
    VERCEL_GIT_COMMIT_REF:"chore/weekly-update-20260906",
  };
  assert.equal(validatePublishRequest({ body:{ token:"review-secret", approved:true, approvedItems:[items[0]] } }, env).ok, true);
  assert.equal(validatePublishRequest({ body:{ token:"wrong", approved:true, approvedItems:[items[0]] } }, env).status, 401);
  assert.equal(validatePublishRequest({ body:{ token:"review-secret", approved:false, approvedItems:[items[0]] } }, env).status, 400);
  assert.equal(validatePublishRequest({ body:{ token:"review-secret", approved:true, approvedItems:[] } }, env).status, 400);
  assert.equal(validatePublishRequest({ body:{ token:"review-secret", approved:true, approvedItems:[items[0]] } }, { ...env, VERCEL_GIT_PULL_REQUEST_ID:"" }).status, 400);

  const config = resolvePublishConfig(env);
  assert.equal(config.owner, "Afakhreddine");
  assert.equal(config.repo, "GIHub");
  assert.equal(config.pullNumber, 15);
});

test("publish API refuses ambiguous or unverifiable reader-suggestion approvals", () => {
  const env = { WEEKLY_REVIEW_PUBLISH_TOKEN:"review-secret", GITHUB_TOKEN:"github-token", VERCEL_GIT_PULL_REQUEST_ID:"15" };
  const base = { token:"review-secret", approved:true };
  const one = { ...items[0], sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" };
  const two = { ...items[1], sourceRepository:"community-suggestion", suggestionId:"lead-123", matchStatus:"provisional", pmid:"34414201", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" };
  assert.equal(validatePublishRequest({ body:{ ...base, approvedItems:[one] } }, env).ok, true);
  assert.equal(validatePublishRequest({ body:{ ...base, approvedItems:[one, two] } }, env).status, 400);
  assert.equal(validatePublishRequest({ body:{ ...base, approvedItems:[{ ...one, matchStatus:"unresolved" }] } }, env).status, 400);
  assert.equal(validatePublishRequest({ body:{ ...base, approvedItems:[{ ...one, studyUrl:"https://evil.example/?id=42476609" }] } }, env).status, 400);
});
