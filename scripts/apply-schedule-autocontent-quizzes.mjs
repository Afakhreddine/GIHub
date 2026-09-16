#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import scheduleResources from "../src/data/scheduleResources.js";
import { applyScheduleQuizArtifacts } from "../src/scheduleQuizModel.js";
import { buildScheduleResourcesFile } from "../src/scheduleResourcesModel.js";

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const args = { artifactDir: "", sourceManifest: "", output: "src/data/scheduleResources.js", generatedAt: new Date().toISOString() };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--artifact-dir") args.artifactDir = argv[++i];
    else if (arg === "--source-manifest") args.sourceManifest = argv[++i];
    else if (arg === "--output") args.output = argv[++i];
    else if (arg === "--generated-at") args.generatedAt = argv[++i];
    else if (arg === "--help") {
      console.log("Usage: node scripts/apply-schedule-autocontent-quizzes.mjs --artifact-dir <dir> --source-manifest <json> [--output src/data/scheduleResources.js]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.artifactDir) throw new Error("Missing --artifact-dir");
  if (!args.sourceManifest) throw new Error("Missing --source-manifest");
  return args;
}

function findQuizArtifact(artifactDir, slug) {
  const direct = path.join(artifactDir, slug, `${slug}-quiz.json`);
  if (fs.existsSync(direct)) return direct;
  const fallback = path.join(artifactDir, `${slug}-quiz.json`);
  if (fs.existsSync(fallback)) return fallback;
  throw new Error(`Missing quiz artifact for ${slug}`);
}

const args = parseArgs(process.argv);
const manifest = readJson(args.sourceManifest);
const artifacts = {};
for (const [slug, entry] of Object.entries(manifest)) {
  artifacts[slug] = {
    quizJson: readJson(findQuizArtifact(args.artifactDir, slug)),
    sourcePdfs: [path.basename(entry.pdf)],
    generatedAt: args.generatedAt,
  };
}

const next = applyScheduleQuizArtifacts(scheduleResources, artifacts);
fs.writeFileSync(args.output, buildScheduleResourcesFile(next));

for (const [slug, resource] of Object.entries(next)) {
  console.log(`${slug}: ${resource.quiz?.length || 0} quiz items (${resource.quizStatus})`);
}
