// One topic per call — no timeouts possible
// Usage:
//   ?topic=esophageal-strictures-dilation  — fetch one topic
//   ?topic=barretts-esophagus-therapies    — fetch one topic
//   (no params)                            — fetch ALL topics sequentially (use only with 800s timeout)
//
// For manual population, call each slug individually:
//   /api/cron-schedule?topic=esophageal-strictures-dilation
//   /api/cron-schedule?topic=non-eoe-inflammatory-esophageal
//   /api/cron-schedule?topic=barretts-esophagus-therapies
//   /api/cron-schedule?topic=neuroendocrine-tumors
//   /api/cron-schedule?topic=gerd-medical-dietary-management
//   /api/cron-schedule?topic=board-review-esophagus

import { claudeFetch, redisSet } from "./cron-shared.js";

const PRIORITY_JOURNALS = "NEJM, JAMA, Lancet, Lancet Gastroenterology & Hepatology, Gut, Gastroenterology, American Journal of Gastroenterology, Clinical Gastroenterology and Hepatology, Gastrointestinal Endoscopy, Hepatology, Neurogastroenterology and Motility, World Journal of Gastroenterology, Liver Transplantation, Clinical Liver Disease, Journal of Hepatology, JHEP Reports, and Alimentary Pharmacology & Therapeutics";

const LECTURE_TOPICS = [
  { slug:"esophageal-strictures-dilation",   label:"Esophageal Strictures & Dilation"         },
  { slug:"non-eoe-inflammatory-esophageal",   label:"Non-EoE Inflammatory Esophageal Diseases" },
  { slug:"barretts-esophagus-therapies",      label:"Barrett's Esophagus Therapies"            },
  { slug:"neuroendocrine-tumors",             label:"Neuroendocrine Tumors (NETs)"             },
  { slug:"gerd-medical-dietary-management",   label:"GERD / Medical & Dietary Management"      },
  { slug:"board-review-esophagus",            label:"Board Review — Esophagus"                 },
];

function buildPrompts(label) {
  return {
    articles: `Search for high-impact GI and hepatology research articles published in the past 1 year specifically related to "${label}". First search these priority journals: ${PRIORITY_JOURNALS}. If fewer than 5 results, expand to other peer-reviewed GI journals. Assess impact by cross-referencing news.gastro.org, Healio Gastroenterology, and Doximity trending articles. Prioritize RCTs and phase 3 trials, then large prospective studies. Sort newest first. Return ONLY a JSON array of up to 5 items: {"journal":"","date":"","topic":"","impactLevel":"Practice-changing|High Impact|Noteworthy","title":"","authors":"","summary":"2-3 sentences","url":""}`,

    news: `Search for GI and hepatology news from the past 3 months specifically related to "${label}". Include only: FDA approvals and safety alerts; drug development milestones (phase 2/3 results, PDUFA dates, NDA submissions, accelerated approvals, label expansions); health policy changes (CMS, Medicare, Medicaid); society and conference news (AGA, ACG, ASGE, AASLD, DDW). Exclude primary research articles. Return ONLY a JSON array of up to 5 items sorted newest first: {"source":"","date":"","category":"FDA Approval|Drug News|Research|Industry|Policy","sentiment":"Positive|Neutral|Mixed|Negative","headline":"","summary":"1-2 sentences","url":""}`,
  };
}

async function fetchTopic(slug, label, apiKey) {
  const prompts = buildPrompts(label);
  const content = { fetchedAt: Date.now() };

  for (const [key, prompt] of Object.entries(prompts)) {
    try {
      content[key] = await claudeFetch(prompt, apiKey);
      console.log(`  ✓ ${slug}/${key}: ${content[key].length} items`);
    } catch (e) {
      console.error(`  ✗ ${slug}/${key}:`, e.message);
      content[key] = [];
    }
  }

  await redisSet(`gihub:lecture:${slug}`, content);
  return content;
}

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return res.status(500).json({ error: "API key not configured" });

  // ?topic=slug — fetch one specific topic
  const topicSlug = req.query?.topic;
  if (topicSlug) {
    const lecture = LECTURE_TOPICS.find(t => t.slug === topicSlug);
    if (!lecture) {
      return res.status(400).json({
        error: `Unknown topic slug. Valid slugs: ${LECTURE_TOPICS.map(t => t.slug).join(", ")}`,
      });
    }
    try {
      console.log(`Fetching topic: ${lecture.label}`);
      const content = await fetchTopic(lecture.slug, lecture.label, apiKey);
      return res.status(200).json({
        ok: true,
        topic: lecture.slug,
        label: lecture.label,
        articles: content.articles?.length || 0,
        news: content.news?.length || 0,
      });
    } catch (e) {
      console.error(`✗ ${topicSlug}:`, e.message);
      return res.status(500).json({ ok: false, topic: topicSlug, error: e.message });
    }
  }

  // No params — fetch all topics sequentially (weekly cron)
  const results = {};
  const errors  = {};

  for (const { slug, label } of LECTURE_TOPICS) {
    try {
      console.log(`Fetching: ${label}`);
      const content = await fetchTopic(slug, label, apiKey);
      results[slug] = { articles: content.articles?.length || 0, news: content.news?.length || 0 };
    } catch (e) {
      errors[slug] = e.message;
      console.error(`✗ ${slug}:`, e.message);
    }
  }

  return res.status(200).json({ ok: true, results, errors, timestamp: new Date().toISOString() });
}
