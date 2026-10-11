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

function shuffleOptions(options, correctIndex, rng = Math.random) {
  const entries = options.map((text, index) => ({ text, wasCorrect: index === correctIndex }));
  for (let index = entries.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [entries[index], entries[swapIndex]] = [entries[swapIndex], entries[index]];
  }

  const newCorrectIndex = entries.findIndex(entry => entry.wasCorrect);
  return {
    options: entries.map((entry, index) => `${optionLetter(index)}. ${stripOptionPrefix(entry.text)}`),
    correct: optionLetter(newCorrectIndex),
  };
}

function normalizeOptions(item, rng = Math.random) {
  if (item?.options && !Array.isArray(item.options) && typeof item.options === "object") {
    const rawOptions = LETTERS.map(letter => stripOptionPrefix(item.options[letter])).filter(Boolean);
    const correctLetter = String(item?.correct_answer || item?.correct || item?.answer || "").trim().slice(0, 1).toUpperCase();
    const correctIndex = LETTERS.indexOf(correctLetter);
    const shuffled = shuffleOptions(rawOptions, correctIndex, rng);
    const summary = typeof item?.explanation === "object" ? item.explanation?.summary : item?.explanation;
    const distractorRationale = typeof item?.explanation === "object" ? item.explanation?.distractor_rationale : null;
    const rationaleText = distractorRationale
      ? LETTERS.map(letter => distractorRationale[letter] ? `${letter}: ${distractorRationale[letter]}` : "").filter(Boolean).join(" ")
      : "";
    return {
      options: shuffled.options,
      correct: shuffled.correct,
      explanation: [summary, rationaleText].filter(Boolean).join(" "),
    };
  }

  if (Array.isArray(item?.answerOptions)) {
    const rawOptions = item.answerOptions.slice(0, 4).map(option => stripOptionPrefix(option?.text));
    const correctIndex = item.answerOptions.findIndex(option => option?.isCorrect === true);
    const correctOption = correctIndex >= 0 ? item.answerOptions[correctIndex] : null;
    const shuffled = shuffleOptions(rawOptions, correctIndex, rng);
    return {
      options: shuffled.options,
      correct: shuffled.correct,
      explanation: String(correctOption?.rationale || item?.explanation || item?.rationale || "").trim(),
    };
  }

  const rawOptions = Array.isArray(item?.options) ? item.options.slice(0, 4).map(stripOptionPrefix) : [];
  const correctLetter = String(item?.correct || item?.answer || "").trim().slice(0, 1).toUpperCase();
  const correctIndex = LETTERS.indexOf(correctLetter);
  const shuffled = shuffleOptions(rawOptions, correctIndex, rng);
  return {
    options: shuffled.options,
    correct: shuffled.correct,
    explanation: String(item?.explanation || item?.rationale || "").trim(),
  };
}

export function normalizeAutoContentQuiz(payload, options = {}) {
  const limit = options.limit ?? 10;
  const rng = options.rng || Math.random;
  const quiz = Array.isArray(payload) ? payload : payload?.questions || payload?.quiz;
  if (!Array.isArray(quiz)) return [];

  return quiz
    .filter(item => {
      if (item?.type === "multiple_select") return false;
      if (Array.isArray(item?.answerOptions)) {
        return item.answerOptions.filter(option => option?.isCorrect === true).length <= 1;
      }
      return true;
    })
    .map(item => {
      const normalized = normalizeOptions(item, rng);
      return {
        question: cleanQuizText(item?.question || item?.vignette),
        options: normalized.options,
        correct: normalized.correct,
        explanation: cleanQuizText(normalized.explanation),
        ...(item?.hint || item?.guideline_takeaway ? { hint: cleanQuizText(item.hint || item.guideline_takeaway) } : {}),
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
    const quizStatus =
      quiz.length >= 10 && next[slug]?.quizStatus === "repo-managed-complete"
        ? "repo-managed-complete"
        : quiz.length >= 10
          ? "autocontent-complete"
          : "autocontent-incomplete";
    next[slug] = {
      ...next[slug],
      quiz,
      quizStatus,
      quizSourcePdfs: Array.isArray(artifact.sourcePdfs) ? artifact.sourcePdfs : [],
      quizGeneratedAt: artifact.generatedAt || new Date().toISOString(),
    };
  }
  return next;
}
