import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import App from "../src/App.jsx";

test("schedule lecture panel uses collapsed News and Articles label", () => {
  const html = renderToStaticMarkup(<App initialActive="schedule" />);
  assert.match(html, /Schedule/);
  assert.doesNotMatch(html, /RECENT ARTICLES/);
  assert.doesNotMatch(html, /RELATED NEWS/);
});

test("schedule lecture panel reads repo-managed resources instead of requiring lecture API", () => {
  const source = fs.readFileSync("src/App.jsx", "utf8");
  assert.match(source, /import scheduleResources from "\.\/data\/scheduleResources\.js"/);
  assert.match(source, /const localResource = scheduleResources\[event\.slug\]/);
  assert.match(source, /guideline: localResource\.guidelines/);
});
