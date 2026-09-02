import { test } from "node:test";
import assert from "node:assert/strict";
import weeklyArchive from "../src/data/weeklyArchive.js";

test("weekly archive seed is compact and includes prior published cards", () => {
  assert.ok(Array.isArray(weeklyArchive));
  assert.equal(weeklyArchive.length, 7);
  for (const item of weeklyArchive) {
    assert.ok(item.title);
    assert.ok(item.oneLineSummary);
    assert.ok(item.oneLineSummary.length <= 280);
    assert.ok(Object.hasOwn(item, "doi"));
    assert.ok(Object.hasOwn(item, "pmid"));
    assert.doesNotMatch(item.oneLineSummary, /Source verified|AI-assisted summary|Limitation:/i);
  }
});
