import { test } from "node:test";
import assert from "node:assert/strict";
import { parseWeeklyModuleSource } from "../api/weekly-review-data.js";
import { weeklyReviewSourceFromLocation } from "../src/weeklyReviewModel.js";

test("weekly review source detects PR number from review URL", () => {
  assert.deepEqual(weeklyReviewSourceFromLocation("https://gi-hub.vercel.app/review/weekly?pr=10"), { pr:"10", latest:false });
  assert.deepEqual(weeklyReviewSourceFromLocation("/review/weekly"), { pr:"", latest:true });
});

test("weekly review data parser extracts cards from src/data/weekly.js module", () => {
  const source = `const weekly = [{"title":"Cron card","date":"Sep 1, 2026"}];\n\nexport default weekly;\n`;
  const cards = parseWeeklyModuleSource(source);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].title, "Cron card");
});

test("weekly review data parser rejects non-array module content", () => {
  assert.throws(() => parseWeeklyModuleSource("const weekly = {}; export default weekly;"), /array/);
});
