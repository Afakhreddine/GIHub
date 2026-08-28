#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const allowedWeeklyTypes = new Set(["Research", "FDA", "Guideline", "News", "Opinion"]);
const allowedDecisions = new Set(["include", "maybe", "exclude", "route-to-guidelines"]);
const scoreFields = [
  "clinicalImpact",
  "novelty",
  "evidenceQuality",
  "fellowUsefulness",
  "actionability",
  "timeliness",
];

function asString(value) {
  return String(value ?? "").trim();
}

function assertUrl(value, field, index) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("bad protocol");
  } catch {
    throw new Error(`Candidate ${index}: ${field} must be an http(s) URL or empty string`);
  }
}

function clampScore(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(3, Math.round(n)));
}

export function impactLevelFromScore(total) {
  if (total >= 15) return "Practice-changing";
  if (total >= 10) return "High Impact";
  return "Noteworthy";
}

export function scoreCandidate(candidate) {
  const dimensions = Object.fromEntries(scoreFields.map((field) => [field, clampScore(candidate[field])]));
  const total = Object.values(dimensions).reduce((sum, n) => sum + n, 0);
  return {
    ...candidate,
    score: { ...dimensions, total },
    impactLevel: impactLevelFromScore(total),
  };
}

function normalizeCandidate(candidate, index) {
  const out = {
    title: asString(candidate.title),
    sourceType: asString(candidate.sourceType || "news article"),
    journalOrPublisher: asString(candidate.journalOrPublisher || candidate.source || ""),
    date: asString(candidate.date),
    url: asString(candidate.url),
    studyUrl: asString(candidate.studyUrl),
    doi: asString(candidate.doi),
    pmid: asString(candidate.pmid),
    topic: asString(candidate.topic),
    studyDesign: asString(candidate.studyDesign),
    population: asString(candidate.population),
    sampleSize: asString(candidate.sampleSize),
    interventionExposure: asString(candidate.interventionExposure),
    comparator: asString(candidate.comparator),
    primaryOutcome: asString(candidate.primaryOutcome),
    keyResults: Array.isArray(candidate.keyResults) ? candidate.keyResults.map(asString).filter(Boolean) : [],
    limitations: Array.isArray(candidate.limitations) ? candidate.limitations.map(asString).filter(Boolean) : [],
    practiceRelevance: asString(candidate.practiceRelevance),
    verificationStatus: asString(candidate.verificationStatus || "unverified"),
    triageDecision: asString(candidate.triageDecision || "maybe"),
    sourceQuality: asString(candidate.sourceQuality || "unknown"),
    contentRisk: asString(candidate.contentRisk || "medium"),
    clinicalImpact: candidate.clinicalImpact,
    novelty: candidate.novelty,
    evidenceQuality: candidate.evidenceQuality,
    fellowUsefulness: candidate.fellowUsefulness,
    actionability: candidate.actionability,
    timeliness: candidate.timeliness,
  };

  if (!out.title) throw new Error(`Candidate ${index}: title is required`);
  if (!out.date) throw new Error(`Candidate ${index}: date is required`);
  if (!out.topic) throw new Error(`Candidate ${index}: topic is required`);
  if (!out.url) throw new Error(`Candidate ${index}: url is required`);
  if (!allowedDecisions.has(out.triageDecision)) {
    throw new Error(`Candidate ${index}: invalid triageDecision ${out.triageDecision}`);
  }
  assertUrl(out.url, "url", index);
  assertUrl(out.studyUrl, "studyUrl", index);
  if (out.studyUrl && out.verificationStatus !== "verified") {
    throw new Error(`Candidate ${index}: unverified studyUrl is not allowed; verify it or leave it empty`);
  }
  return scoreCandidate(out);
}

function weeklyType(candidate) {
  if (/guideline/i.test(candidate.sourceType)) return "Guideline";
  if (/fda/i.test(candidate.sourceType)) return "FDA";
  if (/opinion|how-to|editorial/i.test(candidate.sourceType)) return "Opinion";
  if (/trial|study|cohort|meta-analysis|research|journal/i.test(candidate.sourceType)) return "Research";
  return "News";
}

function buildSummary(candidate) {
  const bits = [];
  const design = [candidate.studyDesign, candidate.population, candidate.sampleSize].filter(Boolean).join("; ");
  if (design) bits.push(design.endsWith(".") ? design : `${design}.`);
  if (candidate.keyResults.length) bits.push(candidate.keyResults.slice(0, 2).join(" "));
  if (candidate.practiceRelevance) bits.push(candidate.practiceRelevance);
  if (candidate.limitations.length) bits.push(`Limitation: ${candidate.limitations[0]}`);
  bits.push(`Source ${candidate.verificationStatus}; AI-assisted summary requires human review before merge.`);
  return bits.join(" ").replace(/\s+/g, " ").trim();
}

export function triageCandidates(candidates) {
  if (!Array.isArray(candidates)) throw new Error("Candidate input must be a JSON array");
  const normalized = candidates.map(normalizeCandidate);
  const audit = {
    candidatesReviewed: normalized.length,
    included: 0,
    excluded: 0,
    maybe: 0,
    routedToGuidelines: 0,
    verifiedLinks: 0,
    unverified: 0,
    riskCounts: {},
  };
  const weeklyItems = [];

  for (const candidate of normalized) {
    audit.riskCounts[candidate.contentRisk] = (audit.riskCounts[candidate.contentRisk] || 0) + 1;
    if (candidate.verificationStatus === "verified") audit.verifiedLinks += 1;
    else audit.unverified += 1;

    if (candidate.triageDecision === "route-to-guidelines") {
      audit.routedToGuidelines += 1;
      continue;
    }
    if (candidate.triageDecision === "exclude") {
      audit.excluded += 1;
      continue;
    }
    if (candidate.triageDecision === "maybe") {
      audit.maybe += 1;
      continue;
    }

    const type = weeklyType(candidate);
    if (!allowedWeeklyTypes.has(type)) throw new Error(`Unsupported weekly type ${type}`);
    weeklyItems.push({
      type,
      impactLevel: candidate.impactLevel,
      multiSource: false,
      date: candidate.date,
      topic: candidate.topic,
      title: candidate.title,
      authors: "",
      source: candidate.journalOrPublisher || new URL(candidate.url).hostname,
      summary: buildSummary(candidate),
      url: candidate.url,
      studyUrl: candidate.studyUrl,
    });
    audit.included += 1;
  }

  if (weeklyItems.length > 12) throw new Error("Triage produced more than 12 weekly items");
  return { weeklyItems, audit, candidates: normalized };
}

function usage() {
  console.error("Usage: node scripts/triage-weekly-candidates.mjs /path/to/candidates.json [/path/to/weekly.json] [/path/to/audit.json]");
  process.exit(2);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const input = process.argv[2];
  if (!input) usage();
  const weeklyOutput = process.argv[3] || path.resolve("/tmp/gihub-weekly-triaged.json");
  const auditOutput = process.argv[4] || path.resolve("/tmp/gihub-weekly-triage-audit.json");
  const parsed = JSON.parse(fs.readFileSync(input, "utf8"));
  const result = triageCandidates(parsed);
  fs.writeFileSync(weeklyOutput, JSON.stringify(result.weeklyItems, null, 2));
  fs.writeFileSync(auditOutput, JSON.stringify({ audit: result.audit, candidates: result.candidates }, null, 2));
  console.log(`Wrote ${result.weeklyItems.length} weekly item(s) to ${weeklyOutput}`);
  console.log(`Wrote triage audit to ${auditOutput}`);
}
