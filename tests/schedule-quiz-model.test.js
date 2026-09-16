import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyScheduleQuizArtifacts,
  normalizeAutoContentQuiz,
} from "../src/scheduleQuizModel.js";

const autocontentQuiz = {
  quiz: [
    {
      question: "What is the best next step?",
      answerOptions: [
        { text: "Treat H. pylori", isCorrect: true, rationale: "Eradication is recommended." },
        { text: "Ignore the finding", isCorrect: false, rationale: "This misses risk reduction." },
        { text: "Start chemotherapy", isCorrect: false, rationale: "No malignancy is described." },
        { text: "Repeat CT daily", isCorrect: false, rationale: "This is not indicated." },
      ],
      hint: "Think guideline-based management.",
    },
    {
      question: "Which study result is most important?",
      options: ["A. Lower rebleeding", "B. Higher mortality", "C. No follow-up", "D. No intervention"],
      correct: "A",
      explanation: "The trial outcome focused on reduced recurrent bleeding.",
    },
  ],
};

test("normalizes AutoContent quiz output into GIHub's UI-friendly quiz shape", () => {
  const normalized = normalizeAutoContentQuiz(autocontentQuiz, { limit: 10 });

  assert.equal(normalized.length, 2);
  assert.deepEqual(normalized[0], {
    question: "What is the best next step?",
    options: [
      "A. Treat H. pylori",
      "B. Ignore the finding",
      "C. Start chemotherapy",
      "D. Repeat CT daily",
    ],
    correct: "A",
    explanation: "Eradication is recommended.",
    hint: "Think guideline-based management.",
  });
  assert.deepEqual(normalized[1], {
    question: "Which study result is most important?",
    options: ["A. Lower rebleeding", "B. Higher mortality", "C. No follow-up", "D. No intervention"],
    correct: "A",
    explanation: "The trial outcome focused on reduced recurrent bleeding.",
  });
});

test("applies 10-question AutoContent quizzes to schedule resources with completed status and source PDFs", () => {
  const resources = {
    "stomach-pathology": {
      guidelines: [],
      newsAndArticles: [],
      quiz: [],
      quizStatus: "pending-autocontent-pdf-pull",
      quizSourcePdfs: [],
    },
  };
  const artifactQuiz = {
    quiz: Array.from({ length: 12 }, (_, index) => ({
      question: `Question ${index + 1}?`,
      options: ["A. Alpha", "B. Beta", "C. Gamma", "D. Delta"],
      correct: index % 2 === 0 ? "B" : "D",
      explanation: `Explanation ${index + 1}.`,
    })),
  };

  const next = applyScheduleQuizArtifacts(resources, {
    "stomach-pathology": {
      quizJson: artifactQuiz,
      sourcePdfs: ["/tmp/source-1.pdf", "/tmp/source-2.pdf"],
      generatedAt: "2026-09-15T00:00:00.000Z",
    },
  });

  assert.equal(next["stomach-pathology"].quiz.length, 10);
  assert.equal(next["stomach-pathology"].quizStatus, "autocontent-complete");
  assert.deepEqual(next["stomach-pathology"].quizSourcePdfs, ["/tmp/source-1.pdf", "/tmp/source-2.pdf"]);
  assert.equal(next["stomach-pathology"].quizGeneratedAt, "2026-09-15T00:00:00.000Z");
});
