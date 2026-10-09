#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const HARD_SCHEDULE_QUIZ_INSTRUCTIONS = [
  "Create a hard gastroenterology board-review style multiple-choice quiz for fellows/attendings.",
  "Use clinical reasoning, pathology/diagnostic distinctions, management implications, and nuanced guideline application; not simple recall.",
  "Write 10 questions when source material supports it, each with 4 answer options and one best answer.",
  "Use plausible distractors that are educational and close enough to require reasoning; avoid obviously wrong choices.",
  "Include concise explanations/rationales for the correct answer.",
  "Avoid putting the correct answer consistently in the same option position; answer order will also be locally randomized on import.",
].join(" ");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const args = {
    sourceManifest: "",
    outDir: "/opt/data/autocontent_outputs/gihub_schedule_quizzes",
    autocontentHelper: "/opt/data/scripts/autocontent_generate.py",
    timeout: "1200",
  };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--source-manifest") args.sourceManifest = argv[++i];
    else if (arg === "--out-dir") args.outDir = argv[++i];
    else if (arg === "--autocontent-helper") args.autocontentHelper = argv[++i];
    else if (arg === "--timeout") args.timeout = argv[++i];
    else if (arg === "--help") {
      console.log("Usage: node scripts/generate-schedule-autocontent-quizzes.mjs --source-manifest <json> [--out-dir <dir>]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.sourceManifest) throw new Error("Missing --source-manifest");
  return args;
}

function runAutoContent({ helper, pdf, outDir, timeout }) {
  fs.mkdirSync(outDir, { recursive: true });
  const result = spawnSync(helper, [
    pdf,
    "--out-dir", outDir,
    "--no-audio",
    "--quiz-difficulty", "hard",
    "--quiz-instructions", HARD_SCHEDULE_QUIZ_INSTRUCTIONS,
    "--timeout", timeout,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`AutoContent quiz generation failed for ${pdf}:\n${result.stdout || ""}\n${result.stderr || ""}`);
  }
  return result;
}

const args = parseArgs(process.argv);
const manifest = readJson(args.sourceManifest);

for (const [slug, entry] of Object.entries(manifest)) {
  if (!entry?.pdf) throw new Error(`Missing pdf for ${slug}`);
  const pdf = path.resolve(entry.pdf);
  if (!fs.existsSync(pdf)) throw new Error(`PDF not found for ${slug}: ${pdf}`);
  const outDir = path.join(args.outDir, slug);
  runAutoContent({ helper: args.autocontentHelper, pdf, outDir, timeout: args.timeout });
  console.log(`${slug}: requested hard AutoContent quiz in ${outDir}`);
}
