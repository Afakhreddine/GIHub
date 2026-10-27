import { test } from "node:test";
import assert from "node:assert/strict";
import scheduleResources from "../src/data/scheduleResources.js";
import { CALENDAR_EVENTS } from "../src/scheduleConfig.js";
import { sanitizeScheduleResourceForPublic } from "../src/scheduleResourcesModel.js";

const clickableOctoberEvents = CALENDAR_EVENTS.filter(event => event.slug);

test("October schedule topics have public guidelines and quizzes", () => {
  assert.equal(clickableOctoberEvents.length, 6);

  for (const event of clickableOctoberEvents) {
    const resource = scheduleResources[event.slug];
    assert.ok(resource, `${event.slug} should have a schedule resource bundle`);
    assert.ok(Array.isArray(resource.guidelines), `${event.slug} guidelines should be an array`);
    assert.ok(Array.isArray(resource.newsAndArticles), `${event.slug} newsAndArticles should be an array`);
    assert.ok(resource.guidelines.length > 0, `${event.slug} should include at least one guideline`);
    assert.ok(Array.isArray(resource.quiz) && resource.quiz.length > 0, `${event.slug} should include an interactive quiz`);
    assert.equal(resource.quizStatus, "repo-managed-complete");
    const publicResource = sanitizeScheduleResourceForPublic(resource);
    assert.ok(publicResource.guidelines.length > 0, `${event.slug} should expose approved guidelines publicly`);
    assert.ok(publicResource.quiz.length > 0, `${event.slug} should expose a public quiz`);
    assert.ok(
      publicResource.newsAndArticles.every(item => item.sourceRepository !== "targeted-online-pull" || item.status === "approved"),
      `${event.slug} public articles must not include unapproved targeted online-search cards`,
    );
  }
});

test("October AI lecture lists the AGA living CADe guideline, not the CGH practical guide, and has a source-PDF guideline quiz", () => {
  const lecture = scheduleResources["ai-in-gi-research"];
  assert.ok(lecture.guidelines.some(item => item.org === "AGA" && /Living Clinical Practice Guideline on Computer-Aided Detection/i.test(item.title) && item.url === "https://pubmed.ncbi.nlm.nih.gov/40121061/"));
  assert.ok(lecture.guidelines.every(item => !/Artificial Intelligence Tools for Gastrointestinal Research/i.test(item.title)));
  assert.ok(lecture.newsAndArticles.some(item => /Artificial Intelligence Tools for Gastrointestinal Research/i.test(item.title) && item.doi === "10.1016/j.cgh.2026.03.032"));
  assert.equal(lecture.quiz.length, 10);
  assert.ok(lecture.quizSourcePdfs.includes("gihub_aga_living_cade_guideline_2025.pdf"));
  assert.ok(lecture.quiz.some(item => /no recommendation for or against/i.test(item.options.join(" "))));
  const secondaryOutcomes = lecture.quiz.find(item => /adenoma miss rate \(AMR\)/i.test(item.question));
  assert.match(secondaryOutcomes.explanation, /pooled RR 1\.11/);
  assert.doesNotMatch(secondaryOutcomes.explanation, /11% relative increase/i);
});

test("AI lecture presents verified citations from the speaker's slides as public News and Articles", () => {
  const lecture = scheduleResources["ai-in-gi-research"];
  const event = CALENDAR_EVENTS.find(item => item.slug === "ai-in-gi-research");
  assert.equal(event.date, "2026-10-27");
  const citedPmids = ["41504353", "41920565", "42879271", "40816301", "40834302"];
  const publicArticles = sanitizeScheduleResourceForPublic(lecture).newsAndArticles;
  for (const pmid of citedPmids) {
    const matches = publicArticles.filter(item => item.pmid === pmid);
    assert.equal(matches.length, 1, `presentation citation ${pmid} should appear exactly once publicly`);
    assert.equal(matches[0].url, `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`);
    assert.equal(matches[0].status, "approved");
    assert.equal(matches[0].eventDate, event.date);
  }
  for (const url of [
    "https://techcrunch.com/2026/10/22/microsofts-mustafa-suleyman-says-its-ai-outperforms-doctors-on-hard-cases-as-he-chases-medical-superintelligence/",
    "https://the-decoder.com/gpt-6-astra-solves-49-of-50-physics-research-problems-at-2-40-apiece/",
    "https://www.theneuron.ai/digest/everything-that-happened-in-ai-today-friday-october-23-2026/",
  ]) {
    assert.equal(publicArticles.filter(item => item.url === url && item.status === "approved").length, 1);
  }
  assert.ok(lecture.newsAndArticles.every(item => !/Per Smith|fictional citation/i.test(item.title)));
});

test("October celiac/small-intestine topics include PubMed-backed review metadata", () => {
  assert.ok(
    scheduleResources["celiac-disease"].newsAndArticles.some(item => item.pmid === "41950475"),
    "Celiac Disease should include the 2026 NEJM celiac review PubMed record",
  );
  assert.ok(
    scheduleResources["small-intestine-pathology"].newsAndArticles.some(item => item.pmid === "35691302"),
    "Small Intestine Pathology should include the Lancet coeliac disease PubMed record",
  );
});

test("October colon pathology topics include colorectal/polyp archive material", () => {
  assert.ok(
    scheduleResources["colon-polyps-pathology"].newsAndArticles.some(item => /polyp|polypectomy/i.test(item.title)),
    "Colon Polyps Pathology should include polyp/polypectomy material",
  );
  assert.ok(
    scheduleResources["colon-pathology"].newsAndArticles.some(item => /colorectal|colon|Lynch/i.test(`${item.title} ${item.topic}`)),
    "Colon Pathology should include colorectal/colon archive material",
  );
});

test("schedule topic quiz text is cleaned for plain-text rendering when quizzes are present", () => {
  for (const resource of Object.values(scheduleResources)) {
    for (const quizItem of resource.quiz || []) {
      const fields = [quizItem.question, quizItem.explanation, quizItem.hint || "", ...quizItem.options];
      for (const field of fields) {
        assert.doesNotMatch(field, /\$[^$\n]+\$/, `quiz text should not contain raw inline math delimiters: ${field}`);
        assert.doesNotMatch(field, /\\%/, `quiz text should render literal percent signs: ${field}`);
      }
    }
  }
});

test("schedule topic quizzes do not put every correct answer in the same position", () => {
  for (const [slug, resource] of Object.entries(scheduleResources)) {
    const quiz = resource.quiz || [];
    if (quiz.length < 4) continue;
    const correctLetters = new Set(quiz.map(item => item.correct));
    assert.ok(correctLetters.size > 1, `${slug} should distribute correct answers across positions`);
  }
});
