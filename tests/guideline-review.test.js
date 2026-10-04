import { test } from "node:test";
import assert from "node:assert/strict";
import candidates from "../src/data/guidelineReviewCandidates.js";
import {
  buildGuidelinePublishPayload,
  canPublishGuidelineReview,
  filterGuidelineItems,
  guidelineItemId,
  guidelineToSupplement,
  isGuidelineReviewPath,
} from "../src/guidelineReviewModel.js";
import { parseGuidelineCandidatesModuleSource, chooseLatestGuidelineReviewPull } from "../api/schedule-review-data.js";
import { buildGuidelineSupplementsFile, mergeGuidelineSupplements, parseGuidelineSupplementsSource } from "../api/schedule-review-publish.js";

test("guideline review queue contains only verified unpublished candidates", () => {
  assert.ok(Array.isArray(candidates));
  assert.equal(candidates.length, 4);
  assert.deepEqual(candidates.map(item => item.pmid), ["42720640", "42776095", "42820904", "42814045"]);
  assert.equal(candidates.some(item => item.pmid === "42683623"), false);
  for (const item of candidates) {
    assert.equal(item.status, "candidate-review");
    assert.match(item.url, /^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/);
    assert.ok(item.doi);
    assert.ok(item.detectedAt);
    assert.ok(item.reviewReason);
  }
});

test("guideline review model requires every candidate reviewed before publishing", () => {
  const decisions = Object.fromEntries(candidates.map(item => [guidelineItemId(item), "Approve"]));
  assert.equal(guidelineItemId(candidates[0]), "pmid:42720640");
  assert.equal(canPublishGuidelineReview(candidates, {}), false);
  assert.equal(canPublishGuidelineReview(candidates, decisions), true);
  const payload = buildGuidelinePublishPayload(candidates, decisions);
  assert.equal(payload.approved, true);
  assert.equal(payload.supplements.length, candidates.length);
  assert.deepEqual(payload.supplements[0], guidelineToSupplement(candidates[0]));
});

test("guideline review filtering and routes work", () => {
  assert.equal(isGuidelineReviewPath("/review/guidelines"), true);
  assert.equal(isGuidelineReviewPath("/review/guidelines/"), true);
  assert.equal(isGuidelineReviewPath("/review/weekly"), false);
  assert.equal(filterGuidelineItems(candidates, { query:"serrated polyposis", org:"All", decision:"All", decisions:{} }).length, 1);
  assert.equal(filterGuidelineItems(candidates, { query:"", org:"AGA", decision:"All", decisions:{} }).length, 3);
});

test("guideline review API parses candidate modules and selects latest guideline PR", () => {
  const source = `const guidelineReviewCandidates = ${JSON.stringify(candidates, null, 2)};\n\nexport default guidelineReviewCandidates;\n`;
  assert.equal(parseGuidelineCandidatesModuleSource(source).length, candidates.length);
  const pull = chooseLatestGuidelineReviewPull([
    { number:1, title:"other", head:{ ref:"chore/weekly-update-1" }, updated_at:"2026-01-01" },
    { number:2, title:"Guideline candidate review", head:{ ref:"chore/guideline-review-20261003" }, updated_at:"2026-10-03" },
  ]);
  assert.equal(pull.number, 2);
});

test("guideline publish API appends approved supplements without duplicates", () => {
  const existing = [{ org:"ACG", year:"2020", month:"Jan", topic:"IBS", urgency:"Routine", title:"Old", summary:"Old", url:"https://pubmed.ncbi.nlm.nih.gov/1/" }];
  const addition = guidelineToSupplement(candidates[0]);
  const merged = mergeGuidelineSupplements(existing, [addition, addition]);
  assert.equal(merged.length, 2);
  const source = buildGuidelineSupplementsFile(merged);
  const reparsed = parseGuidelineSupplementsSource(source);
  assert.equal(reparsed.length, 2);
  assert.ok(reparsed.some(item => item.url === candidates[0].url));
});
