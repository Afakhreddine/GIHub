import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPrompts } from "./cron-shared.js";

test("articles prompt defines all three impactLevel tiers", () => {
  const { articles } = buildPrompts();
  assert.match(articles, /"Practice-changing"\s*=/);
  assert.match(articles, /"High Impact"\s*=/);
  assert.match(articles, /"Noteworthy"\s*=/);
});

test("articles prompt still emits the JSON schema example", () => {
  const { articles } = buildPrompts();
  assert.ok(articles.includes(`"impactLevel":"Practice-changing|High Impact|Noteworthy"`));
});

test("news prompt is unaffected by the taxonomy change", () => {
  const { news } = buildPrompts();
  assert.ok(news.includes(`"category":"FDA Approval|Drug News|Research|Industry|Policy"`));
  assert.ok(!news.includes("Practice-changing"));
});
