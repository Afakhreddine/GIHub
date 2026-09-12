import { test } from "node:test";
import assert from "node:assert/strict";
import { loadReviewDecisions, normalizeDecisions, reviewDecisionKey, saveReviewDecisions } from "../src/reviewDecisionStore.js";

test("review decision keys are scoped by workflow and PR", () => {
  assert.equal(reviewDecisionKey("weekly", "31"), "gihub:review-decisions:weekly:pr:31");
  assert.equal(reviewDecisionKey("schedule", "28"), "gihub:review-decisions:schedule:pr:28");
  assert.equal(reviewDecisionKey("bad", "28"), "");
  assert.equal(reviewDecisionKey("schedule", "not-a-pr"), "");
});

test("review decisions normalization keeps only valid decisions", () => {
  assert.deepEqual(normalizeDecisions({ a:"Approve", b:"Hold", c:"Reject", d:"Maybe", e:null }), {
    a:"Approve",
    b:"Hold",
    c:"Reject",
  });
  assert.deepEqual(normalizeDecisions(null), {});
});

test("review decisions gracefully no-op when Redis is not configured", async () => {
  const env = {};
  const saved = await saveReviewDecisions({ workflow:"schedule", pullNumber:"28", decisions:{ item:"Approve" } }, env);
  assert.equal(saved.configured, false);
  assert.deepEqual(saved.decisions, { item:"Approve" });
  const loaded = await loadReviewDecisions({ workflow:"schedule", pullNumber:"28" }, env);
  assert.equal(loaded.configured, false);
  assert.deepEqual(loaded.decisions, {});
});
