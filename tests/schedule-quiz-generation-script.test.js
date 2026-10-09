import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

function readJsonLines(filePath) {
  return fs.readFileSync(filePath, "utf8").trim().split(/\n+/).filter(Boolean).map(line => JSON.parse(line));
}

test("schedule quiz generator requests hard AutoContent quizzes with clinical-reasoning instructions", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "schedule-quiz-generate-"));
  const callsPath = path.join(tmp, "calls.jsonl");
  const fakeHelper = path.join(tmp, "autocontent_generate.py");
  fs.writeFileSync(fakeHelper, `#!/usr/bin/env python3
import json, os, sys
with open(os.environ["CALLS_PATH"], "a", encoding="utf-8") as handle:
    handle.write(json.dumps(sys.argv[1:]) + "\\n")
`, { mode: 0o755 });

  const sourcePdf = path.join(tmp, "stomach-pathology.pdf");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% fake test PDF\n");
  const manifest = path.join(tmp, "source-manifest.json");
  fs.writeFileSync(manifest, JSON.stringify({
    "stomach-pathology": { topic: "Stomach Pathology", pdf: sourcePdf },
  }));
  const outDir = path.join(tmp, "artifacts");

  execFileSync("node", [
    "scripts/generate-schedule-autocontent-quizzes.mjs",
    "--source-manifest", manifest,
    "--out-dir", outDir,
    "--autocontent-helper", fakeHelper,
  ], {
    cwd: process.cwd(),
    env: { ...process.env, CALLS_PATH: callsPath },
    stdio: "pipe",
  });

  const [args] = readJsonLines(callsPath);
  assert.ok(args.includes("--no-audio"));
  assert.ok(args.includes("--quiz-difficulty"));
  assert.equal(args[args.indexOf("--quiz-difficulty") + 1], "hard");
  assert.ok(args.includes("--quiz-instructions"));
  const instructions = args[args.indexOf("--quiz-instructions") + 1];
  assert.match(instructions, /hard/i);
  assert.match(instructions, /clinical reasoning/i);
  assert.match(instructions, /not simple recall/i);
  assert.match(instructions, /plausible distractors/i);
  assert.ok(fs.existsSync(path.join(outDir, "stomach-pathology")));
});
