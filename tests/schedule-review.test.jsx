import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import scheduleResources from "../src/data/scheduleResources.js";
import ScheduleReview from "../src/ScheduleReview.jsx";
import { parseScheduleResourcesModuleSource } from "../api/schedule-review-data.js";
import { filterScheduleResourcesToApproved, parseScheduleResourcesSource } from "../api/schedule-review-publish.js";
import { flattenScheduleResources } from "../src/scheduleReviewModel.js";

test("schedule review route renders cards and publish controls", () => {
  const html = renderToStaticMarkup(React.createElement(ScheduleReview, { resources:scheduleResources }));
  assert.match(html, /Schedule Resource Review/);
  assert.match(html, /Search Schedule cards/);
  assert.match(html, /Publish approved/);
  assert.match(html, /Approve/);
  assert.match(html, /Hold/);
  assert.match(html, /Reject/);
});

test("schedule review data parser extracts scheduleResources object", () => {
  const source = `const scheduleResources = {"topic-a":{"guidelines":[],"newsAndArticles":[],"quiz":[]}};\n\nexport default scheduleResources;\n`;
  assert.deepEqual(parseScheduleResourcesModuleSource(source), { "topic-a":{ guidelines:[], newsAndArticles:[], quiz:[] } });
  assert.deepEqual(parseScheduleResourcesSource(source), { "topic-a":{ guidelines:[], newsAndArticles:[], quiz:[] } });
});

test("schedule publish filter keeps only approved guidelines and article cards", () => {
  const resources = {
    "topic-a": {
      guidelines:[{ org:"ACG", title:"Keep guideline", url:"https://example.com/g1" }, { org:"AGA", title:"Drop guideline", url:"https://example.com/g2" }],
      newsAndArticles:[{ title:"Keep article", url:"https://example.com/a1", source:"Journal" }, { title:"Drop article", url:"https://example.com/a2", source:"Journal" }],
      quiz:[],
      quizStatus:"pending-autocontent-pdf-pull",
    },
  };
  const items = flattenScheduleResources(resources);
  const approvedItems = items.filter(item => /Keep/.test(item.title));
  const filtered = filterScheduleResourcesToApproved(resources, approvedItems);
  assert.deepEqual(filtered["topic-a"].guidelines.map(item => item.title), ["Keep guideline"]);
  assert.deepEqual(filtered["topic-a"].newsAndArticles.map(item => item.title), ["Keep article"]);
  assert.equal(filtered["topic-a"].quizStatus, "pending-autocontent-pdf-pull");
  assert.equal(filtered["topic-a"].resourceStatus, "approved");
});
