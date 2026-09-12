import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import scheduleResources from "../src/data/scheduleResources.js";
import ScheduleReview from "../src/ScheduleReview.jsx";
import ReviewHub from "../src/ReviewHub.jsx";
import { parseScheduleResourcesModuleSource } from "../api/schedule-review-data.js";
import { filterScheduleResourcesToApproved, parseScheduleResourcesSource } from "../api/schedule-review-publish.js";
import { flattenScheduleReviewItems } from "../src/scheduleReviewModel.js";

test("schedule review route renders cards and publish controls", () => {
  const html = renderToStaticMarkup(React.createElement(ScheduleReview, { resources:scheduleResources }));
  assert.match(html, /Schedule Search-Result Review/);
  assert.match(html, /Search Schedule cards/);
  assert.match(html, /Publish approved/);
  assert.match(html, /Approve/);
  assert.match(html, /Hold/);
  assert.match(html, /Reject/);
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
      guidelines:[{ org:"ACG", title:"Preserve guideline", url:"https://example.com/g1" }],
      newsAndArticles:[
        { title:"Preserve archive article", url:"https://example.com/archive", source:"Journal", sourceRepository:"weekly-archive" },
        { title:"Keep new article", url:"https://example.com/a1", source:"Journal", sourceRepository:"targeted-online-pull" },
        { title:"Drop new article", url:"https://example.com/a2", source:"Journal", sourceRepository:"targeted-online-pull" },
      ],
      quiz:[],
      quizStatus:"pending-autocontent-pdf-pull",
    },
  };
  const items = flattenScheduleReviewItems(resources);
  const approvedItems = items.filter(item => /Keep/.test(item.title));
  const filtered = filterScheduleResourcesToApproved(resources, approvedItems);
  assert.deepEqual(filtered["topic-a"].guidelines.map(item => item.title), ["Preserve guideline"]);
  assert.deepEqual(filtered["topic-a"].newsAndArticles.map(item => item.title), ["Preserve archive article", "Keep new article"]);
  assert.equal(filtered["topic-a"].quizStatus, "pending-autocontent-pdf-pull");
  assert.equal(filtered["topic-a"].resourceStatus, "approved");
});
