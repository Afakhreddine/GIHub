import { test } from "node:test";
import assert from "node:assert/strict";
import scheduleResources from "../src/data/scheduleResources.js";
import { CALENDAR_EVENTS } from "../src/scheduleConfig.js";
import { hasApprovedScheduleQuiz, sanitizeScheduleResourceForPublic } from "../src/scheduleResourcesModel.js";

const clickableEvents = CALENDAR_EVENTS.filter(event => event.slug);

test("all named topics have a public detail bundle without exposing unapproved content", () => {
  assert.deepEqual(clickableEvents.map(event => event.slug), ["appendix-and-anus-pathology", "portal-hypertension", "cirrhosis-101", "post-aasld-update"]);
  for (const event of clickableEvents) {
    const resource = scheduleResources[event.slug];
    assert.ok(resource, `${event.slug} should have a schedule resource bundle`);
    assert.ok(Array.isArray(resource.guidelines), `${event.slug} guidelines should be an array`);
    assert.ok(Array.isArray(resource.newsAndArticles), `${event.slug} newsAndArticles should be an array`);
    assert.ok(Array.isArray(resource.quiz), `${event.slug} should have a quiz slot`);
    const publicResource = sanitizeScheduleResourceForPublic(resource);
    assert.ok(publicResource.guidelines.every(item => item.status === "approved"), `${event.slug} must expose only approved guidelines`);
    assert.equal(hasApprovedScheduleQuiz(resource), true, `${event.slug} must have a complete source-PDF-backed quiz`);
    assert.equal(publicResource.quiz.length, 10, `${event.slug} must publish ten quiz questions`);
    assert.ok(
      publicResource.newsAndArticles.every(item => item.sourceRepository !== "targeted-online-pull" || item.status === "approved"),
      `${event.slug} public articles must not include unapproved targeted online-search cards`,
    );
  }
});

test("Post-AASLD quiz identifies official meeting abstracts rather than an unverified speaker presentation", () => {
  const resource = scheduleResources["post-aasld-update"];
  assert.match(resource.resourceNotes, /2026 AASLD late-breaking abstracts/i);
  assert.match(resource.resourceNotes, /not.*speaker.*presentation/i);
  assert.ok(resource.quizSourcePdfs?.includes("2026-late-breaking-abstracts.pdf"));
});

test("new November quizzes retain source-grounded clinical qualifications", () => {
  const portal = scheduleResources["portal-hypertension"].quiz;
  assert.match(portal[1].options.find(option => option.startsWith(`${portal[1].correct}. `)), /of initial endoscopy/);
  assert.match(portal[2].question, /screening upper endoscopy performed previously found no varices/);
  assert.match(portal[6].explanation, /awaits confirmation/);
  assert.match(portal[8].question, /after an episode of gastric variceal hemorrhage/);
  const cirrhosis = scheduleResources["cirrhosis-101"].quiz;
  assert.doesNotMatch(cirrhosis[2].explanation, /overall mortality/);
  assert.match(cirrhosis[7].explanation, /albumin.*day 1.*day 3/);
  const meeting = scheduleResources["post-aasld-update"].quiz;
  assert.match(meeting[0].explanation, /nine.*available.*nine.*100%/i);
  assert.match(meeting[4].question, /ALP ≤ULN and ≥15% reduction/);
  assert.match(meeting[6].explanation, /does not establish NA discontinuation/);
  assert.match(meeting[7].explanation, /adjusted treatment difference/);
});

test("only complete source-based quizzes become public", () => {
  const approved = scheduleResources["appendix-and-anus-pathology"];
  assert.equal(hasApprovedScheduleQuiz(approved), true);
  assert.equal(sanitizeScheduleResourceForPublic(approved).quiz.length, 10);
  for (const partial of [
    { ...approved, quiz: approved.quiz.slice(0, 1), quizStatus: "autocontent-incomplete" },
    { ...approved, quizStatus: "autocontent-incomplete" },
    { ...approved, quizSourcePdfs: [] },
    { ...approved, quiz: approved.quiz.slice(0, 1) },
  ]) {
    assert.equal(hasApprovedScheduleQuiz(partial), false);
    assert.deepEqual(sanitizeScheduleResourceForPublic(partial).quiz, []);
  }
});

test("November Appendix and Anus lecture uses verified guideline records and no unrelated article cards", () => {
  const lecture = scheduleResources["appendix-and-anus-pathology"];
  assert.deepEqual(
    lecture.guidelines.map(item => item.url),
    ["https://pubmed.ncbi.nlm.nih.gov/31725580/", "https://pubmed.ncbi.nlm.nih.gov/29878949/"],
  );
  assert.deepEqual(
    sanitizeScheduleResourceForPublic(lecture).newsAndArticles.map(item => [item.pmid, item.status]),
    [["40635196", "approved"], ["41925804", "approved"]],
  );
  assert.equal(lecture.quiz.length, 10);
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
  const eventDate = "2026-10-27"; // Historical speaker-slide citations retain their original event date.
  const citedPmids = ["41504353", "41920565", "42879271", "40816301", "40834302"];
  const publicArticles = sanitizeScheduleResourceForPublic(lecture).newsAndArticles;
  for (const pmid of citedPmids) {
    const matches = publicArticles.filter(item => item.pmid === pmid);
    assert.equal(matches.length, 1, `presentation citation ${pmid} should appear exactly once publicly`);
    assert.equal(matches[0].url, `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`);
    assert.equal(matches[0].status, "approved");
    assert.equal(matches[0].eventDate, eventDate);
  }
  for (const url of [
    "https://palisaderesearch.github.io/shutdown_avoidance/2025-05-announcement.html",
    "https://time.com/article/2026/10/14/recursive-self-improvement-AI-report/",
    "https://storage.googleapis.com/deepmind-media/gemini/gemini_4_safety_report.pdf",
    "https://www.cnbc.com/2026/09/29/anthropic-warns-ai-existential-risks-ipo-filing-reuters.html",
    "https://doi.org/10.1126/science.aeh7930",
    "https://arxiv.org/abs/2610.05474",
    "https://arxiv.org/abs/2610.16733",
    "https://metr.org/blog/2026-10-22-red-teaming-openai-agent-monitoring/",
    "https://github.com/vectara/hallucination-leaderboard",
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
        assert.doesNotMatch(field, /\\(?:text|alpha|beta|gamma|delta|mu|times|ge|le|sim|log)\b/, `quiz text should not contain TeX commands: ${field}`);
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
