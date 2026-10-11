import { test } from "node:test";
import assert from "node:assert/strict";
import { CALENDAR_EVENTS, LECTURE_TOPICS } from "../src/scheduleConfig.js";
import {
  buildPubMedSearch,
  buildTopicConfigsFromCalendar,
  searchTermsForTopic,
} from "../scripts/populate-schedule-targeted-candidates.mjs";

test("targeted schedule pull derives topics from current calendar config", () => {
  const configs = buildTopicConfigsFromCalendar();
  assert.deepEqual(Object.keys(configs), LECTURE_TOPICS.map(topic => topic.slug));
  for (const event of CALENDAR_EVENTS.filter(event => event.slug)) {
    assert.equal(configs[event.slug].topic, event.topic);
    assert.equal(configs[event.slug].eventDate, event.date);
    assert.equal(configs[event.slug].minTargetedCandidates, 2);
    assert.match(configs[event.slug].search, /2025:2026\[pdat\]/);
  }
});

test("targeted schedule pull automatically handles a future built calendar", () => {
  const futureEvents = [
    { date:"2026-11-03", label:"Board Review", topic:null, slug:null },
    { date:"2026-11-10", label:"IBD conference", topic:"IBD", slug:"ibd" },
    { date:"2026-11-17", label:"GI Bleeding", topic:"GI Bleeding", slug:"gi-bleeding" },
  ];
  const configs = buildTopicConfigsFromCalendar(futureEvents);
  assert.deepEqual(Object.keys(configs), ["ibd", "gi-bleeding"]);
  assert.match(configs.ibd.search, /Crohn\[Title\/Abstract\]|ulcerative colitis\[Title\/Abstract\]|inflammatory bowel disease\[Title\/Abstract\]/);
  assert.match(configs["gi-bleeding"].search, /gastrointestinal bleeding\[Title\/Abstract\]/);
  assert.match(configs.ibd.search, /2025:2026\[pdat\]/);
});

test("topic search terms include specialty expansions plus raw topic fallback", () => {
  assert.ok(searchTermsForTopic("AI in GI Research", "AI in GI Research", "ai-in-gi-research").includes("AI-assisted colonoscopy"));
  assert.ok(searchTermsForTopic("Unusual Motility Topic", "Unusual Motility Topic", "unusual-motility-topic").includes("Unusual Motility Topic"));
  assert.match(buildPubMedSearch({ topic:"Colon Polyps Pathology", label:"Colon Polyps Pathology", slug:"colon-polyps-pathology", eventDate:"2027-02-01" }), /2026:2027\[pdat\]/);
});
