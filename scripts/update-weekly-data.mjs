#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(repoRoot, "src", "data", "weekly.js");
const allowedTypes = new Set(["Research", "FDA", "Guideline", "News", "Opinion"]);

function normalizeDoi(value) {
  const match = String(value || "").match(/10\.\d{4,9}\/[^\s?#)]+/i);
  return match ? match[0].replace(/[.,;]+$/, "").toLowerCase() : "";
}

function normalizePmid(value) {
  const match = String(value || "").match(/(?:pubmed\.ncbi\.nlm\.nih\.gov\/|pmid[:\s]*)(\d{6,9})/i);
  return match ? match[1] : "";
}

function normalizeUrlKey(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value || "").trim().toLowerCase();
  }
}

function normalizeTitleKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function weeklyDuplicateKeys(item) {
  const sourceText = [item?.studyUrl, item?.url, item?.summary].filter(Boolean).join(" ");
  return [
    normalizeDoi(sourceText) && `doi:${normalizeDoi(sourceText)}`,
    normalizePmid(sourceText) && `pmid:${normalizePmid(sourceText)}`,
    normalizeUrlKey(item?.studyUrl) && `study:${normalizeUrlKey(item?.studyUrl)}`,
    normalizeUrlKey(item?.url) && `url:${normalizeUrlKey(item?.url)}`,
    normalizeTitleKey(item?.title) && `title:${normalizeTitleKey(item?.title)}`,
  ].filter(Boolean);
}

function dedupeWeeklyItems(items) {
  const seen = new Set();
  const unique = [];
  const duplicates = [];
  for (const item of items || []) {
    const keys = weeklyDuplicateKeys(item);
    if (keys.some((key) => seen.has(key))) {
      duplicates.push(item);
      continue;
    }
    for (const key of keys) seen.add(key);
    unique.push(item);
  }
  return { unique, duplicates };
}

function usage() {
  console.error("Usage: node scripts/update-weekly-data.mjs /path/to/weekly.json");
  process.exit(2);
}

function assertUrl(value, field, index) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("bad protocol");
  } catch {
    throw new Error(`Item ${index}: ${field} must be an http(s) URL or empty string`);
  }
}

function validate(items) {
  if (!Array.isArray(items)) throw new Error("Input must be a JSON array");
  if (items.length === 0) throw new Error("Weekly update cannot be empty");
  if (items.length > 12) throw new Error("Weekly update should contain at most 12 items");

  return items.map((item, i) => {
    const out = {
      type: String(item.type || "").trim(),
      impactLevel: String(item.impactLevel || "Noteworthy").trim(),
      multiSource: Boolean(item.multiSource),
      date: String(item.date || "").trim(),
      topic: String(item.topic || "").trim(),
      title: String(item.title || "").trim(),
      authors: String(item.authors || "").trim(),
      source: String(item.source || "").trim(),
      summary: String(item.summary || "").trim(),
      url: String(item.url || "").trim(),
      studyUrl: String(item.studyUrl || "").trim(),
    };

    if (!allowedTypes.has(out.type)) throw new Error(`Item ${i}: invalid type ${out.type}`);
    for (const field of ["date", "topic", "title", "source", "summary"]) {
      if (!out[field]) throw new Error(`Item ${i}: ${field} is required`);
    }
    assertUrl(out.url, "url", i);
    assertUrl(out.studyUrl, "studyUrl", i);
    return out;
  });
}

const input = process.argv[2];
if (!input) usage();
const parsed = JSON.parse(fs.readFileSync(input, "utf8"));
const validated = validate(parsed);
const { unique:weekly, duplicates } = dedupeWeeklyItems(validated);
const header = `// Repo-managed GIHub weekly update data.\n// Update with: node scripts/update-weekly-data.mjs <weekly.json>\n\n`;
const body = `const weekly = ${JSON.stringify(weekly, null, 2)};\n\nexport default weekly;\n`;
fs.writeFileSync(outputPath, header + body);
const duplicateNote = duplicates.length ? ` (${duplicates.length} duplicate removed)` : "";
console.log(`Wrote ${weekly.length} weekly update items to ${path.relative(repoRoot, outputPath)}${duplicateNote}`);
