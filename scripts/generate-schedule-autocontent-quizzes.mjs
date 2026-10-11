#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export const HARD_SCHEDULE_QUIZ_INSTRUCTIONS = `
You are an expert Gastroenterology Medical Educator and Board Examiner drafting high-yield board-style review questions for GI Fellows in training.

Your task is to analyze the provided GI medical literature/guidelines and generate a structured multiple-choice quiz designed to test clinical reasoning, diagnostic evaluation, and management according to the source material.

REQUIREMENTS & CONSTRAINTS:
1. TARGET AUDIENCE: GI Fellows (PGY-4 to PGY-6). Questions must focus on nuanced clinical decision-making, high-yield guideline recommendations, diagnostic workups, and management algorithms rather than simple recall.
2. SOURCE FIDELITY: Every question, answer option, and explanation MUST be directly supported by the provided source PDFs. Do not invent details not present in or directly inferred from the input text.
3. VIGNETTE FORMAT: Use clinical vignettes where appropriate (e.g., patient presentation, laboratory values, endoscopic findings, treatment progression).
4. QUESTION FORMAT: Generate exactly 10 hard single-best-answer multiple-choice questions. Each question must have exactly 4 options (A, B, C, D) and exactly 1 correct answer.
5. DO NOT create multiple_select, select-all-that-apply, multi-correct, all-of-the-above, none-of-the-above, or true/false questions.

OUTPUT FORMAT (JSON):
Return ONLY a valid JSON object matching this schema:

{
  "quiz_title": "string (Descriptive title based on the topic)",
  "topic": "string",
  "questions": [
    {
      "id": 1,
      "vignette": "string (Concise clinical scenario or question stem)",
      "options": {
        "A": "string",
        "B": "string",
        "C": "string",
        "D": "string"
      },
      "correct_answer": "string (A, B, C, or D)",
      "explanation": {
        "summary": "string (Key takeaway and why the correct answer is right according to the text)",
        "distractor_rationale": {
          "A": "string (Why option A is incorrect or sub-optimal)",
          "B": "string (Why option B is incorrect or sub-optimal)",
          "C": "string (Why option C is incorrect or sub-optimal)",
          "D": "string (Why option D is incorrect or sub-optimal)"
        }
      },
      "guideline_takeaway": "string (Direct citation/quote or high-yield principle from the article)"
    }
  ]
}
`.trim();

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
