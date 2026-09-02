import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import assert from "node:assert/strict";
import App from "../src/App.jsx";

test("schedule lecture panel uses collapsed News and Articles label", () => {
  const html = renderToStaticMarkup(<App initialActive="schedule" />);
  assert.match(html, /Schedule/);
  assert.doesNotMatch(html, /RECENT ARTICLES/);
  assert.doesNotMatch(html, /RELATED NEWS/);
});
