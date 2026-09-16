const LETTERS = ["A", "B", "C", "D"];

function stripOptionPrefix(text) {
  return String(text || "").replace(/^\s*[A-D][).:-]\s*/i, "").trim();
}

function optionLetter(index) {
  return LETTERS[index] || "";
}

function normalizeOptions(item) {
  if (Array.isArray(item?.answerOptions)) {
    const options = item.answerOptions.slice(0, 4).map((option, index) => `${optionLetter(index)}. ${stripOptionPrefix(option?.text)}`);
    const correctIndex = item.answerOptions.findIndex(option => option?.isCorrect === true);
    const correctOption = correctIndex >= 0 ? item.answerOptions[correctIndex] : null;
    return {
      options,
      correct: optionLetter(correctIndex),
      explanation: String(correctOption?.rationale || item?.explanation || item?.rationale || "").trim(),
    };
  }

  const rawOptions = Array.isArray(item?.options) ? item.options.slice(0, 4) : [];
  return {
    options: rawOptions.map((option, index) => `${optionLetter(index)}. ${stripOptionPrefix(option)}`),
    correct: String(item?.correct || item?.answer || "").trim().slice(0, 1).toUpperCase(),
    explanation: String(item?.explanation || item?.rationale || "").trim(),
  };
}

export function normalizeAutoContentQuiz(payload, options = {}) {
  const limit = options.limit ?? 10;
  const quiz = Array.isArray(payload) ? payload : payload?.quiz;
  if (!Array.isArray(quiz)) return [];

  return quiz
    .map(item => {
      const normalized = normalizeOptions(item);
      return {
        question: String(item?.question || "").trim(),
        options: normalized.options,
        correct: normalized.correct,
        explanation: normalized.explanation,
        ...(item?.hint ? { hint: String(item.hint).trim() } : {}),
      };
    })
    .filter(item => item.question && item.options.length === 4 && LETTERS.includes(item.correct) && item.explanation)
    .slice(0, limit);
}

export function applyScheduleQuizArtifacts(resources = {}, artifacts = {}) {
  const next = structuredClone(resources || {});
  for (const [slug, artifact] of Object.entries(artifacts || {})) {
    if (!next[slug]) continue;
    const quiz = normalizeAutoContentQuiz(artifact.quizJson, { limit: 10 });
    next[slug] = {
      ...next[slug],
      quiz,
      quizStatus: quiz.length >= 10 ? "autocontent-complete" : "autocontent-incomplete",
      quizSourcePdfs: Array.isArray(artifact.sourcePdfs) ? artifact.sourcePdfs : [],
      quizGeneratedAt: artifact.generatedAt || new Date().toISOString(),
    };
  }
  return next;
}
