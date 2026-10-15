import { test } from "node:test";
import assert from "node:assert/strict";
import weeklyHandler from "../api/weekly-review-data.js";
import scheduleHandler from "../api/schedule-review-data.js";

async function get(handler, url, githubResponse) {
  const previousFetch = globalThis.fetch;
  const paths = [];
  globalThis.fetch = async (input) => {
    const path = new URL(input).pathname + new URL(input).search;
    paths.push(path);
    return { ok:true, text:async () => JSON.stringify(githubResponse(path)) };
  };
  const res = {
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
  };
  try { await handler({ method:"GET", url }, res); }
  finally { globalThis.fetch = previousFetch; }
  return { ...res, paths };
}

test("published weekly PR has no review cards, even through an explicit PR link", async () => {
  const result = await get(weeklyHandler, "/api/weekly-review-data?pr=66", () => ({ number:66, state:"closed", merged_at:"2026-10-15T23:42:25Z", head:{ ref:"weekly-update-2026-10-11" } }));
  assert.equal(result.code, 200);
  assert.deepEqual(result.body.items, []);
  assert.equal(result.body.reviewStatus, "published");
  assert.deepEqual(result.paths, ["/repos/Afakhreddine/GIHub/pulls/66"]);
});

test("weekly queue is empty when no open weekly PR exists", async () => {
  const result = await get(weeklyHandler, "/api/weekly-review-data", () => []);
  assert.equal(result.code, 200);
  assert.deepEqual(result.body.items, []);
  assert.equal(result.body.reviewStatus, "no-open-pr");
});

test("an open weekly PR still returns its unpublished review cards", async () => {
  const result = await get(weeklyHandler, "/api/weekly-review-data?pr=70", (path) => path.endsWith("/pulls/70")
    ? { number:70, state:"open", head:{ ref:"chore/weekly-update-70" }, html_url:"https://github.com/Afakhreddine/GIHub/pull/70" }
    : { encoding:"base64", content:Buffer.from('const weekly = [{"title":"Unpublished card"}]; export default weekly;').toString("base64") });
  assert.equal(result.code, 200);
  assert.equal(result.body.items[0].title, "Unpublished card");
  assert.equal(result.body.reviewStatus, undefined);
  assert.ok(result.paths[1].includes("/contents/src/data/weekly.js"));
});

for (const workflow of ["schedule", "guidelines"]) {
  test(`published ${workflow} PR has no review cards`, async () => {
    const result = await get(scheduleHandler, `/api/schedule-review-data?workflow=${workflow}&pr=50`, () => ({ number:50, state:"closed", merged_at:"2026-10-15T23:42:25Z", head:{ ref:"review-branch" } }));
    assert.equal(result.code, 200);
    assert.equal(result.body.reviewStatus, "published");
    if (workflow === "schedule") assert.deepEqual(result.body.resources, {});
    else assert.deepEqual(result.body.items, []);
    assert.deepEqual(result.paths, ["/repos/Afakhreddine/GIHub/pulls/50"]);
  });
  test(`${workflow} queue is empty when no open PR exists`, async () => {
    const result = await get(scheduleHandler, `/api/schedule-review-data?workflow=${workflow}`, () => []);
    assert.equal(result.code, 200);
    assert.equal(result.body.reviewStatus, "no-open-pr");
    if (workflow === "schedule") assert.deepEqual(result.body.resources, {});
    else assert.deepEqual(result.body.items, []);
  });
}
