import fs from "node:fs";
import scheduleResources from "../src/data/scheduleResources.js";
import { normalizeAutoContentQuiz } from "../src/scheduleQuizModel.js";

const outputPath = process.argv[2] || "src/data/scheduleResources.js";
const next = structuredClone(scheduleResources);

for (const resource of Object.values(next)) {
  if (Array.isArray(resource.quiz) && resource.quiz.length > 0) {
    resource.quiz = normalizeAutoContentQuiz({ quiz: resource.quiz }, { limit: resource.quiz.length });
  }
}

const content = `// Repo-managed Schedule tab resources.\n// Built by Hermes from guidelines, weekly updates, weeklyArchive, targeted pulls, and AutoContent quizzes.\n\nconst scheduleResources = ${JSON.stringify(next, null, 2)};\n\nexport default scheduleResources;\n`;
fs.writeFileSync(outputPath, content);

for (const [slug, resource] of Object.entries(next)) {
  const dist = { A: 0, B: 0, C: 0, D: 0 };
  for (const item of resource.quiz || []) {
    if (dist[item.correct] !== undefined) dist[item.correct] += 1;
  }
  if ((resource.quiz || []).length) {
    console.log(`${slug}: ${JSON.stringify(dist)}`);
  }
}
