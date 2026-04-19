// Fetches all lecture topics in one run — possible now with 800s timeout
// ?reset=true — re-fetches all topics from scratch

import { claudeFetch, redisSet } from "./cron-shared.js";

const PRIORITY_JOURNALS = "NEJM, JAMA, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, American Journal of Gastroenterology, Clinical Gastroenterology and Hepatology, Gastrointestinal Endoscopy, Hepatology, Neurogastroenterology and Motility, World Journal of Gastroenterology, Liver Transplantation, Clinical Liver Disease, Journal of Hepatology, JHEP Reports, and Alimentary Pharmacology & Therapeutics";

const LECTURE_TOPICS = [
  { slug: "esophageal-strictures-dilation",   label: "Esophageal Strictures & Dilation"        },
  { slug: "non-eoe-inflammatory-esophageal",   label: "Non-EoE Inflammatory Esophageal Diseases" },
  { slug: "barretts-esophagus-therapies",      label: "Barrett's Esophagus Therapies"           },
  { slug: "neuroendocrine-tumors",             label: "Neuroendocrine Tumors (NETs)"            },
  { slug: "gerd-medical-dietary-management",   label: "GERD / Medical & Dietary Management"     },
  { slug: "board-review-esophagus",            label: "Board Review — Esophagus"                },
];

function buildPrompts(label) {
  return {
    articles: `Search for high-impact GI and hepatology research articles published in the past 1 year specifically related to "${label}". First search these priority journals: ${PRIORITY_JOURNALS}. If fewer than 5 results, expand to other peer-reviewed GI journals. Assess impact by cross-referencing news.gastro.org, Healio Gastroenterology, and Doximity trending articles. Prioritize RCTs and phase 3 trials, then large prospective studies. Sort newest first. Return ONLY a JSON array of up to 5 items: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`,

    news: `Search for GI and hepatology news from the past 3 months specifically related to "${label}". Include only: FDA approvals and safety alerts; drug development milestones (phase 2/3 results, PDUFA dates, NDA submissions, accelerated approvals, label expansions); health policy changes (CMS, Medicare, Medicaid); society and conference news (AGA, ACG, ASGE, AASLD, DDW). Exclude primary research articles. Return ONLY a JSON array of up to 5 items sorted newest first: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
  };
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  const results = {};
  const errors  = {};

  for (const { slug, label } of LECTURE_TOPICS) {
    console.log(`Fetching schedule content for: ${label}`);
    const prompts = buildPrompts(label);
    const content = { fetchedAt: Date.now() };

    for (const [key, prompt] of Object.entries(prompts)) {
      try {
        content[key] = await claudeFetch(prompt, apiKey);
        console.log(`  ✓ ${slug}/${key}: ${content[key].length} items`);
      } catch (e) {
        console.error(`  ✗ ${slug}/${key}:`, e.message);
        content[key] = [];
        if (!errors[slug]) errors[slug] = {};
        errors[slug][key] = e.message;
      }
    }

    try {
      await redisSet(`gihub:lecture:${slug}`, content);
      results[slug] = { articles: content.articles?.length, news: content.news?.length };
    } catch (e) {
      console.error(`  ✗ Redis save ${slug}:`, e.message);
    }
  }

  return res.status(200).json({
    ok: true,
    results,
    errors,
    timestamp: new Date().toISOString(),
  });
}
