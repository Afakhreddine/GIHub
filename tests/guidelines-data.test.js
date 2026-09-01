import { test } from "node:test";
import assert from "node:assert/strict";
import guidelines from "../src/data/guidelines.js";

test("guidelines fallback data is non-empty and schema-compatible", () => {
  assert.ok(Array.isArray(guidelines));
  assert.ok(guidelines.length >= 10);
  for (const item of guidelines) {
    assert.match(item.org, /^(ACG|AGA|ASGE|AASLD)$/);
    assert.ok(item.year, "year is required");
    assert.ok(item.month, "month is required");
    assert.ok(item.topic, "topic is required");
    assert.match(item.urgency, /^(High|Moderate|Routine)$/);
    assert.ok(item.title, "title is required");
    assert.ok(item.summary, "summary is required");
    assert.ok("url" in item, "url field is required, even if empty");
  }
});

test("guidelines fallback covers the core GI societies", () => {
  const orgs = new Set(guidelines.map(item => item.org));
  for (const org of ["ACG", "AGA", "ASGE", "AASLD"]) {
    assert.ok(orgs.has(org), `missing ${org}`);
  }
});
