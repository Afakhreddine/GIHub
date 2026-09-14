#!/usr/bin/env node
import weekly from "../src/data/weekly.js";
import { buildWeeklyPodcastBrief } from "../src/weeklyReviewModel.js";

const args = new Set(process.argv.slice(2));
const approvedOnly = !args.has("--all-published");
const brief = buildWeeklyPodcastBrief(weekly, { approvedOnly:false });

const payload = {
  ...brief,
  approvedOnly,
  source:"src/data/weekly.js",
  generatedAt:new Date().toISOString(),
};

console.log(JSON.stringify(payload, null, 2));
