import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import weekly from "../src/data/weekly.js";

test("repo-managed weekly update data is non-empty and schema-compatible", () => {
  assert.ok(Array.isArray(weekly));
  assert.ok(weekly.length > 0);
  for (const item of weekly) {
    assert.notEqual(item.status, "candidate", `${item.title} must not be an unapproved candidate on the public Weekly Update`);
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
