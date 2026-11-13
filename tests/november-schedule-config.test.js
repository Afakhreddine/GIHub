import { test } from "node:test";
import assert from "node:assert/strict";
import { CALENDAR_MONTH, CALENDAR_EVENTS, LECTURE_TOPICS, RESOURCE_TOPICS } from "../src/scheduleConfig.js";

test("November 2026 calendar follows the dated source image in chronological order", () => {
  assert.equal(CALENDAR_MONTH, "November 2026");
  assert.deepEqual(CALENDAR_EVENTS.map(({ date, label, topic, slug }) => [date, label, topic, slug]), [
    ["2026-11-03", "Journal Club — Cam Zenger and Katie Choi", null, null],
    ["2026-11-05", "Ali Sohail (away rotator), Ariel Lee", null, null],
    ["2026-11-06", "Pathology: Appendix/Anus — Dr. Bao", "Appendix and Anus Pathology", "appendix-and-anus-pathology"],
    ["2026-11-10", "Portal Hypertension: Pathophysiology & Pharmacology — Arvin Tan", "Portal Hypertension", "portal-hypertension"],
    ["2026-11-12", "Juliana Provencio (PGY3), Ali Badaoui (PGY3)", null, null],
    ["2026-11-13", "Pathology: Quiz — Dr. Bao", null, null],
    ["2026-11-17", "IBD Journal Club — fellows and papers TBD", null, null],
    ["2026-11-19", "Praveen Wickremasinghe (PGY3), Colleen Boyle (Navy)", null, null],
    ["2026-11-20", "Cirrhosis 101 — Julio Gutierrez", "Cirrhosis", "cirrhosis-101"],
    ["2026-11-24", "Post-AASLD Update — Paul Pockros", "Post-AASLD Update", "post-aasld-update"],
    ["2026-11-26", "Thanksgiving", null, null],
    ["2026-11-27", "No conference (Thanksgiving)", null, null],
  ]);
});

test("all named lecture topics are clickable even while resources or quizzes are pending", () => {
  assert.deepEqual(RESOURCE_TOPICS.map(({ slug }) => slug), [
    "appendix-and-anus-pathology", "portal-hypertension", "cirrhosis-101", "post-aasld-update",
  ]);
  assert.deepEqual(LECTURE_TOPICS.map(({ slug }) => slug), RESOURCE_TOPICS.map(({ slug }) => slug));
  for (const slug of ["portal-hypertension", "cirrhosis-101", "post-aasld-update"]) {
    assert.ok(RESOURCE_TOPICS.some(topic => topic.slug === slug));
    assert.ok(CALENDAR_EVENTS.some(event => event.slug === slug));
  }
});
