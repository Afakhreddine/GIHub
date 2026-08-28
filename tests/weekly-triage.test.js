import { test } from "node:test";
import assert from "node:assert/strict";
import { triageCandidates, scoreCandidate } from "../scripts/triage-weekly-candidates.mjs";

const baseCandidate = {
  title: "AI tool improves GI literature review workflow",
  sourceType: "journal article",
  journalOrPublisher: "Clinical Gastroenterology and Hepatology",
  date: "Aug 23, 2026",
  url: "https://www.cghjournal.org/article/S1542-3565(26)00243-0/fulltext",
  studyUrl: "https://doi.org/10.1016/j.cgh.2026.03.032",
  topic: "Education",
  studyDesign: "Narrative review",
  population: "GI researchers and clinicians",
  sampleSize: "",
  primaryOutcome: "Practical AI workflow guidance",
  keyResults: [
    "Use AI tools for literature discovery with independent citation verification.",
    "Disclose significant AI use and avoid uploading patient-level data."
  ],
  limitations: ["Narrative review, not original outcomes research."],
  practiceRelevance: "Can improve GIHub content review workflow.",
  verificationStatus: "verified",
  triageDecision: "include",
  sourceQuality: "journal",
  clinicalImpact: 2,
  novelty: 2,
  evidenceQuality: 2,
  fellowUsefulness: 3,
  actionability: 3,
  timeliness: 2,
};

test("scoreCandidate totals weighted triage dimensions and maps impact level", () => {
  const scored = scoreCandidate(baseCandidate);

  assert.equal(scored.score.total, 14);
  assert.equal(scored.impactLevel, "High Impact");
});

test("triageCandidates includes verified include candidates as Weekly Update items", () => {
  const { weeklyItems, audit } = triageCandidates([baseCandidate]);

  assert.equal(weeklyItems.length, 1);
  assert.equal(weeklyItems[0].title, baseCandidate.title);
  assert.equal(weeklyItems[0].impactLevel, "High Impact");
  assert.equal(weeklyItems[0].url, baseCandidate.url);
  assert.equal(weeklyItems[0].studyUrl, baseCandidate.studyUrl);
  assert.match(weeklyItems[0].summary, /verified/i);
  assert.equal(audit.included, 1);
  assert.equal(audit.verifiedLinks, 1);
});

test("triageCandidates routes guidelines away from Weekly Update", () => {
  const guideline = {
    ...baseCandidate,
    title: "New ACG guideline for condition X",
    sourceType: "guideline",
    triageDecision: "route-to-guidelines",
  };

  const { weeklyItems, audit } = triageCandidates([guideline]);

  assert.equal(weeklyItems.length, 0);
  assert.equal(audit.routedToGuidelines, 1);
});

test("triageCandidates refuses fabricated or unverified studyUrl values", () => {
  const unverified = {
    ...baseCandidate,
    verificationStatus: "unverified",
    studyUrl: "https://example.com/guessed-study-link",
  };

  assert.throws(
    () => triageCandidates([unverified]),
    /unverified studyUrl/i,
  );
});
