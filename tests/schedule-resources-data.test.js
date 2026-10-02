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
    assert.ok(publicResource.newsAndArticles.every(item => item.status !== "candidate"), `${event.slug} public articles must not include candidate cards`);
  }
});

test("October AI lecture includes the prior CGH AI tools practical guide", () => {
  assert.ok(
    scheduleResources["ai-in-gi-research"].newsAndArticles.some(item => /Artificial Intelligence Tools for Gastrointestinal Research/i.test(item.title) && item.doi === "10.1016/j.cgh.2026.03.032"),
    "AI in GI Research should include the CGH practical-guide article previously pulled as a PDF",
  );
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
