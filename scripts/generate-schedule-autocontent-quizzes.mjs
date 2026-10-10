#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const HARD_SCHEDULE_QUIZ_INSTRUCTIONS = [
  "Create exactly 10 hard gastroenterology board-review single-best-answer multiple-choice questions for fellows/attendings.",
  "Use ONLY single-best-answer multiple_choice questions; do not create multiple_select, select-all-that-apply, multi-correct, all-of-the-above, none-of-the-above, or true/false questions.",
  "Use clinical reasoning, pathology/diagnostic distinctions, management implications, and nuanced guideline application; not simple recall.",
  "Each question must have exactly 4 answer options and exactly 1 correct answer.",
  "Use plausible distractors that are educational and close enough to require reasoning; avoid obviously wrong choices.",
  "Include concise explanations/rationales for the correct answer.",
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

function normalizeSourcePdfs(slug, entry) {
  if (!entry || !["source-pdf", "source-pdfs"].includes(entry.sourceType)) {
    throw new Error(`${slug}: source manifest entries must set sourceType to "source-pdf" or "source-pdfs"; metadata/source-packet PDFs are not allowed`);
  }
  const rawPdfs = Array.isArray(entry.pdfs) ? entry.pdfs : entry.pdf ? [entry.pdf] : [];
  if (rawPdfs.length === 0) throw new Error(`${slug}: missing source PDF path(s)`);
  return rawPdfs.map(rawPdf => {
    const pdf = path.resolve(rawPdf);
    if (path.extname(pdf).toLowerCase() !== ".pdf") throw new Error(`${slug}: source must be a PDF: ${pdf}`);
    if (!fs.existsSync(pdf)) throw new Error(`${slug}: source PDF not found: ${pdf}`);
    return pdf;
  });
}

function runAutoContent({ helper, pdfs, outDir, timeout }) {
  fs.mkdirSync(outDir, { recursive: true });
  const result = spawnSync(helper, [
    ...pdfs,
    "--out-dir", outDir,
    "--no-audio",
    "--quiz-difficulty", "hard",
    "--quiz-instructions", HARD_SCHEDULE_QUIZ_INSTRUCTIONS,
    "--timeout", timeout,
  ], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`AutoContent quiz generation failed for ${pdfs.join(", ")}:\n${result.stdout || ""}\n${result.stderr || ""}`);
  }
  return result;
}

const args = parseArgs(process.argv);
const manifest = readJson(args.sourceManifest);

for (const [slug, entry] of Object.entries(manifest)) {
  const pdfs = normalizeSourcePdfs(slug, entry);
  const outDir = path.join(args.outDir, slug);
  runAutoContent({ helper: args.autocontentHelper, pdfs, outDir, timeout: args.timeout });
  console.log(`${slug}: requested hard AutoContent quiz from ${pdfs.length} source PDF(s) in ${outDir}`);
}
