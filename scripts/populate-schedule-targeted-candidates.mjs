#!/usr/bin/env node
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { buildScheduleResourcesFile } from "../src/scheduleResourcesModel.js";
import scheduleResources from "../src/data/scheduleResources.js";
import { CALENDAR_EVENTS, LECTURE_TOPICS } from "../src/scheduleConfig.js";

export const DEFAULT_TARGETED_CANDIDATES_PER_TOPIC = 2;

const TOPIC_TERM_RULES = [
  { test:/colon.*polyp|polyp.*colon|adenoma|serrated/i, terms:["colon polyp", "colorectal polyp", "colorectal adenoma", "serrated lesion", "sessile serrated", "adenomatous polyposis"] },
  { test:/appendix|appendiceal|anus|anal|anorectal/i, terms:["appendiceal neoplasm", "appendiceal tumor", "appendiceal mucinous", "anal dysplasia", "anal cancer", "anorectal pathology"] },
  { test:/celiac|coeliac|gluten/i, terms:["celiac disease", "coeliac disease", "gluten enteropathy", "villous atrophy", "gluten-free diet"] },
  { test:/small intestine|small bowel|duoden|jejunal|ileal|enteropathy/i, terms:["small intestine pathology", "small bowel tumor", "small bowel disease", "duodenal pathology", "enteropathy", "jejunal", "ileal"] },
  { test:/artificial intelligence|\bAI\b|machine learning|deep learning|large language model|generative/i, terms:["artificial intelligence", "machine learning", "deep learning", "large language model", "generative AI", "AI-assisted colonoscopy", "computer-aided detection", "computer-aided diagnosis"] },
  { test:/colon pathology|colorectal|colitis|microscopic colitis|colon/i, terms:["colon pathology", "colitis pathology", "colorectal cancer pathology", "colorectal neoplasia", "inflammatory bowel disease dysplasia", "microscopic colitis"] },
  { test:/stomach|gastric|helicobacter|h pylori/i, terms:["gastric cancer", "gastric intestinal metaplasia", "Helicobacter pylori", "gastric dysplasia"] },
  { test:/bleeding|hemorrhage|angiodysplasia|variceal/i, terms:["gastrointestinal bleeding", "upper gastrointestinal bleeding", "lower gastrointestinal bleeding", "nonvariceal bleeding", "variceal bleeding", "angiodysplasia"] },
  { test:/pancreatitis|pancreas|triglyceride|hypertriglyceridemia/i, terms:["acute pancreatitis", "hypertriglyceridemia pancreatitis", "triglyceride pancreatitis", "pancreatic necrosis", "post-ERCP pancreatitis"] },
  { test:/liver|hepat|MASH|MASLD|fibrosis/i, terms:["MASLD", "MASH", "steatotic liver disease", "hepatitis B", "liver fibrosis"] },
  { test:/ibd|crohn|ulcerative colitis|inflammatory bowel/i, terms:["Crohn", "ulcerative colitis", "inflammatory bowel disease", "vedolizumab", "upadacitinib", "colitis dysplasia"] },
];

const PREFERRED_JOURNALS = [
  "Gastroenterology",
  "Gut",
  "The Lancet",
  "Lancet Gastroenterol Hepatol",
  "Clin Gastroenterol Hepatol",
  "Am J Gastroenterol",
  "Gastrointest Endosc",
  "Hepatology",
  "J Crohns Colitis",
  "Gastro Hep Adv",
  "N Engl J Med",
  "JAMA",
];

const EXCLUDED_PUBLICATION_TYPES = /guideline|practice guideline|editorial|letter|comment|case reports|retraction|published erratum/i;
const EXCLUDED_TITLE_TERMS = /\bretraction\b|\berratum\b|\bcorrection\b|\bcommentary\b|\bletter to the editor\b/i;
const GOOD_PUBLICATION_TYPES = /clinical trial|randomized|meta-analysis|systematic review|observational study|multicenter study|cohort|comparative study|journal article/i;

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function unique(values) {
  const seen = new Set();
  return values.filter(value => {
    const key = normalize(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function quotePubMedTerm(term, field = "Title/Abstract") {
  return `${term.replace(/"/g, "").trim()}[${field}]`;
}

export function searchTermsForTopic(topic, label = topic, slug = "") {
  const haystack = `${topic || ""} ${label || ""} ${slug.replace(/-/g, " ")}`;
  const terms = [];
  for (const rule of TOPIC_TERM_RULES) {
    if (rule.test.test(haystack)) terms.push(...rule.terms);
  }
  terms.push(topic, label, slug.replace(/-/g, " "));
  return unique(terms).slice(0, 10);
}

export function buildPubMedSearch({ topic, label, slug, eventDate }, { lookbackYears = 1 } = {}) {
  const year = Number(String(eventDate || "").slice(0, 4)) || new Date().getUTCFullYear();
  const startYear = Math.max(2000, year - lookbackYears);
  const terms = searchTermsForTopic(topic, label, slug);
  const termQuery = terms.map(term => quotePubMedTerm(term)).join(" OR ");
  const titleBoost = /artificial intelligence|\bAI\b|machine learning|deep learning|large language model/i.test(topic)
    ? " AND (gastroenterology[Title] OR endoscopy[Title] OR gastrointestinal[Title] OR colonoscopy[Title] OR digestive[Title])"
    : "";
  return `(${termQuery})${titleBoost} AND (${startYear}:${year}[pdat])`;
}

export function buildTopicConfigsFromCalendar(events = CALENDAR_EVENTS, options = {}) {
  const bySlug = new Map((LECTURE_TOPICS || []).map(topic => [topic.slug, topic]));
  return Object.fromEntries(
    events
      .filter(event => event?.slug && event?.topic)
      .map(event => {
        const lecture = bySlug.get(event.slug);
        const label = lecture?.label || event.topic;
        const config = {
          label,
          topic: event.topic,
          eventDate: event.date,
          minTargetedCandidates: options.minTargetedCandidates || DEFAULT_TARGETED_CANDIDATES_PER_TOPIC,
        };
        return [event.slug, { ...config, search: buildPubMedSearch({ ...config, slug:event.slug }, options) }];
      })
  );
}

function xmlText(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return decodeXml(match?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function xmlTexts(block, tag) {
  return Array.from(block.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi")))
    .map(match => decodeXml(match[1]).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function decodeXml(value) {
  return String(value || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function identity(item) {
  const doi = String(item.doi || item.url || "").match(/10\.\d{4,9}\/[\w.\-;()/:]+/i)?.[0]?.toLowerCase();
  if (doi) return `doi:${doi}`;
  const pmid = String(item.pmid || item.url || "").match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/i)?.[1] || String(item.pmid || "").trim();
  if (pmid) return `pmid:${pmid}`;
  if (item.url) return `url:${String(item.url).toLowerCase().replace(/[?#].*$/, "").replace(/\/$/, "")}`;
  return `title:${normalize(item.title || item.headline || "")}`;
}

async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

async function ncbi(path, params) {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/${path}?${new URLSearchParams(params)}`;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const res = await fetch(url, { headers: { "user-agent": "GIHub schedule enrichment (Hermes)" } });
    if (res.ok) return res.text();
    if (![429, 500, 502, 503, 504].includes(res.status) || attempt === 5) {
      throw new Error(`${path} failed ${res.status}: ${await res.text()}`);
    }
    await sleep(1200 * attempt);
  }
  throw new Error(`${path} failed`);
}

async function searchPmids(term, retmax = 20) {
  const text = await ncbi("esearch.fcgi", { db: "pubmed", term, retmode: "json", retmax: String(retmax), sort: "pub+date" });
  const data = JSON.parse(text);
  return data.esearchresult?.idlist || [];
}

async function fetchArticles(pmids) {
  if (!pmids.length) return [];
  const xml = await ncbi("efetch.fcgi", { db: "pubmed", id: pmids.join(","), retmode: "xml" });
  const blocks = Array.from(xml.matchAll(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/gi)).map(match => match[0]);
  return blocks.map(block => {
    const pmid = xmlText(block, "PMID");
    const title = xmlText(block, "ArticleTitle");
    const journal = xmlText(block, "Title") || xmlText(block, "ISOAbbreviation");
    const year = xmlText(block, "Year") || "";
    const month = xmlText(block, "Month") || "";
    const abstractParts = xmlTexts(block, "AbstractText");
    const abstract = abstractParts.join(" ");
    const pubTypes = xmlTexts(block, "PublicationType");
    const doi = xmlTexts(block, "ArticleId").find(v => /^10\./i.test(v)) || "";
    return { pmid, title, journal, year, month, abstract, pubTypes, doi };
  }).filter(item => item.pmid && item.title);
}

function summarize(article) {
  const source = article.abstract || article.title;
  const sentences = source.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 2).join(" ");
  return `${sentences || article.title} Source pulled from PubMed for Schedule review; human review recommended before final teaching use.`;
}

function articleScore(article, topicText) {
  let score = 0;
  const pubTypeText = article.pubTypes.join("; ");
  const journal = article.journal || "";
  if (PREFERRED_JOURNALS.some(j => normalize(journal).includes(normalize(j)) || normalize(j).includes(normalize(journal)))) score += 4;
  if (GOOD_PUBLICATION_TYPES.test(pubTypeText)) score += 3;
  if (EXCLUDED_PUBLICATION_TYPES.test(pubTypeText)) score -= 20;
  const haystack = normalize(`${article.title} ${article.abstract}`);
  for (const term of normalize(topicText).split(/\s+/).filter(w => w.length > 4)) {
    if (haystack.includes(term)) score += 1;
  }
  return score;
}

function toCandidate(article, slug, config) {
  return {
    section: "News and Articles",
    title: article.title,
    oneLineSummary: summarize(article),
    doi: article.doi || "",
    pmid: article.pmid,
    source: article.journal || "PubMed",
    sourceRepository: "targeted-online-pull",
    url: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,
    date: [article.month, article.year].filter(Boolean).join(" "),
    topic: config.topic,
    type: article.pubTypes.some(t => /meta-analysis|systematic review/i.test(t)) ? "Review" : "Research",
    relevanceScore: articleScore(article, config.topic),
    relevanceReason: `Targeted online PubMed pull for ${config.label}.`,
    status: "candidate",
    addedBy: "schedule-targeted-online-pull",
    addedAt: new Date().toISOString().slice(0, 10),
    eventDate: config.eventDate,
  };
}

export async function populateScheduleTargetedCandidates({ resources = scheduleResources, topicConfigs = buildTopicConfigsFromCalendar(), write = true } = {}) {
  const nextResources = structuredClone(resources);
  const audit = {};

  for (const [slug, config] of Object.entries(topicConfigs)) {
    const resource = nextResources[slug] || { guidelines: [], newsAndArticles: [], quiz: [] };
    const existing = resource.newsAndArticles || [];
    const existingNonTargeted = existing.filter(item => item?.sourceRepository !== "targeted-online-pull");
    const existingTargeted = existing.filter(item => item?.sourceRepository === "targeted-online-pull");
    const needed = config.minTargetedCandidates;
    audit[slug] = { existing: existing.length, prunedTargeted: existingTargeted.length, needed, added: [], search: config.search };

    const seen = new Set(existingNonTargeted.map(identity));
    const pmids = await searchPmids(config.search, 30);
    await sleep(500);
    const articles = await fetchArticles(pmids);
    await sleep(500);
    const candidates = articles
      .map(article => ({ article, score: articleScore(article, config.topic) }))
      .filter(({ article, score }) => score >= 3 && article.abstract && !EXCLUDED_TITLE_TERMS.test(article.title) && !EXCLUDED_PUBLICATION_TYPES.test(article.pubTypes.join("; ")) && (PREFERRED_JOURNALS.some(j => normalize(article.journal).includes(normalize(j)) || normalize(j).includes(normalize(article.journal))) || GOOD_PUBLICATION_TYPES.test(article.pubTypes.join("; "))))
      .sort((a, b) => b.score - a.score)
      .map(({ article }) => toCandidate(article, slug, config));

    const additions = [];
    for (const candidate of candidates) {
      const key = identity(candidate);
      if (seen.has(key)) continue;
      seen.add(key);
      additions.push(candidate);
      if (additions.length >= needed) break;
    }
    resource.newsAndArticles = [...existingNonTargeted, ...additions];
    resource.resourceNotes = `${resource.resourceNotes || ""} Targeted online pull added ${additions.length} PubMed candidate(s) for current schedule review.`.trim();
    nextResources[slug] = resource;
    audit[slug].added = additions.map(item => ({ title: item.title, pmid: item.pmid, source: item.source }));
  }

  if (write) {
    await fs.writeFile("src/data/scheduleResources.js", buildScheduleResourcesFile(nextResources));
    await fs.writeFile("/tmp/gihub-schedule-targeted-pull-audit.json", JSON.stringify(audit, null, 2));
  }
  return { resources:nextResources, audit };
}

async function main() {
  const result = await populateScheduleTargetedCandidates();
  console.log(JSON.stringify(result.audit, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
