#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outputPath = path.join(repoRoot, "src", "data", "weekly.js");
const allowedTypes = new Set(["Research", "FDA", "Guideline", "News", "Opinion"]);

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
const weekly = validate(parsed);
const header = `// Repo-managed GIHub weekly update data.\n// Update with: node scripts/update-weekly-data.mjs <weekly.json>\n\n`;
const body = `const weekly = ${JSON.stringify(weekly, null, 2)};\n\nexport default weekly;\n`;
fs.writeFileSync(outputPath, header + body);
console.log(`Wrote ${weekly.length} weekly update items to ${path.relative(repoRoot, outputPath)}`);
