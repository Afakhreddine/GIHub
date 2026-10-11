import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyScheduleQuizArtifacts,
  cleanQuizText,
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

test("cleans AutoContent inline math artifacts from quiz text", () => {
  assert.equal(
    cleanQuizText("octreotide long-acting release ($40$ mg every $28$ days)"),
    "octreotide long-acting release (40 mg every 28 days)",
  );
  assert.equal(cleanQuizText("Hemoglobin $< 7$ g/dL and hematocrit $< 35\\%$"), "Hemoglobin < 7 g/dL and hematocrit < 35%");
});

test("normalizes AutoContent quiz output into GIHub's UI-friendly quiz shape", () => {
  const rngValues = [0.1, 0.2, 0.3, 0.4, 0.9, 0.8, 0.7, 0.6];
  let rngIndex = 0;
  const normalized = normalizeAutoContentQuiz(autocontentQuiz, {
    limit: 10,
    rng: () => rngValues[rngIndex++ % rngValues.length],
  });

  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].question, "What is the best next step?");
  assert.equal(normalized[0].explanation, "Eradication is recommended.");
  assert.equal(normalized[0].hint, "Think guideline-based management.");
  assert.equal(normalized[0].options.length, 4);
  assert.ok(normalized[0].options.some(option => option.endsWith("Treat H. pylori")));
  assert.match(
    normalized[0].options.find(option => option.startsWith(`${normalized[0].correct}. `)),
    /Treat H\. pylori$/,
  );

  assert.equal(normalized[1].question, "Which study result is most important?");
  assert.equal(normalized[1].explanation, "The trial outcome focused on reduced recurrent bleeding.");
  assert.equal(normalized[1].options.length, 4);
  assert.match(
    normalized[1].options.find(option => option.startsWith(`${normalized[1].correct}. `)),
    /Lower rebleeding$/,
  );
});

test("normalizes the expert-educator JSON schema requested from AutoContent", () => {
  const payload = {
    quiz_title: "Colon Polyp Management",
    topic: "Colon Polyps",
    questions: [
      {
        id: 1,
        vignette: "A 62-year-old undergoes colonoscopy and has a 12 mm sessile serrated lesion removed. What is the best next management principle?",
        options: {
          A: "Document complete excision and plan surveillance based on polyp risk",
          B: "Ignore serrated lesions unless cancer is present",
          C: "Schedule daily CT scans",
          D: "Treat with empiric chemotherapy",
        },
        correct_answer: "A",
        explanation: {
          summary: "The source emphasizes complete excision and risk-stratified surveillance.",
          distractor_rationale: {
            A: "Correct because the source supports complete excision and surveillance planning.",
            B: "Incorrect because serrated lesions carry risk.",
            C: "Incorrect because serial CT is not the management pathway.",
            D: "Incorrect because malignancy is not described.",
          },
        },
        guideline_takeaway: "Risk-stratify surveillance after complete polyp excision.",
      },
    ],
  };

  const normalized = normalizeAutoContentQuiz(payload, { rng: () => 0 });

  assert.equal(normalized.length, 1);
  assert.match(normalized[0].question, /^A 62-year-old/);
  assert.equal(normalized[0].options.length, 4);
  assert.match(
    normalized[0].options.find(option => option.startsWith(`${normalized[0].correct}. `)),
    /Document complete excision/,
  );
  assert.match(normalized[0].explanation, /complete excision/);
  assert.match(normalized[0].explanation, /B: Incorrect/);
  assert.equal(normalized[0].hint, "Risk-stratify surveillance after complete polyp excision.");
});

test("skips AutoContent multiple-select questions that the single-best-answer UI cannot represent", () => {
  const payload = {
    quiz: [
      {
        type: "multiple_select",
        question: "Which are correct?",
        answerOptions: [
          { text: "Correct one", isCorrect: true, rationale: "One." },
          { text: "Correct two", isCorrect: true, rationale: "Two." },
          { text: "Wrong", isCorrect: false },
          { text: "Also wrong", isCorrect: false },
        ],
      },
      {
        type: "multiple_choice",
        question: "Which is the single best answer?",
        answerOptions: [
          { text: "Right", isCorrect: true, rationale: "Right rationale." },
          { text: "Wrong A", isCorrect: false },
          { text: "Wrong B", isCorrect: false },
          { text: "Wrong C", isCorrect: false },
        ],
      },
    ],
  };

  const normalized = normalizeAutoContentQuiz(payload, { rng: () => 0 });

  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].question, "Which is the single best answer?");
});

test("randomizes AutoContent answer positions while preserving the correct-answer mapping", () => {
  const allFirstAnswerPayload = {
    quiz: Array.from({ length: 8 }, (_, index) => ({
      question: `Question ${index + 1}?`,
      answerOptions: [
        { text: `Correct answer ${index + 1}`, isCorrect: true, rationale: `Rationale ${index + 1}.` },
        { text: `Distractor B ${index + 1}`, isCorrect: false },
        { text: `Distractor C ${index + 1}`, isCorrect: false },
        { text: `Distractor D ${index + 1}`, isCorrect: false },
      ],
    })),
  };
  const rngValues = [0.9, 0.1, 0.6, 0.2, 0.8, 0.3, 0.7, 0.4, 0.05, 0.95, 0.15, 0.85, 0.25, 0.75, 0.35, 0.65, 0.45, 0.55, 0.12, 0.62, 0.32, 0.82, 0.22, 0.72];
  let rngIndex = 0;

  const normalized = normalizeAutoContentQuiz(allFirstAnswerPayload, {
    limit: 8,
    rng: () => rngValues[rngIndex++ % rngValues.length],
  });
  const correctLetters = new Set(normalized.map(item => item.correct));

  assert.equal(normalized.length, 8);
  assert.ok(correctLetters.size > 1, "correct answers should be distributed across positions");
  assert.notDeepEqual(
    normalized.map(item => item.correct),
    ["A", "B", "C", "D", "A", "B", "C", "D"],
    "correct-answer positions should not follow the old deterministic rotation pattern",
  );
  for (const item of normalized) {
    const correctOption = item.options.find(option => option.startsWith(`${item.correct}. `));
    assert.match(correctOption, /Correct answer/, "the marked correct letter should still point to the correct option text");
  }
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

test("preserves repo-managed-complete status when refreshing an already-published schedule quiz", () => {
  const resources = {
    "colon-pathology": {
      guidelines: [],
      newsAndArticles: [],
      quiz: [],
      quizStatus: "repo-managed-complete",
      quizSourcePdfs: [],
    },
  };
  const artifactQuiz = {
    quiz: Array.from({ length: 10 }, (_, index) => ({
      question: `Question ${index + 1}?`,
      options: ["A. Alpha", "B. Beta", "C. Gamma", "D. Delta"],
      correct: "A",
      explanation: `Explanation ${index + 1}.`,
    })),
  };

  const next = applyScheduleQuizArtifacts(resources, {
    "colon-pathology": {
      quizJson: artifactQuiz,
      sourcePdfs: ["/tmp/source.pdf"],
      generatedAt: "2026-10-09T01:45:00.000Z",
    },
  });

  assert.equal(next["colon-pathology"].quiz.length, 10);
  assert.equal(next["colon-pathology"].quizStatus, "repo-managed-complete");
});
