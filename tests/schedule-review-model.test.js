import { test } from "node:test";
import assert from "node:assert/strict";
import scheduleResources from "../src/data/scheduleResources.js";
import {
  buildScheduleApprovalSummary,
  canPublishScheduleReview,
  filterScheduleReviewItems,
  flattenScheduleResources,
  isScheduleReviewPath,
  scheduleReviewItemId,
  scheduleReviewSourceFromLocation,
} from "../src/scheduleReviewModel.js";

test("schedule review route and source parsing work", () => {
  assert.equal(isScheduleReviewPath("/review/schedule"), true);
  assert.equal(isScheduleReviewPath("/review/schedule/"), true);
  assert.equal(isScheduleReviewPath("/review/weekly"), false);
  assert.deepEqual(scheduleReviewSourceFromLocation("https://gi-hub.vercel.app/review/schedule?pr=28"), { pr:"28", latest:false });
  assert.deepEqual(scheduleReviewSourceFromLocation("/review/schedule"), { pr:"", latest:true });
});

test("schedule resources flatten into reviewable guideline and article cards", () => {
  const items = flattenScheduleResources(scheduleResources);
  assert.ok(items.length > 0);
  assert.ok(items.some(item => item.kind === "Guideline"));
  assert.ok(items.some(item => item.kind === "News and Articles"));
  assert.ok(items.every(item => item.slug && item.title));
});

test("schedule review filters and publication readiness mirror weekly review", () => {
  const items = flattenScheduleResources(scheduleResources).slice(0, 3);
  const first = items[0];
  const decisions = Object.fromEntries(items.map(item => [scheduleReviewItemId(item), "Approve"]));
  assert.equal(canPublishScheduleReview(items, decisions), true);
  assert.equal(filterScheduleReviewItems(items, { query:first.title.slice(0, 8), slug:"All", kind:"All", decision:"All", decisions }).length >= 1, true);
  assert.equal(filterScheduleReviewItems(items, { query:"", slug:first.slug, kind:first.kind, decision:"Approve", decisions }).every(item => item.slug === first.slug && item.kind === first.kind), true);
  const summary = buildScheduleApprovalSummary(items, decisions);
  assert.match(summary, /Schedule resource approval summary/);
  assert.match(summary, /Approved \(3\)/);
});
