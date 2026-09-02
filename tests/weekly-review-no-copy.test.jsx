import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import WeeklyReview from "../src/WeeklyReview.jsx";

test("weekly review publish UI has no copy-summary fallback button", () => {
  const html = renderToStaticMarkup(React.createElement(WeeklyReview, { items:[{
    type:"Research",
    impactLevel:"High Impact",
    date:"Sep 1, 2026",
    topic:"IBD",
    title:"Reviewable card",
    source:"journal.example",
    summary:"Summary",
    url:"https://example.com",
    studyUrl:"",
  }] }));
  assert.match(html, /Publish approved/);
  assert.doesNotMatch(html, /Copy approval summary/);
  assert.doesNotMatch(html, /Copy summary/);
});
