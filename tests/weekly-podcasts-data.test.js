import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import weeklyPodcasts from "../src/data/weeklyPodcasts.js";

test("weekly podcast metadata uses a rolling in-repo archive", () => {
  assert.ok(Array.isArray(weeklyPodcasts));
  assert.ok(weeklyPodcasts.length > 0);
  assert.ok(weeklyPodcasts.length <= 3, "keep only the latest 3 repo-stored podcasts");

  const dates = weeklyPodcasts.map(p => p.date);
  assert.deepEqual(dates, [...dates].sort().reverse(), "podcasts should be newest first");

  for (const podcast of weeklyPodcasts) {
    assert.match(podcast.id, /^weekly-\d{4}-\d{2}-\d{2}$/);
    assert.ok(podcast.title.includes("Weekly Update Podcast"));
    assert.match(podcast.duration, /^\d{1,2}:\d{2}$/);
    assert.match(podcast.audioUrl, /^\/audio\/weekly\/.+\.mp3$/);
    assert.ok(podcast.sourceCount > 0);
    assert.ok(podcast.description);

    const localPath = path.join("public", podcast.audioUrl.replace(/^\//, ""));
    assert.ok(fs.existsSync(localPath), `${localPath} should exist`);
    const bytes = fs.statSync(localPath).size;
    assert.ok(bytes > 1_000_000, `${localPath} should be a real audio file`);
    assert.ok(bytes < 50 * 1024 * 1024, `${localPath} should stay below GitHub's recommended 50 MB file size`);
    assert.equal(fs.readFileSync(localPath).subarray(0, 3).toString("latin1"), "ID3");
  }
});
