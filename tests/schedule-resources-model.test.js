import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildNewsAndArticles,
  findUpcomingScheduleTopics,
  mergeScheduleResourceCandidates,
  scheduleTopicScreener,
  selectMostRecentGuidelinePerSociety,
  validateScheduleResource,
} from "../src/scheduleResourcesModel.js";

const schedule = {
  month: "September 2026",
  events: [
    { date: "2026-09-12", label: "IBS conference", topic: "IBS", slug: "irritable-bowel-syndrome" },
    { date: "2026-11-20", label: "Barrett's esophagus", topic: "Barrett's Esophagus", slug: "barretts-esophagus" },
    { date: "2027-01-01", label: "Too far", topic: "MASH", slug: "mash" },
    { date: "2026-09-15", label: "M&M", topic: null, slug: null },
  ],
};

const guidelineRepo = [
  { org: "ACG", year: "2021", month: "Jan", topic: "IBS", title: "ACG IBS older", summary: "IBS", url: "https://example.com/acg-old" },
  { org: "ACG", year: "2026", month: "Feb", topic: "IBS", title: "ACG IBS newer", summary: "IBS", url: "https://example.com/acg-new" },
  { org: "AGA", year: "2025", month: "Mar", topic: "IBS", title: "AGA IBS", summary: "IBS", url: "https://example.com/aga" },
  { org: "ASGE", year: "2026", month: "Apr", topic: "ERCP", title: "ASGE ERCP", summary: "ERCP", url: "https://example.com/asge" },
];

const currentWeekly = [
  { title: "Smartphone hypnotherapy misses noninferiority threshold in IBS trial", topic: "IBS", summary: "Irritable bowel syndrome digital therapeutic trial.", url: "https://example.com/ibs", studyUrl: "https://doi.org/10.1000/ibs", date: "Sep 1, 2026", source: "news.gastro.org", type: "Research" },
];
const archivedWeekly = [
  { title: "Barrett's ablation outcomes improve", topic: "Barrett's Esophagus", oneLineSummary: "Endoscopic eradication therapy outcomes update.", url: "https://example.com/barrett", doi: "10.1/barrett", date: "Aug 1, 2026", source: "weeklyArchive", type: "Research" },
];

test("selects the most recent relevant guideline for each society", () => {
  const picked = selectMostRecentGuidelinePerSociety("IBS", guidelineRepo);
  assert.equal(picked.length, 2);
  assert.deepEqual(picked.map(g => `${g.org}:${g.title}`), ["ACG:ACG IBS newer", "AGA:AGA IBS"]);
});

test("builds a collapsed News and Articles section from current and archived weekly repositories", () => {
  const items = buildNewsAndArticles("irritable-bowel-syndrome", "IBS", currentWeekly, archivedWeekly);
  assert.equal(items.length, 1);
  assert.equal(items[0].section, "News and Articles");
  assert.equal(items[0].title, currentWeekly[0].title);
  assert.equal(items[0].doi, "10.1000/ibs");
});

test("schedule resources require an always-present interactive quiz", () => {
  const invalid = validateScheduleResource({ guidelines: [], newsAndArticles: [], quiz: [] });
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join("\n"), /quiz/i);

  const valid = validateScheduleResource({
    guidelines: [],
    newsAndArticles: [],
    quiz: [{ question: "Q?", options: ["A. a", "B. b", "C. c", "D. d"], correct: "A", explanation: "Because." }],
  });
  assert.equal(valid.valid, true);
});

test("weekly screener marks new cards for upcoming schedule topics only", () => {
  const upcoming = findUpcomingScheduleTopics(schedule, "2026-09-01", 90);
  assert.deepEqual(upcoming.map(e => e.slug), ["irritable-bowel-syndrome", "barretts-esophagus"]);

  const result = scheduleTopicScreener({
    schedule,
    currentResources: {},
    newWeeklyCards: currentWeekly,
    today: "2026-09-01",
  });

  assert.equal(result.matches.length, 1);
  assert.equal(result.matches[0].slug, "irritable-bowel-syndrome");
  assert.equal(result.matches[0].status, "candidate");
  assert.match(result.matches[0].relevanceReason, /IBS/i);
});

test("schedule screener merge de-duplicates DOI, PMID, URL, or title", () => {
  const resources = {
    "irritable-bowel-syndrome": {
      guidelines: [],
      newsAndArticles: [{ title: currentWeekly[0].title, doi: "10.1000/ibs" }],
      quiz: [{ question: "Q?", options: ["A. a", "B. b", "C. c", "D. d"], correct: "A", explanation: "Because." }],
    },
  };
  const merged = mergeScheduleResourceCandidates(resources, [
    { slug: "irritable-bowel-syndrome", card: currentWeekly[0], status: "candidate", relevanceReason: "Direct IBS match" },
  ]);
  assert.equal(merged["irritable-bowel-syndrome"].newsAndArticles.length, 1);
});
