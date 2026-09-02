#!/usr/bin/env node
import fs from "node:fs";
import scheduleResources from "../src/data/scheduleResources.js";
import weekly from "../src/data/weekly.js";
import { CALENDAR_MONTH, CALENDAR_EVENTS } from "../src/scheduleConfig.js";
import {
  buildScheduleResourcesFile,
  mergeScheduleResourceCandidates,
  scheduleTopicScreener,
} from "../src/scheduleResourcesModel.js";

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function parseArgs(argv) {
  const args = { dryRun: false, today: new Date().toISOString().slice(0, 10), horizonDays: 90, input: "" };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--today") args.today = argv[++i];
    else if (arg === "--horizon-days") args.horizonDays = Number.parseInt(argv[++i], 10);
    else if (!args.input) args.input = arg;
    else throw new Error(`Unexpected argument: ${arg}`);
  }
  return args;
}

function extractWeeklyCards(inputPath) {
  if (!inputPath) return weekly;
  const parsed = readJson(inputPath);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.included)) return parsed.included;
  if (Array.isArray(parsed.items)) return parsed.items;
  if (Array.isArray(parsed.data)) return parsed.data;
  throw new Error(`Could not find weekly cards in ${inputPath}`);
}

const args = parseArgs(process.argv);
const schedule = { month: CALENDAR_MONTH, events: CALENDAR_EVENTS };
const newWeeklyCards = extractWeeklyCards(args.input);
const result = scheduleTopicScreener({
  schedule,
  currentResources: scheduleResources,
  newWeeklyCards,
  today: args.today,
  horizonDays: args.horizonDays,
});
const merged = mergeScheduleResourceCandidates(scheduleResources, result.matches);

const summary = {
  month: CALENDAR_MONTH,
  today: args.today,
  horizonDays: args.horizonDays,
  upcomingTopics: result.upcomingCount,
  screenedCards: result.screenedCount,
  matches: result.matches.map(match => ({
    slug: match.slug,
    topic: match.topic,
    eventDate: match.eventDate,
    title: match.card.title || match.card.headline,
    relevanceScore: match.relevanceScore,
    relevanceReason: match.relevanceReason,
    status: match.status,
  })),
};

if (!args.dryRun && result.matches.length > 0) {
  fs.writeFileSync("src/data/scheduleResources.js", buildScheduleResourcesFile(merged));
}

console.log(JSON.stringify(summary, null, 2));
