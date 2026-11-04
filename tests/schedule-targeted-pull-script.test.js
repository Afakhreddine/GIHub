import { test } from "node:test";
import assert from "node:assert/strict";
import { CALENDAR_EVENTS, RESOURCE_TOPICS } from "../src/scheduleConfig.js";
import {
  buildPubMedSearch,
  buildTopicConfigsFromCalendar,
  populateScheduleTargetedCandidates,
  searchTermsForTopic,
} from "../scripts/populate-schedule-targeted-candidates.mjs";

test("targeted schedule pull derives topics from current calendar config", () => {
  const configs = buildTopicConfigsFromCalendar();
  assert.deepEqual(Object.keys(configs), RESOURCE_TOPICS.map(topic => topic.slug));
  for (const event of CALENDAR_EVENTS.filter(event => event.slug || event.resourceSlug)) {
    const slug = event.slug || event.resourceSlug;
    assert.equal(configs[slug].topic, event.topic || event.resourceTopic);
    assert.equal(configs[slug].eventDate, event.date);
    assert.equal(configs[slug].minTargetedCandidates, 2);
    if (event.resourceSearchDeferred) {
      assert.equal(configs[slug].search, "");
      assert.equal(configs[slug].searchDeferred, true);
    } else {
      assert.match(configs[slug].search, /2025:2026\[pdat\]/);
    }
  }
});

test("targeted schedule pull automatically handles a future built calendar", () => {
  const futureEvents = [
    { date:"2026-11-03", label:"Board Review", topic:null, slug:null },
    { date:"2026-11-10", label:"Portal HTN", topic:null, slug:null, resourceTopic:"Portal Hypertension", resourceSlug:"portal-hypertension" },
    { date:"2026-11-17", label:"GI Bleeding", topic:"GI Bleeding", slug:"gi-bleeding" },
  ];
  const configs = buildTopicConfigsFromCalendar(futureEvents);
  assert.deepEqual(Object.keys(configs), ["portal-hypertension", "gi-bleeding"]);
  assert.match(configs["portal-hypertension"].search, /portal hypertension\[Title\/Abstract\]/);
  assert.match(configs["gi-bleeding"].search, /gastrointestinal bleeding\[Title\/Abstract\]/);
  assert.match(configs["portal-hypertension"].search, /2025:2026\[pdat\]/);
});

test("a repeat pull preserves human-curated PubMed cards and leaves deferred topics empty", async () => {
  const curated = { title:"Curated", sourceRepository:"targeted-online-pull", addedBy:"schedule-targeted-online-pull-curated" };
  const resources = {
    "portal-hypertension": { guidelines:[], newsAndArticles:[curated, {...curated, title:"Curated 2"}], quiz:[] },
    "post-aasld-update": { guidelines:[], newsAndArticles:[], quiz:[] },
  };
  const topicConfigs = {
    "portal-hypertension": { topic:"Portal Hypertension", search:"no network should be requested", minTargetedCandidates:2 },
    "post-aasld-update": { topic:"Post-AASLD Update", search:"", searchDeferred:true, minTargetedCandidates:2 },
  };
  const result = await populateScheduleTargetedCandidates({ resources, topicConfigs, write:false });
  assert.deepEqual(result.resources["portal-hypertension"].newsAndArticles, resources["portal-hypertension"].newsAndArticles);
  assert.deepEqual(result.resources["post-aasld-update"].newsAndArticles, []);
  assert.equal(result.audit["portal-hypertension"].needed, 0);
});

test("topic search terms include specialty expansions plus raw topic fallback", () => {
  assert.ok(searchTermsForTopic("AI in GI Research", "AI in GI Research", "ai-in-gi-research").includes("AI-assisted colonoscopy"));
  assert.ok(searchTermsForTopic("Unusual Motility Topic", "Unusual Motility Topic", "unusual-motility-topic").includes("Unusual Motility Topic"));
  assert.match(buildPubMedSearch({ topic:"Colon Polyps Pathology", label:"Colon Polyps Pathology", slug:"colon-polyps-pathology", eventDate:"2027-02-01" }), /2026:2027\[pdat\]/);
});
