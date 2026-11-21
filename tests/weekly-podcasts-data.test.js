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
  assert.equal(weeklyPodcasts[0].id, "weekly-2026-11-20");
  assert.equal(weeklyPodcasts[0].sourceCount, 5);
  assert.equal(weeklyPodcasts[0].duration, "13:13");
  assert.match(weeklyPodcasts[0].editorialNote, /surveillance.*perfectly safe.*interim/i);
  assert.match(weeklyPodcasts[0].editorialNote, /endoscopic healing.*enough for most/i);
  assert.match(weeklyPodcasts[0].editorialNote, /HBV.*followed finite therapy/i);
  assert.match(weeklyPodcasts[0].editorialNote, /billing.*expected.*not measured/i);
  assert.equal(weeklyPodcasts[1].id, "weekly-2026-11-10");
  assert.equal(weeklyPodcasts[2].id, "weekly-2026-11-02");
  assert.match(weeklyPodcasts[1].editorialNote, /17:29.*indomethacin.*cyclooxygenase/i);

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
  const selectedAttempt1 = fs.readFileSync(path.join("public", weeklyPodcasts[0].audioUrl.replace(/^\//, "")));
  assert.equal(crypto.createHash("sha256").update(selectedAttempt1).digest("hex"), "f6f5c113f62c220cee8979ea38b69e61f325440a9bfbd0e53b98478795847189", "publish exact owner-selected Nov 20 attempt 1 without audio edits");
  const selectedAttempt3 = fs.readFileSync(path.join("public", weeklyPodcasts[1].audioUrl.replace(/^\//, "")));
  assert.equal(crypto.createHash("sha256").update(selectedAttempt3).digest("hex"), "c2b6c282f12969216536215223cf212fa889bbf7b73368622dbd83f499f6f2ba", "retain Nov 10 attempt 3 without audio edits");
});
