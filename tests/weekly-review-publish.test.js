import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildPublishPayload,
  canPublishWeeklyReview,
  weeklyReviewDecisionCounts,
} from "../src/weeklyReviewModel.js";
import { buildUpdatedWeeklyFile, resolvePublishConfig, validatePublishRequest } from "../api/weekly-review-publish.js";

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
