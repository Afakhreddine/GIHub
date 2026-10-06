#!/usr/bin/env node
import fs from "node:fs/promises";
import { buildScheduleResourcesFile } from "../src/scheduleResourcesModel.js";
import scheduleResources from "../src/data/scheduleResources.js";

const TOPIC_CONFIG = {
  "colon-polyps-pathology": {
    label: "Colon Polyps Pathology",
    topic: "Colon Polyps Pathology",
    eventDate: "2026-10-02",
    minTargetedCandidates: 2,
    search: "(colon polyp[Title/Abstract] OR colorectal polyp[Title/Abstract] OR colorectal adenoma[Title/Abstract] OR serrated lesion[Title/Abstract] OR sessile serrated[Title/Abstract] OR adenomatous polyposis[Title/Abstract]) AND (2025:2026[pdat])",
  },
  "appendix-and-anus-pathology": {
    label: "Appendix and Anus Pathology",
    topic: "Appendix and Anus Pathology",
    eventDate: "2026-10-16",
    minTargetedCandidates: 2,
    search: "(appendiceal neoplasm[Title/Abstract] OR appendiceal tumor[Title/Abstract] OR appendiceal mucinous[Title/Abstract] OR anal dysplasia[Title/Abstract] OR anal cancer[Title/Abstract] OR anorectal pathology[Title/Abstract]) AND (2025:2026[pdat])",
  },
  "celiac-disease": {
    label: "Celiac Disease",
    topic: "Celiac Disease",
    eventDate: "2026-10-20",
    minTargetedCandidates: 2,
    search: "(celiac disease[Title/Abstract] OR coeliac disease[Title/Abstract] OR gluten enteropathy[Title/Abstract] OR villous atrophy[Title/Abstract] OR gluten-free diet[Title/Abstract]) AND (2025:2026[pdat])",
  },
  "small-intestine-pathology": {
    label: "Small Intestine Pathology",
    topic: "Small Intestine Pathology",
    eventDate: "2026-10-23",
    minTargetedCandidates: 2,
    search: "(small intestine pathology[Title/Abstract] OR small bowel tumor[Title/Abstract] OR small bowel disease[Title/Abstract] OR duodenal pathology[Title/Abstract] OR enteropathy[Title/Abstract] OR jejunal[Title/Abstract] OR ileal[Title/Abstract]) AND (2025:2026[pdat])",
  },
  "ai-in-gi-research": {
    label: "AI in GI Research",
    topic: "AI in GI Research",
    eventDate: "2026-10-27",
    minTargetedCandidates: 2,
    search: "(artificial intelligence[Title/Abstract] OR machine learning[Title/Abstract] OR deep learning[Title/Abstract] OR large language model[Title/Abstract] OR generative AI[Title/Abstract]) AND (gastroenterology[Title] OR endoscopy[Title] OR gastrointestinal[Title] OR colonoscopy[Title] OR digestive[Title]) AND (2025:2026[pdat])",
  },
  "colon-pathology": {
    label: "Colon Pathology",
    topic: "Colon Pathology",
    eventDate: "2026-10-30",
    minTargetedCandidates: 2,
    search: "(colon pathology[Title/Abstract] OR colitis pathology[Title/Abstract] OR colorectal cancer pathology[Title/Abstract] OR colorectal neoplasia[Title/Abstract] OR inflammatory bowel disease dysplasia[Title/Abstract] OR microscopic colitis[Title/Abstract]) AND (2025:2026[pdat])",
  },
};

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
    if (res.ok) return path.endsWith(".fcgi") ? res.text() : res.text();
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

const resources = structuredClone(scheduleResources);
const audit = {};

for (const [slug, config] of Object.entries(TOPIC_CONFIG)) {
  const resource = resources[slug] || { guidelines: [], newsAndArticles: [], quiz: [] };
  const existing = resource.newsAndArticles || [];
  const existingNonTargeted = existing.filter(item => item?.sourceRepository !== "targeted-online-pull");
  const existingTargeted = existing.filter(item => item?.sourceRepository === "targeted-online-pull");
  const needed = config.minTargetedCandidates;
  audit[slug] = { existing: existing.length, prunedTargeted: existingTargeted.length, needed, added: [] };

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
  resource.resourceNotes = `${resource.resourceNotes || ""} Targeted online pull added ${additions.length} PubMed candidate(s) for sparse News and Articles review.`.trim();
  resources[slug] = resource;
  audit[slug].added = additions.map(item => ({ title: item.title, pmid: item.pmid, source: item.source }));
}

await fs.writeFile("src/data/scheduleResources.js", buildScheduleResourcesFile(resources));
await fs.writeFile("/tmp/gihub-schedule-targeted-pull-audit.json", JSON.stringify(audit, null, 2));
console.log(JSON.stringify(audit, null, 2));
