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

test("guideline review queue contains the ACG polyposis candidate", () => {
  assert.ok(Array.isArray(candidates));
  const polyposis = candidates.find(item => item.pmid === "42683623");
  assert.ok(polyposis);
  assert.equal(polyposis.org, "ACG");
  assert.match(polyposis.title, /Adenomatous Colorectal Polyposis Syndromes/);
  assert.equal(polyposis.status, "candidate-review");
});

test("guideline review model requires every candidate reviewed before publishing", () => {
  const item = candidates[0];
  const id = guidelineItemId(item);
  assert.equal(id, "pmid:42683623");
  assert.equal(canPublishGuidelineReview(candidates, {}), false);
  assert.equal(canPublishGuidelineReview(candidates, { [id]:"Approve" }), true);
  const payload = buildGuidelinePublishPayload(candidates, { [id]:"Approve" });
  assert.equal(payload.approved, true);
  assert.equal(payload.supplements.length, 1);
  assert.deepEqual(payload.supplements[0], guidelineToSupplement(item));
});

test("guideline review filtering and routes work", () => {
  assert.equal(isGuidelineReviewPath("/review/guidelines"), true);
  assert.equal(isGuidelineReviewPath("/review/guidelines/"), true);
  assert.equal(isGuidelineReviewPath("/review/weekly"), false);
  assert.equal(filterGuidelineItems(candidates, { query:"polyposis", org:"All", decision:"All", decisions:{} }).length, 1);
  assert.equal(filterGuidelineItems(candidates, { query:"", org:"AGA", decision:"All", decisions:{} }).length, 0);
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
  assert.ok(reparsed.some(item => item.url === "https://pubmed.ncbi.nlm.nih.gov/42683623/"));
});
