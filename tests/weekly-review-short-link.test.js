import { test } from "node:test";
import assert from "node:assert/strict";
import { chooseLatestWeeklyReviewPull } from "../api/weekly-review-data.js";
import { weeklyReviewDataApiPath, weeklyReviewSourceFromLocation } from "../src/weeklyReviewModel.js";

test("short weekly review URL requests latest weekly PR automatically", () => {
  assert.deepEqual(weeklyReviewSourceFromLocation("https://gi-hub.vercel.app/review/weekly"), { pr:"", latest:true });
  assert.equal(weeklyReviewDataApiPath({ pr:"", latest:true }), "/api/weekly-review-data");
});

test("explicit PR remains supported for fallback and debugging", () => {
  assert.deepEqual(weeklyReviewSourceFromLocation("https://gi-hub.vercel.app/review/weekly?pr=10"), { pr:"10", latest:false });
  assert.equal(weeklyReviewDataApiPath({ pr:"10", latest:false }), "/api/weekly-review-data?pr=10");
});

test("latest weekly PR selection ignores unrelated pull requests", () => {
  const pulls = [
    { number:4, title:"RFC: requirements", head:{ ref:"docs/user-profiles-requirements" }, updated_at:"2026-05-13T02:01:41Z" },
    { number:10, title:"chore: update weekly GI news", head:{ ref:"chore/weekly-update-20260830" }, updated_at:"2026-08-30T08:13:50Z" },
    { number:20, title:"fix: unrelated", head:{ ref:"fix/unrelated" }, updated_at:"2026-09-02T00:00:00Z" },
    { number:11, title:"chore: update weekly GI news", head:{ ref:"chore/weekly-update-20260906" }, updated_at:"2026-09-06T08:13:50Z" },
  ];
  assert.equal(chooseLatestWeeklyReviewPull(pulls).number, 11);
});
