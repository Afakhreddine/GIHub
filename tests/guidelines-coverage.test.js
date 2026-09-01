import test from "node:test";
import assert from "node:assert/strict";
import GUIDELINES from "../src/data/guidelines.js";

test("repo-managed guidelines retain broad society coverage", () => {
  assert.ok(
    GUIDELINES.length >= 50,
    `expected at least 50 guideline records, found ${GUIDELINES.length}`,
  );

  const counts = GUIDELINES.reduce((acc, item) => {
    acc[item.org] = (acc[item.org] || 0) + 1;
    return acc;
  }, {});

  for (const org of ["ACG", "AGA", "ASGE", "AASLD"]) {
    assert.ok(counts[org] > 0, `missing ${org} guideline records`);
  }
});

test("repo-managed guidelines include the 2026 ACG diverticulitis guideline", () => {
  const item = GUIDELINES.find(
    (guideline) =>
      guideline.org === "ACG" &&
      guideline.year === "2026" &&
      /diverticulitis/i.test(guideline.title),
  );

  assert.ok(item, "missing the new ACG colonic diverticulitis guideline");
  assert.match(item.url, /10\.14309\/ajg\.0000000000004047/);
});
