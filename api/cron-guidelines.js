// Fetches all 4 societies in one run — possible now with 800s timeout
// ?init=true  — full build from 2000 onwards
// ?reset=true — wipe repo and rebuild
// (default)   — weekly update, checks new/updated sections only

import { claudeFetch, redisGet, redisSet, dedup, sortNewestFirst } from "./cron-shared.js";

const REPO_KEY = "gihub:guidelines:repo";

const JSON_SCHEMA = `{"org":"ACG|AGA|ASGE|AASLD","year":"YYYY","month":"full month name","topic":"short topic","urgency":"High|Moderate|Routine","title":"full title","summary":"1-2 sentences","url":"direct link"}`;

const INIT_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and extract ALL clinical practice guidelines and quality indicator documents listed, including both "Guidelines" and "Quality in Endoscopy" sections, published from 2000 to present. For each document confirm the publication year. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/practice-guidelines and extract ALL clinical practice guidelines listed by disease topic, published from 2000 to present. Confirm publication year for each. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  AGA:   `Search https://www.guidelinecentral.com/guidelines/aga/ and list ALL AGA clinical practice guidelines published from 2000 to present. Cross-check against https://gastro.org/clinical-guidance. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
  ACG:   `Search https://www.guidelinecentral.com/guidelines/acg/ and list ALL ACG clinical practice guidelines published from 2000 to present. Cross-check against https://gi.org/guidelines. Return ONLY a JSON array. Each item: ${JSON_SCHEMA}`,
};

const UPDATE_PROMPTS = {
  ASGE:  `Fetch https://www.asge.org/home/resources/publications/guidelines and identify any documents under "Newly Published" or published in the past 7 days. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AASLD: `Fetch https://www.aasld.org/news and identify any new or updated AASLD practice guidelines in the past 7 days. Return ONLY a JSON array of new items ([] if none). Each item: ${JSON_SCHEMA}`,
  AGA:   `Check https://gastro.org/clinical-guidance and https://www.guidelinecentral.com/guidelines/aga/ for new AGA guidelines in the past 7 days. Return ONLY a JSON array ([] if none). Each item: ${JSON_SCHEMA}`,
  ACG:   `Check https://gi.org/guidelines and https://www.guidelinecentral.com/guidelines/acg/ for new ACG guidelines in the past 7 days. Return ONLY a JSON array ([] if none). Each item: ${JSON_SCHEMA}`,
};

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const isInit  = req.query?.init  === "true";
  const isReset = req.query?.reset === "true";
  const prompts = isInit || isReset ? INIT_PROMPTS : UPDATE_PROMPTS;

  if (isReset) {
    await redisSet(REPO_KEY, []);
    console.log("Repository cleared");
  }

  const existing = (await redisGet(REPO_KEY)) || [];
  const results = {};
  const errors = {};
  let allFetched = [];

  for (const [society, prompt] of Object.entries(prompts)) {
    try {
      console.log(`Fetching ${society}...`);
      const fetched = await claudeFetch(prompt, apiKey);
      results[society] = fetched.length;
      allFetched = [...allFetched, ...fetched];
      console.log(`✓ ${society}: ${fetched.length} items`);
    } catch (e) {
      errors[society] = e.message;
      console.error(`✗ ${society}:`, e.message);
    }
  }

  const merged = sortNewestFirst(dedup([...existing, ...allFetched]));
  await redisSet(REPO_KEY, merged);

  return res.status(200).json({
    ok: true,
    mode: isReset ? "reset" : isInit ? "init" : "update",
    results,
    errors,
    totalInRepo: merged.length,
    timestamp: new Date().toISOString(),
  });
}
