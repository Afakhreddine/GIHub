import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

function quizPayload() {
  return {
    quiz: Array.from({ length: 10 }, (_, index) => ({
      question: `Question ${index + 1}?`,
      answerOptions: [
        { text: "Answer A", isCorrect: index % 4 === 0, rationale: "A rationale." },
        { text: "Answer B", isCorrect: index % 4 === 1, rationale: "B rationale." },
        { text: "Answer C", isCorrect: index % 4 === 2, rationale: "C rationale." },
        { text: "Answer D", isCorrect: index % 4 === 3, rationale: "D rationale." },
      ],
    })),
  };
}

test("schedule AutoContent import script writes completed quizzes into scheduleResources", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "schedule-quiz-import-"));
  const artifactDir = path.join(tmp, "artifacts");
  const output = path.join(tmp, "scheduleResources.js");
  fs.mkdirSync(path.join(artifactDir, "stomach-pathology"), { recursive: true });
  fs.writeFileSync(path.join(artifactDir, "stomach-pathology", "stomach-pathology-quiz.json"), JSON.stringify(quizPayload()));
  const sourcePdf = path.join(tmp, "stomach-pathology.pdf");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% fake test PDF\n");
  const manifest = path.join(tmp, "source-manifest.json");
  fs.writeFileSync(manifest, JSON.stringify({ "stomach-pathology": { topic: "Stomach Pathology", pdf: sourcePdf } }));

  execFileSync("node", [
    "scripts/apply-schedule-autocontent-quizzes.mjs",
    "--artifact-dir", artifactDir,
    "--source-manifest", manifest,
    "--output", output,
    "--generated-at", "2026-09-15T00:00:00.000Z",
  ], { cwd: process.cwd(), stdio: "pipe" });

  const written = fs.readFileSync(output, "utf8");
  assert.match(written, /autocontent-complete/);
  assert.match(written, /Question 10\?/);
  assert.match(written, /stomach-pathology\.pdf/);
});
