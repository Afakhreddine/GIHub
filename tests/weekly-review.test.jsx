import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import weekly from "../src/data/weekly.js";
import WeeklyReview from "../src/WeeklyReview.jsx";
import ScheduleReview from "../src/ScheduleReview.jsx";
import GuidelineReview from "../src/GuidelineReview.jsx";
import {
  buildApprovalSummary,
  filterWeeklyItems,
  isWeeklyReviewPath,
  loadDecisions,
  saveDecisions,
  weeklyItemId,
} from "../src/weeklyReviewModel.js";

// Review behavior must not depend on the number of cards left after publish prunes a PR.
const reviewFixtures = [
  { ...weekly[0], title: "Fixture review card one" },
  { ...weekly[0], title: "Fixture review card two" },
  { ...weekly[0], title: "Fixture review card three" },
];

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
  assert.match(html, /Publish approved/);
});

test("Weekly review presents a provisional PubMed shortlist as distinct purple options", () => {
  const options = [
    { ...weekly[0], title:"Candidate A", sourceRepository:"community-suggestion", suggestionId:"lead-123", pmid:"42476609", matchStatus:"provisional", matchRank:1, matchCount:2, matchReason:"China multicenter chronic diarrhea; inpatient status unconfirmed", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" },
    { ...weekly[0], title:"Candidate B", sourceRepository:"community-suggestion", suggestionId:"lead-123", pmid:"34414201", matchStatus:"provisional", matchRank:2, matchCount:2, matchReason:"Includes inpatients; chronic diarrhea cohort not established", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" },
  ];
  const html = renderToStaticMarkup(<WeeklyReview items={options} />);
  assert.match(html, /Best guess · option 1 of 2/);
  assert.match(html, /Alternative · option 2 of 2/);
  assert.match(html, /inpatient status unconfirmed/);
  assert.doesNotMatch(html, /PMID verified/);
});

test("review pages do not show published production data while looking for an open PR", () => {
  for (const Component of [WeeklyReview, ScheduleReview, GuidelineReview]) {
    const html = renderToStaticMarkup(<Component />);
    assert.match(html, /0 of 0 (cards|candidates)/);
    assert.doesNotMatch(html, /<article\b/);
  }
});

test("reviewed counter ignores saved decisions for cards no longer in the current PR", () => {
  const items = reviewFixtures.slice(0, 2);
  const decisions = {
    [weeklyItemId(items[0])]: "Approve",
    "old date|removed card": "Reject",
    "older date|another removed card": "Hold",
  };
  const previousWindow = globalThis.window;
  globalThis.window = { localStorage:{ getItem:() => JSON.stringify(decisions) } };
  try {
    const html = renderToStaticMarkup(<WeeklyReview items={items} />);
    assert.match(html, /1\/2 reviewed/);
    assert.doesNotMatch(html, /3\/2 reviewed/);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test("weekly review search and filters match card content and decisions", () => {
  const approvedId = weeklyItemId(weekly[0]);
  const decisions = { [approvedId]: "Approve" };

  assert.deepEqual(filterWeeklyItems(weekly, { query: weekly[0].title.toLowerCase(), type: "All", decision: "All", decisions }), [weekly[0]]);
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
    [weeklyItemId(reviewFixtures[0])]: "Approve",
    [weeklyItemId(reviewFixtures[1])]: "Hold",
    [weeklyItemId(reviewFixtures[2])]: "Reject",
  };

  const summary = buildApprovalSummary(reviewFixtures, decisions);
  assert.match(summary, /^Weekly Update approval summary/m);
  assert.match(summary, /Approved \(1\)/);
  assert.match(summary, new RegExp(reviewFixtures[0].title));
  assert.match(summary, /Hold \(1\)/);
  assert.match(summary, /Rejected \(1\)/);
  assert.match(summary, /0 unreviewed/);
  assert.ok(summary.includes(reviewFixtures[0].url));
});