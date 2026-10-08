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

function rotateOptions(options, correctIndex, offset) {
  if (!options.length || correctIndex < 0) {
    return { options, correct: optionLetter(correctIndex) };
  }

  const shift = ((offset % options.length) + options.length) % options.length;
  const rotated = options.map((_, index) => options[(index - shift + options.length) % options.length]);
  const newCorrectIndex = (correctIndex + shift) % options.length;
  return {
    options: rotated.map((option, index) => `${optionLetter(index)}. ${stripOptionPrefix(option)}`),
    correct: optionLetter(newCorrectIndex),
  };
}

function normalizeOptions(item, itemIndex = 0) {
  if (Array.isArray(item?.answerOptions)) {
    const rawOptions = item.answerOptions.slice(0, 4).map(option => stripOptionPrefix(option?.text));
    const correctIndex = item.answerOptions.findIndex(option => option?.isCorrect === true);
    const correctOption = correctIndex >= 0 ? item.answerOptions[correctIndex] : null;
    const rotated = rotateOptions(rawOptions, correctIndex, itemIndex);
    return {
      options: rotated.options,
      correct: rotated.correct,
      explanation: String(correctOption?.rationale || item?.explanation || item?.rationale || "").trim(),
    };
  }

  const rawOptions = Array.isArray(item?.options) ? item.options.slice(0, 4).map(stripOptionPrefix) : [];
  const correctLetter = String(item?.correct || item?.answer || "").trim().slice(0, 1).toUpperCase();
  const correctIndex = LETTERS.indexOf(correctLetter);
  const rotated = rotateOptions(rawOptions, correctIndex, itemIndex);
  return {
    options: rotated.options,
    correct: rotated.correct,
    explanation: String(item?.explanation || item?.rationale || "").trim(),
  };
}

export function normalizeAutoContentQuiz(payload, options = {}) {
  const limit = options.limit ?? 10;
  const quiz = Array.isArray(payload) ? payload : payload?.quiz;
  if (!Array.isArray(quiz)) return [];

  return quiz
    .map((item, index) => {
      const normalized = normalizeOptions(item, index);
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
