import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWeeklyArchiveFile,
  mergeWeeklyArchive,
  toWeeklyArchiveRecord,
} from "../api/weekly-review-publish.js";

const activeCard = {
  type:"Research",
  impactLevel:"High Impact",
  date:"Aug 23, 2026",
  topic:"Education",
  title:"Artificial Intelligence Tools for Gastrointestinal Research: A Practical Guide",
  source:"cghjournal.org",
  summary:"Narrative practical guide; GI researchers and clinicians; Not applicable. The guide recommends structured AI use for literature discovery, citation verification, writing and editing, presentations, disclosure, and privacy safeguards. It emphasizes independent verification of AI-generated references, statistics, links, and clinical claims.",
  url:"https://www.cghjournal.org/article/S1542-3565(26)00561-6/fulltext",
  studyUrl:"https://doi.org/10.1016/j.cgh.2026.08.001",
};

test("weekly archive record keeps title, one-line summary, and DOI/PMID identifier", () => {
  const record = toWeeklyArchiveRecord(activeCard, { archivedFrom:"2026-09-02" });
  assert.deepEqual(Object.keys(record), ["title", "oneLineSummary", "doi", "pmid", "source", "url", "date", "topic", "type", "archivedFrom"]);
  assert.equal(record.title, activeCard.title);
  assert.equal(record.oneLineSummary, "The guide recommends structured AI use for literature discovery, citation verification, writing and editing, presentations, disclosure, and privacy safeguards.");
  assert.equal(record.doi, "10.1016/j.cgh.2026.08.001");
  assert.equal(record.pmid, "");
});

test("weekly archive merge prepends outgoing active cards and avoids duplicate titles", () => {
  const existing = [{ ...toWeeklyArchiveRecord(activeCard), oneLineSummary:"Already archived" }];
  const merged = mergeWeeklyArchive(existing, [activeCard], { archivedFrom:"2026-09-02" });
  assert.equal(merged.length, 1);
  assert.equal(merged[0].oneLineSummary, "Already archived");
});

test("weekly archive file exports compact archive data", () => {
  const source = buildWeeklyArchiveFile([toWeeklyArchiveRecord(activeCard)]);
  assert.match(source, /Repo-managed abbreviated archive/);
  assert.match(source, /const weeklyArchive = /);
  assert.match(source, /export default weeklyArchive;/);
  assert.doesNotMatch(source, /clinical claims/);
});
