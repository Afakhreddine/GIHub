import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPrompts, isCronAuthorized } from "../api/cron-shared.js";

test("weekly prompt describes the unified GI weekly update feed", () => {
  const { weekly } = buildPrompts();
  assert.match(weekly, /news\.gastro\.org/);
  assert.match(weekly, /healio\.com\/gastroenterology/);
  assert.match(weekly, /gastroendonews\.com/);
});

test("weekly prompt requires working study links and forbids fabricated conference-abstract links", () => {
  const { weekly } = buildPrompts();
  assert.ok(weekly.includes("STUDY LINK"));
  assert.ok(weekly.includes("studyUrl"));
  assert.match(weekly, /do not fabricate a link/i);
});

test("cron authorization is permissive when no CRON_SECRET is configured", () => {
  assert.equal(isCronAuthorized({ headers: {} }, ""), true);
});

test("cron authorization accepts matching bearer token when CRON_SECRET is configured", () => {
  assert.equal(isCronAuthorized({ headers: { authorization: "Bearer test-secret" } }, "test-secret"), true);
});

test("cron authorization rejects missing or mismatched bearer token when CRON_SECRET is configured", () => {
  assert.equal(isCronAuthorized({ headers: {} }, "test-secret"), false);
  assert.equal(isCronAuthorized({ headers: { authorization: "Bearer wrong" } }, "test-secret"), false);
});
