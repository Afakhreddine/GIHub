import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import assert from "node:assert/strict";
import App from "../src/App.jsx";

test("top-level standalone Quiz tab is hidden for now", () => {
  const html = renderToStaticMarkup(<App />);
  assert.match(html, /Clinical Guidelines/);
  assert.match(html, /Weekly Update/);
  assert.match(html, /Education/);
  assert.match(html, /Schedule/);
  assert.doesNotMatch(html, />🧠 Quiz</);
});

test("direct standalone quiz activation falls back to Guidelines", () => {
  const html = renderToStaticMarkup(<App initialActive="quiz" />);
  assert.match(html, /Clinical Guidelines/);
  assert.doesNotMatch(html, /GI Quiz/);
});
