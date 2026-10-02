import { test } from "node:test";
import assert from "node:assert/strict";
import { CALENDAR_MONTH, CALENDAR_EVENTS, LECTURE_TOPICS } from "../src/scheduleConfig.js";

test("October 2026 lecture schedule is imported from Ali's calendar image", () => {
  assert.equal(CALENDAR_MONTH, "October 2026");
  assert.deepEqual(
    CALENDAR_EVENTS.map(e => [e.date, e.label, e.topic, e.slug]),
    [
      ["2026-10-01", "Landon Kozai and Michael Heffernan", null, null],
      ["2026-10-02", "Pathology: Colon Polyps — Dr. Bao", "Colon Polyps Pathology", "colon-polyps-pathology"],
      ["2026-10-06", "MEET AND GREET", null, null],
      ["2026-10-08", "Katie Choi and Daniel Na (R)", null, null],
      ["2026-10-09", "No Conference (ACG)", null, null],
      ["2026-10-13", "No conference (ACG)", null, null],
      ["2026-10-15", "Surg Path canceled", null, null],
      ["2026-10-16", "Pathology: Appendix and Anus — Dr. Swanson", "Appendix and Anus Pathology", "appendix-and-anus-pathology"],
      ["2026-10-20", "Chiara Maruggi — Celiac Disease", "Celiac Disease", "celiac-disease"],
      ["2026-10-22", "Daniela Shemirani (PGY3) and Melanie Wiseman (Navy)", null, null],
      ["2026-10-23", "Pathology: Small Intestine — Dr. Bao", "Small Intestine Pathology", "small-intestine-pathology"],
      ["2026-10-27", "Ali Fakhreddine — AI Lecture", "AI in GI Research", "ai-in-gi-research"],
      ["2026-10-29", "Worsey/Beiermeister and Dr Hunt", null, null],
      ["2026-10-30", "Pathology: Colon — Dr. Du", "Colon Pathology", "colon-pathology"],
    ]
  );
});

test("October clickable lecture topics are derived from educational events with slugs", () => {
  assert.deepEqual(
    LECTURE_TOPICS.map(t => t.slug),
    [
      "colon-polyps-pathology",
      "appendix-and-anus-pathology",
      "celiac-disease",
      "small-intestine-pathology",
      "ai-in-gi-research",
      "colon-pathology",
    ]
  );
});
