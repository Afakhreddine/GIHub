import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import weekly from "../src/data/weekly.js";
import { isPublicApprovedResource } from "../src/scheduleResourcesModel.js";

test("repo-managed weekly update data is non-empty and schema-compatible", () => {
  assert.ok(Array.isArray(weekly));
  assert.ok(weekly.length > 0);
  for (const item of weekly) {
    if (item.status === "candidate") {
      assert.equal(item.sourceRepository, "community-suggestion", `${item.title} must be an explicitly reviewable reader suggestion`);
      assert.equal(isPublicApprovedResource(item), false, `${item.title} must remain hidden from the public Weekly Update`);
    }
    assert.notEqual(item.resourceStatus, "candidate-review", `${item.title} must not require review on the public Weekly Update`);
    assert.match(item.type, /^(Research|FDA|Guideline|News|Opinion)$/);
    assert.ok("multiSource" in item);
    assert.ok(item.date, "date is required");
    assert.ok(item.topic, "topic is required");
    assert.ok(item.title, "title is required");
    assert.ok(item.source, "source is required");
    assert.ok(item.summary, "summary is required");
    assert.ok("url" in item, "url field is required, even if empty");
    assert.ok("studyUrl" in item, "studyUrl field is required, even if empty");
    if (item.url) assert.match(item.url, /^https?:\/\//);
    if (item.studyUrl) assert.match(item.studyUrl, /^https?:\/\//);
  }
});

test("user-shared AJG October 2026 print articles display their print issue month, not online-first date", () => {
  for (const suffix of ["4061", "3950", "3943", "4054", "3915"]) {
    const card = weekly.find(item => item.studyUrl === `https://doi.org/10.14309/ajg.000000000000${suffix}`);
    assert.ok(card, `missing AJG print card ${suffix}`);
    assert.equal(card.date, "Oct 2026", `${card.title} must show the verified print issue month`);
  }
});

test("weekly writer preserves a source-verified reader suggestion for purple review", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-suggestion-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive:true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const input = join(root, "candidates.json");
    writeFileSync(input, JSON.stringify([{ type:"Research", date:"Sep 2026", topic:"IBD", title:"Verified study", source:"JGH", summary:"Verified source.", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional", matchRank:1, matchCount:1, matchReason:"China multicenter cohort", pmid:"42476609" }]));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding:"utf8" });
    assert.equal(result.status, 0, result.stderr);
    const output = readFileSync(join(root, "src", "data", "weekly.js"), "utf8");
    assert.match(output, /"sourceRepository": "community-suggestion"/);
    assert.match(output, /"status": "candidate"/);
    assert.match(output, /"pmid": "42476609"/);
    assert.match(output, /"matchStatus": "provisional"/);
    assert.match(output, /"matchRank": 1/);
    assert.match(output, /"suggestionId": "lead-123"/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("weekly writer rejects spoofed PubMed links on reader suggestions", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-spoof-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive:true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const input = join(root, "candidates.json");
    writeFileSync(input, JSON.stringify([{ type:"Research", date:"Sep 2026", topic:"IBD", title:"Verified study", source:"JGH", summary:"Verified source.", url:"https://example.com", studyUrl:"https://evil.example/?u=pubmed.ncbi.nlm.nih.gov/42476609", sourceRepository:"community-suggestion", status:"candidate", pmid:"42476609" }]));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding:"utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /matching PubMed PMID/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("weekly writer cannot preapprove a reader suggestion", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-preapprove-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive:true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const input = join(root, "candidates.json");
    writeFileSync(input, JSON.stringify([{ type:"Research", date:"Sep 2026", topic:"IBD", title:"Verified study", source:"JGH", summary:"Verified source.", url:"https://pubmed.ncbi.nlm.nih.gov/42476609/", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/", sourceRepository:"community-suggestion", status:"approved", suggestionId:"lead-123", matchStatus:"confirmed", pmid:"42476609" }]));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding:"utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /candidate status/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("weekly writer retains distinct PubMed alternatives for one suggestion", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-shortlist-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive:true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const input = join(root, "candidates.json");
    const card = { type:"Research", date:"Sep 2026", topic:"IBD", title:"Same suggested title", source:"PubMed", summary:"Two plausible articles for editorial choice.", url:"", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional", matchCount:2 };
    writeFileSync(input, JSON.stringify([{ ...card, matchRank:1, pmid:"42476609", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/42476609/" }, { ...card, matchRank:2, pmid:"34414201", studyUrl:"https://pubmed.ncbi.nlm.nih.gov/34414201/" }]));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding:"utf8" });
    assert.equal(result.status, 0, result.stderr);
    const output = readFileSync(join(root, "src", "data", "weekly.js"), "utf8");
    assert.match(output, /42476609/);
    assert.match(output, /34414201/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("weekly writer rejects excess or inconsistent provisional matches", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-invalid-shortlist-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive:true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const input = join(root, "candidates.json");
    const card = { type:"Research", date:"Sep 2026", topic:"IBD", title:"Same suggested title", source:"PubMed", summary:"Editorial choice.", url:"", sourceRepository:"community-suggestion", status:"candidate", suggestionId:"lead-123", matchStatus:"provisional", matchCount:3 };
    writeFileSync(input, JSON.stringify(["42476609", "34414201", "12345678", "87654321"].map((pmid, i) => ({ ...card, matchRank:Math.min(i + 1, 3), pmid, studyUrl:`https://pubmed.ncbi.nlm.nih.gov/${pmid}/` }))));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding:"utf8" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /shortlist/);
  } finally { rmSync(root, { recursive:true, force:true }); }
});

test("weekly data writer accepts more than twelve distinct review cards", () => {
  const root = mkdtempSync(join(tmpdir(), "gihub-weekly-"));
  try {
    mkdirSync(join(root, "scripts"));
    mkdirSync(join(root, "src", "data"), { recursive: true });
    copyFileSync(fileURLToPath(new URL("../scripts/update-weekly-data.mjs", import.meta.url)), join(root, "scripts", "update-weekly-data.mjs"));
    const candidates = Array.from({ length: 15 }, (_, i) => ({
      type: "Research", date: "Oct 14, 2026", topic: "GI", title: `Distinct study ${i}`,
      source: "Journal", summary: "Verified article for review.", url: `https://example.org/study/${i}`,
    }));
    const input = join(root, "candidates.json");
    writeFileSync(input, JSON.stringify(candidates));
    const result = spawnSync(process.execPath, [join(root, "scripts", "update-weekly-data.mjs"), input], { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const output = readFileSync(join(root, "src", "data", "weekly.js"), "utf8");
    assert.match(output, /Distinct study 14/);
    assert.match(result.stdout, /Wrote 15 weekly update items/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
