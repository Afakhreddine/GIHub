import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import GuidelineReview from "../src/GuidelineReview.jsx";
import ReviewHub from "../src/ReviewHub.jsx";
import candidates from "../src/data/guidelineReviewCandidates.js";

test("guideline review route renders candidate and publish controls", () => {
  const html = renderToStaticMarkup(React.createElement(GuidelineReview, { items:candidates }));
  assert.match(html, /Guideline Candidate Review/);
  assert.match(html, /AGA\/AASLD Clinical Practice Guideline on Management of Primary Biliary Cholangitis/);
  assert.match(html, /Publish approved/);
  assert.match(html, /PubMed 42914292/);
});

test("review hub includes Guidelines tab", () => {
  const html = renderToStaticMarkup(React.createElement(ReviewHub));
  assert.match(html, /Weekly Update/);
  assert.match(html, /Schedule Cards/);
  assert.match(html, /Guidelines/);
});
