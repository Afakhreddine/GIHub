import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildWeeklyPodcastBrief,
  WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS,
} from "../src/weeklyReviewModel.js";

const items = [
  {
    date:"Sep 1, 2026",
    title:"Approved study",
    topic:"IBD",
    type:"Research",
    source:"journal.example",
    studyUrl:"https://journal.example/approved-study",
    url:"https://news.example/approved-study",
    summary:"A useful IBD study summary.",
  },
  {
    date:"Sep 1, 2026",
    title:"Rejected study",
    topic:"Hepatology",
    type:"Research",
    source:"journal.example",
    studyUrl:"https://journal.example/rejected-study",
    summary:"A rejected hepatology item.",
  },
  {
    date:"Sep 1, 2026",
    title:"Approved source-only story",
    topic:"Endoscopy",
    type:"News",
    source:"news.example",
    url:"https://news.example/source-only",
    summary:"A source-only story with no direct study URL.",
  },
];

test("weekly podcast brief includes only approved cards by default", () => {
  const decisions = {
    "Sep 1, 2026|Approved study":"Approve",
    "Sep 1, 2026|Rejected study":"Reject",
    "Sep 1, 2026|Approved source-only story":"Approve",
  };
  const brief = buildWeeklyPodcastBrief(items, { decisions });
  assert.equal(brief.ready, true);
  assert.equal(brief.articleCount, 2);
  assert.deepEqual(brief.articles.map((item) => item.title), ["Approved study", "Approved source-only story"]);
  assert.equal(brief.articles[0].url, "https://journal.example/approved-study");
  assert.equal(brief.articles[1].url, "https://news.example/source-only");
  assert.equal(brief.autocontent.generate_audio, true);
  assert.equal(brief.autocontent.generate_quiz, false);
  assert.equal(brief.autocontent.duration, "default");
  assert.equal(brief.autocontent.style, "critique");
});

test("weekly podcast instructions require separate PDFs and theme synthesis", () => {
  assert.match(WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS, /separate article PDFs/i);
  assert.match(WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS, /Treat every uploaded PDF as a separate source/i);
  assert.match(WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS, /common themes/i);
  assert.match(WEEKLY_AUTOCONTENT_PODCAST_INSTRUCTIONS, /limitations/i);
});

test("weekly podcast brief can be built from already-published weekly data", () => {
  const brief = buildWeeklyPodcastBrief(items, { approvedOnly:false });
  assert.equal(brief.articleCount, 3);
  assert.equal(brief.articles[0].title, "Approved study");
});
