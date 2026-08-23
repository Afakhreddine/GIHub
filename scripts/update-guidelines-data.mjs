#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const OUTPUT = path.join(REPO_ROOT, "src", "data", "guidelines.js");
const MONTHS = new Map([
  ["jan", 1], ["january", 1], ["feb", 2], ["february", 2], ["mar", 3], ["march", 3],
  ["apr", 4], ["april", 4], ["may", 5], ["jun", 6], ["june", 6], ["jul", 7], ["july", 7],
  ["aug", 8], ["august", 8], ["sep", 9], ["sept", 9], ["september", 9], ["oct", 10],
  ["october", 10], ["nov", 11], ["november", 11], ["dec", 12], ["december", 12],
]);

function usage() {
  console.error("Usage: node scripts/update-guidelines-data.mjs <guidelines.json>");
  console.error("Input must be a JSON array of guideline objects.");
}

function monthNumber(month) {
  return MONTHS.get(String(month || "").trim().toLowerCase()) || 0;
}

function canonicalMonth(month) {
  const raw = String(month || "").trim();
  if (!raw) return "";
  const n = monthNumber(raw);
  return n ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][n - 1] : raw;
}

function normalize(item) {
  return {
    org: String(item.org || "").trim().toUpperCase(),
    year: String(item.year || "").trim(),
    month: canonicalMonth(item.month),
    topic: String(item.topic || "").trim(),
    urgency: String(item.urgency || "Routine").trim(),
    title: String(item.title || item.headline || "").trim(),
    summary: String(item.summary || "").trim(),
    url: String(item.url || "").trim(),
  };
}

function keyFor(item) {
  return [item.org, item.year, item.title.toLowerCase().replace(/\s+/g, " ")].join("|");
}

function validate(items) {
  const errors = [];
  const seen = new Set();
  const allowedOrgs = new Set(["ACG", "AGA", "ASGE", "AASLD"]);
  const allowedUrgency = new Set(["High", "Moderate", "Routine"]);
  items.forEach((item, index) => {
    const prefix = `item ${index + 1}`;
    if (!allowedOrgs.has(item.org)) errors.push(`${prefix}: invalid org ${JSON.stringify(item.org)}`);
    if (!/^20\d{2}$/.test(item.year)) errors.push(`${prefix}: invalid year ${JSON.stringify(item.year)}`);
    if (!item.month) errors.push(`${prefix}: month is required`);
    if (!item.topic) errors.push(`${prefix}: topic is required`);
    if (!allowedUrgency.has(item.urgency)) errors.push(`${prefix}: invalid urgency ${JSON.stringify(item.urgency)}`);
    if (!item.title) errors.push(`${prefix}: title is required`);
    if (!item.summary) errors.push(`${prefix}: summary is required`);
    if (item.url && !/^https?:\/\//.test(item.url)) errors.push(`${prefix}: url must be http(s) or empty`);
    const key = keyFor(item);
    if (seen.has(key)) errors.push(`${prefix}: duplicate ${key}`);
    seen.add(key);
  });
  return errors;
}

function sortGuidelines(items) {
  return [...items].sort((a, b) => {
    const yd = Number(b.year) - Number(a.year);
    if (yd) return yd;
    const md = monthNumber(b.month) - monthNumber(a.month);
    if (md) return md;
    return a.org.localeCompare(b.org) || a.title.localeCompare(b.title);
  });
}

function render(items) {
  return `// Repo-managed GIHub guidelines data.\n// Update with: node scripts/update-guidelines-data.mjs <guidelines.json>\n\nconst guidelines = ${JSON.stringify(items, null, 2)};\n\nexport default guidelines;\n`;
}

const inputPath = process.argv[2];
if (!inputPath) {
  usage();
  process.exit(2);
}

let parsed;
try {
  parsed = JSON.parse(fs.readFileSync(inputPath, "utf8"));
} catch (error) {
  console.error(`Could not read/parse ${inputPath}: ${error.message}`);
  process.exit(2);
}

if (!Array.isArray(parsed)) {
  console.error("Input JSON must be an array.");
  process.exit(2);
}

const guidelines = sortGuidelines(parsed.map(normalize));
const errors = validate(guidelines);
if (errors.length) {
  console.error("Guideline data validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

fs.writeFileSync(OUTPUT, render(guidelines));
console.log(`Wrote ${guidelines.length} guidelines to ${path.relative(REPO_ROOT, OUTPUT)}`);
