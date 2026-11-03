import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import weeklyPodcasts from "../src/data/weeklyPodcasts.js";

test("weekly podcast metadata uses a rolling in-repo archive", () => {
  assert.ok(Array.isArray(weeklyPodcasts));
  assert.ok(weeklyPodcasts.length > 0);
  assert.ok(weeklyPodcasts.length <= 3, "keep only the latest 3 repo-stored podcasts");
  assert.equal(weeklyPodcasts[0].id, "weekly-2026-11-02");
  assert.equal(weeklyPodcasts[0].sourceCount, 6);
  assert.equal(weeklyPodcasts[0].duration, "39:03");
  assert.match(weeklyPodcasts[0].editorialNote, /PCABs \(not PPIs\)/);
  assert.match(weeklyPodcasts[0].editorialNote, /06:08.*24:46.*31:28.*36:43/);

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
  const originalAttempt3 = fs.readFileSync(path.join("public", weeklyPodcasts[0].audioUrl.replace(/^\//, "")));
  assert.equal(crypto.createHash("sha256").update(originalAttempt3).digest("hex"), "c4c0dbc16e7e1edd1d31eee3c10e0e476471de685a6dcf8880a3aff2106db8a9", "publish the original attempt 3 without audio edits");
});
