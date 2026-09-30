const LETTERS = ["A", "B", "C", "D"];

export function cleanQuizText(text) {
  return String(text || "")
    // AutoContent sometimes emits plain numeric values as inline math, e.g. $40$ mg, $< 7$ g/dL.
    // GIHub renders quiz copy as plain text, so strip only the math delimiters while preserving content.
    .replace(/\$\s*([^$\n]+?)\s*\$/g, "$1")
    .replace(/\\%/g, "%")
    .replace(/\s+/g, " ")
    .trim();
}

function stripOptionPrefix(text) {
  return cleanQuizText(text).replace(/^\s*[A-D][).:-]\s*/i, "").trim();
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
        question: cleanQuizText(item?.question),
        options: normalized.options,
        correct: normalized.correct,
        explanation: cleanQuizText(normalized.explanation),
        ...(item?.hint ? { hint: cleanQuizText(item.hint) } : {}),
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
