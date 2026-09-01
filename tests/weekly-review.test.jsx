import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import weekly from "../src/data/weekly.js";
import WeeklyReview from "../src/WeeklyReview.jsx";
import {
  buildApprovalSummary,
  filterWeeklyItems,
  isWeeklyReviewPath,
  loadDecisions,
  saveDecisions,
  weeklyItemId,
} from "../src/weeklyReviewModel.js";

test("weekly review route renders repo-managed cards and review controls", () => {
  assert.equal(isWeeklyReviewPath("/review/weekly"), true);
  assert.equal(isWeeklyReviewPath("/review/weekly/"), true);
  assert.equal(isWeeklyReviewPath("/"), false);

  const html = renderToStaticMarkup(<WeeklyReview items={weekly} />);
  assert.match(html, /Weekly Update Review/);
  assert.match(html, new RegExp(weekly[0].title));
  assert.match(html, /Search weekly updates/);
  assert.match(html, /Approve/);
  assert.match(html, /Hold/);
  assert.match(html, /Reject/);
  assert.match(html, /Open source/);
  assert.match(html, /Open study/);
  assert.ok(html.includes(weekly[0].url));
  assert.ok(html.includes(weekly[0].studyUrl));
  assert.match(html, /Copy approval summary/);
});

test("weekly review search and filters match card content and decisions", () => {
  const approvedId = weeklyItemId(weekly[0]);
  const decisions = { [approvedId]: "Approve" };

  assert.deepEqual(filterWeeklyItems(weekly, { query: weekly[0].topic.toLowerCase(), type: "All", decision: "All", decisions }), [weekly[0]]);
  assert.ok(filterWeeklyItems(weekly, { query: "", type: "Research", decision: "All", decisions }).every((item) => item.type === "Research"));
  assert.deepEqual(filterWeeklyItems(weekly, { query: "", type: "All", decision: "Approve", decisions }), [weekly[0]]);
  assert.equal(filterWeeklyItems(weekly, { query: "no matching update", type: "All", decision: "All", decisions }).length, 0);
});

test("weekly review decisions persist locally and tolerate invalid saved data", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const decisions = { [weeklyItemId(weekly[0])]: "Hold" };

  saveDecisions(storage, decisions);
  assert.deepEqual(loadDecisions(storage), decisions);

  values.set("gihub_weekly_review_decisions_v1", "not-json");
  assert.deepEqual(loadDecisions(storage), {});
});

test("approval summary is ready to paste into WhatsApp or a PR", () => {
  const decisions = {
    [weeklyItemId(weekly[0])]: "Approve",
    [weeklyItemId(weekly[1])]: "Hold",
    [weeklyItemId(weekly[2])]: "Reject",
  };

  const summary = buildApprovalSummary(weekly, decisions);
  assert.match(summary, /^Weekly Update approval summary/m);
  assert.match(summary, /Approved \(1\)/);
  assert.match(summary, new RegExp(weekly[0].title));
  assert.match(summary, /Hold \(1\)/);
  assert.match(summary, /Rejected \(1\)/);
  assert.match(summary, new RegExp(`${weekly.length - 3} unreviewed`));
  assert.ok(summary.includes(weekly[0].url));
});