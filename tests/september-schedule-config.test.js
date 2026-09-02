import { test } from "node:test";
import assert from "node:assert/strict";
import { CALENDAR_MONTH, CALENDAR_EVENTS, LECTURE_TOPICS } from "../src/scheduleConfig.js";

test("September 2026 lecture schedule is imported from Ali's calendar image", () => {
  assert.equal(CALENDAR_MONTH, "September 2026");
  assert.deepEqual(
    CALENDAR_EVENTS.map(e => [e.date, e.label, e.topic, e.slug]),
    [
      ["2026-09-01", "GI trainee research seminar", null, null],
      ["2026-09-03", "Rachel Dennis, Ashel Lee", null, null],
      ["2026-09-04", "Pathology: Stomach — Dr. Du", "Stomach Pathology", "stomach-pathology"],
      ["2026-09-08", "Doug Hunt — GI Bleeding 101", "GI Bleeding", "gi-bleeding"],
      ["2026-09-10", "Dr. Moawad, Sukhman Dhaliwal (Trinity)", null, null],
      ["2026-09-11", "Excused — Scripps IBD Cutting Edge", null, null],
      ["2026-09-15", "William Strum — Hypertriglyceridemia / Acute Pancreatitis (in person)", "Hypertriglyceridemia / Acute Pancreatitis", "hypertriglyceridemia-acute-pancreatitis"],
      ["2026-09-17", "THALAMUS PRACTICE SESSION", null, null],
      ["2026-09-18", "Pathology: Liver — Dr. Swanson", "Liver Pathology", "liver-pathology"],
      ["2026-09-22", "Katie Choi — IBD, topic TBD", "IBD", "ibd"],
      ["2026-09-24", "Drs. Worsey/Boiermeister, Dr. Deabes", null, null],
      ["2026-09-25", "Pathology: IBD and GI tumors — Dr. Swanson", "IBD and GI Tumors Pathology", "ibd-gi-tumors-pathology"],
      ["2026-09-29", "No lecture — Meet and Greet with Interviewees", null, null],
    ]
  );
});

test("September clickable lecture topics are derived from events with slugs", () => {
  assert.deepEqual(
    LECTURE_TOPICS.map(t => t.slug),
    [
      "stomach-pathology",
      "gi-bleeding",
      "hypertriglyceridemia-acute-pancreatitis",
      "liver-pathology",
      "ibd",
      "ibd-gi-tumors-pathology",
    ]
  );
});
