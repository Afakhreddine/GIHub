import { test } from "node:test";
import assert from "node:assert/strict";
import weekly from "../src/data/weekly.js";

test("repo-managed weekly update data is non-empty and schema-compatible", () => {
  assert.ok(Array.isArray(weekly));
  assert.ok(weekly.length > 0);
  assert.ok(weekly.length <= 12);
  for (const item of weekly) {
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
