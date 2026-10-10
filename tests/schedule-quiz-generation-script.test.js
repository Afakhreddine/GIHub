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

  const sourcePdf = path.join(tmp, "stomach-pathology-guideline.pdf");
  const articlePdf = path.join(tmp, "stomach-pathology-article.pdf");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% fake test PDF\n");
  fs.writeFileSync(articlePdf, "%PDF-1.4\n% fake article PDF\n");
  const manifest = path.join(tmp, "source-manifest.json");
  fs.writeFileSync(manifest, JSON.stringify({
    "stomach-pathology": {
      topic: "Stomach Pathology",
      sourceType: "source-pdfs",
      pdfs: [sourcePdf, articlePdf],
    },
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
  assert.equal(args[0], sourcePdf);
  assert.equal(args[1], articlePdf);
  assert.ok(args.includes("--no-audio"));
  assert.ok(args.includes("--quiz-difficulty"));
  assert.equal(args[args.indexOf("--quiz-difficulty") + 1], "hard");
  assert.ok(args.includes("--quiz-instructions"));
  const instructions = args[args.indexOf("--quiz-instructions") + 1];
  assert.match(instructions, /hard/i);
  assert.match(instructions, /single-best-answer/i);
  assert.match(instructions, /multiple_choice/i);
  assert.match(instructions, /do not create multiple_select/i);
  assert.match(instructions, /clinical reasoning/i);
  assert.match(instructions, /not simple recall/i);
  assert.match(instructions, /plausible distractors/i);
  assert.doesNotMatch(instructions, /avoid putting the correct answer/i);
  assert.doesNotMatch(instructions, /answer order will also be locally randomized/i);
  assert.ok(fs.existsSync(path.join(outDir, "stomach-pathology")));
});

test("schedule quiz generator rejects non-source-pdf manifests", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "schedule-quiz-generate-invalid-"));
  const fakeHelper = path.join(tmp, "autocontent_generate.py");
  fs.writeFileSync(fakeHelper, "#!/usr/bin/env python3\nraise SystemExit(0)\n", { mode: 0o755 });
  const packetPdf = path.join(tmp, "metadata-packet.pdf");
  fs.writeFileSync(packetPdf, "%PDF-1.4\n% fake packet PDF\n");
  const manifest = path.join(tmp, "source-manifest.json");
  fs.writeFileSync(manifest, JSON.stringify({
    "stomach-pathology": { topic: "Stomach Pathology", pdf: packetPdf },
  }));

  assert.throws(
    () => execFileSync("node", [
      "scripts/generate-schedule-autocontent-quizzes.mjs",
      "--source-manifest", manifest,
      "--out-dir", path.join(tmp, "artifacts"),
      "--autocontent-helper", fakeHelper,
    ], { cwd: process.cwd(), stdio: "pipe" }),
    /sourceType.*source-pdf/,
  );
});
