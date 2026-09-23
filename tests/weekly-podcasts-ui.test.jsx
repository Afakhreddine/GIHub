import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { test } from "node:test";
import assert from "node:assert/strict";
import App from "../src/App.jsx";
import weeklyPodcasts from "../src/data/weeklyPodcasts.js";

test("weekly page features current podcast with prior-episode dropdown", () => {
  const html = renderToStaticMarkup(<App initialActive="weekly" />);
  assert.match(html, /Weekly Podcast/);
  assert.match(html, /Current and prior episodes/);
  assert.match(html, /Rolling archive: latest 3 Weekly Update podcasts stored in-repo/);
  assert.match(html, /audio\/weekly\/weekly-2026-09-22\.mp3/);
  assert.match(html, /Download MP3/);
  for (const podcast of weeklyPodcasts) {
    assert.match(html, new RegExp(podcast.displayDate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
