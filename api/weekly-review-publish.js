const DEFAULT_OWNER = "Afakhreddine";
const DEFAULT_REPO = "GIHub";

function json(res, status, body) {
  return res.status(status).json(body);
}

export function resolvePublishConfig(env = process.env, payload = {}) {
  const rawPullNumber = payload.pullNumber || payload.pr || env.VERCEL_GIT_PULL_REQUEST_ID || env.GITHUB_PULL_REQUEST_ID || "";
  const pullNumber = Number.parseInt(rawPullNumber, 10);
  return {
    owner: env.GITHUB_OWNER || DEFAULT_OWNER,
    repo: env.GITHUB_REPO || DEFAULT_REPO,
    pullNumber: Number.isFinite(pullNumber) ? pullNumber : null,
    branch: env.VERCEL_GIT_COMMIT_REF || "",
    token: env.GITHUB_TOKEN || env.GH_TOKEN || "",
    reviewToken: env.WEEKLY_REVIEW_PUBLISH_TOKEN || "",
  };
}

export function validatePublishRequest(req, env = process.env) {
  const config = resolvePublishConfig(env, req?.body || {});
  const suppliedToken = String(req?.body?.token || req?.headers?.["x-weekly-review-token"] || "");
  if (!config.reviewToken) return { ok:false, status:503, error:"Weekly review publishing is not configured." };
  if (!config.token) return { ok:false, status:503, error:"GitHub publishing token is not configured." };
  if (suppliedToken !== config.reviewToken) return { ok:false, status:401, error:"Invalid review publish token." };
  if (!config.pullNumber) return { ok:false, status:400, error:"Publishing is only available from a weekly-update PR preview deployment." };
  if (!req?.body?.approved) return { ok:false, status:400, error:"At least one card must be approved, and every card must be reviewed before publishing." };
  if (!Array.isArray(req?.body?.approvedItems) || req.body.approvedItems.length === 0) {
    return { ok:false, status:400, error:"No approved cards were provided for publication." };
  }
  return { ok:true, config };
}

export function buildUpdatedWeeklyFile(items) {
  return `const weekly = ${JSON.stringify(items, null, 2)};\n\nexport default weekly;\n`;
}

function firstUsefulSentence(summary) {
  const sentences = String(summary || "")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const useful = sentences.find((sentence) => !/^(limitation|source verified|ai-assisted)/i.test(sentence) && !/(;\s*)?(patients?|adults|participants|gi researchers|clinicians|not applicable|\d[\d,]*\.?$)/i.test(sentence));
  return (useful || sentences[0] || "").replace(/\s+/g, " ").slice(0, 280);
}

export function extractDoi(value) {
  const text = String(value || "");
  const match = text.match(/10\.\d{4,9}\/[^\s?#)]+/i);
  return match ? match[0].replace(/[.,;]+$/, "") : "";
}

export function extractPmid(value) {
  const text = String(value || "");
  const match = text.match(/(?:pubmed\.ncbi\.nlm\.nih\.gov\/|pmid[:\s]*)(\d{6,9})/i);
  return match ? match[1] : "";
}

export function toWeeklyArchiveRecord(item, options = {}) {
  const sourceText = [item?.studyUrl, item?.url, item?.summary].filter(Boolean).join(" ");
  return {
    title:String(item?.title || "").trim(),
    oneLineSummary:firstUsefulSentence(item?.summary),
    doi:extractDoi(sourceText),
    pmid:extractPmid(sourceText),
    source:String(item?.source || "").trim(),
    url:String(item?.studyUrl || item?.url || "").trim(),
    date:String(item?.date || "").trim(),
    topic:String(item?.topic || "").trim(),
    type:String(item?.type || "").trim(),
    archivedFrom:String(options.archivedFrom || "").trim(),
  };
}

function archiveKey(record) {
  return [String(record?.doi || "").toLowerCase(), String(record?.pmid || ""), String(record?.title || "").toLowerCase().replace(/\s+/g, " ").trim()].filter(Boolean).join("|");
}

export function mergeWeeklyArchive(existing = [], outgoingItems = [], options = {}) {
  const merged = [...(existing || [])];
  const seen = new Set(merged.map(archiveKey));
  const additions = [];
  for (const item of outgoingItems || []) {
    const record = toWeeklyArchiveRecord(item, options);
    if (!record.title) continue;
    const key = archiveKey(record);
    if (seen.has(key)) continue;
    seen.add(key);
    additions.push(record);
  }
  return [...additions, ...merged];
}

export function weeklyArchiveContainsItems(existing = [], outgoingItems = []) {
  const seen = new Set((existing || []).map(archiveKey));
  return (outgoingItems || []).every((item) => seen.has(archiveKey(toWeeklyArchiveRecord(item))));
}

export function parseWeeklyArchiveSource(source) {
  const match = String(source || "").match(/const\s+weeklyArchive\s*=\s*([\s\S]*?);\s*export\s+default\s+weeklyArchive\s*;/);
  if (!match) return [];
  const parsed = JSON.parse(match[1]);
  return Array.isArray(parsed) ? parsed : [];
}

export function buildWeeklyArchiveFile(items) {
  return `// Repo-managed abbreviated archive of previously published GIHub weekly update cards.\n// Intended for schedule-tab and future longitudinal browsing.\n\nconst weeklyArchive = ${JSON.stringify(items, null, 2)};\n\nexport default weeklyArchive;\n`;
}

async function githubFetch(config, path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}${path}`, {
    ...options,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${config.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw:text }; }
  if (!response.ok) {
    const message = body?.message || body?.raw || `GitHub API failed with HTTP ${response.status}`;
    throw Object.assign(new Error(message), { status:response.status, body });
  }
  return body;
}

async function updateFileOnBranch(config, filePath, content, branch, message) {
  let current = null;
  try {
    current = await githubFetch(config, `/contents/${filePath}?ref=` + encodeURIComponent(branch));
  } catch (error) {
    if (error.status !== 404) throw error;
  }
  const encoded = Buffer.from(content, "utf8").toString("base64");
  const body = {
    message,
    content:encoded,
    branch,
    committer:{ name:"GIHub Review Bot", email:"review@gihub.local" },
    author:{ name:"GIHub Review Bot", email:"review@gihub.local" },
  };
  if (current?.sha) body.sha = current.sha;
  const result = await githubFetch(config, `/contents/${filePath}`, {
    method:"PUT",
    body:JSON.stringify(body),
  });
  return result?.commit?.sha;
}

async function loadWeeklyItemsFromRef(config, ref) {
  const file = await githubFetch(config, "/contents/src/data/weekly.js?ref=" + encodeURIComponent(ref));
  const source = Buffer.from(file.content || "", file.encoding || "base64").toString("utf8");
  const match = source.match(/const\s+weekly\s*=\s*([\s\S]*?);\s*export\s+default\s+weekly\s*;/);
  if (!match) return [];
  const parsed = JSON.parse(match[1]);
  return Array.isArray(parsed) ? parsed : [];
}

async function loadArchiveFromBranch(config, branch) {
  try {
    const file = await githubFetch(config, "/contents/src/data/weeklyArchive.js?ref=" + encodeURIComponent(branch));
    const source = Buffer.from(file.content || "", file.encoding || "base64").toString("utf8");
    return parseWeeklyArchiveSource(source);
  } catch (error) {
    if (error.status === 404) return [];
    throw error;
  }
}

async function updateArchiveOnBranch(config, pull) {
  const currentPublishedItems = await loadWeeklyItemsFromRef(config, pull.base.ref);
  const existingArchive = await loadArchiveFromBranch(config, pull.head.ref);
  const archive = mergeWeeklyArchive(existingArchive, currentPublishedItems, { archivedFrom:new Date().toISOString().slice(0, 10) });
  return updateFileOnBranch(config, "src/data/weeklyArchive.js", buildWeeklyArchiveFile(archive), pull.head.ref, "chore: archive previous weekly update cards");
}

async function updateWeeklyFileOnBranch(config, pull, approvedItems, summary) {
  const archiveCommitSha = await updateArchiveOnBranch(config, pull);
  const weeklyCommitSha = await updateFileOnBranch(config, "src/data/weekly.js", buildUpdatedWeeklyFile(approvedItems), pull.head.ref, "chore: publish approved weekly update cards");
  return {
    ok:true,
    published:false,
    updated:true,
    commitSha:weeklyCommitSha,
    archiveCommitSha,
    message:"Updated the PR branch to contain only approved cards and archived the outgoing weekly cards. Wait for the preview checks to pass, then click Publish approved again to merge.",
    summary,
  };
}

export async function publishWeeklyReview(config, payload) {
  const pull = await githubFetch(config, `/pulls/${config.pullNumber}`);
  if (pull.state !== "open") {
    return { ok:false, published:false, reason:`PR #${config.pullNumber} is ${pull.state}.` };
  }

  const currentPublishedItems = await loadWeeklyItemsFromRef(config, pull.base.ref);
  const existingArchive = await loadArchiveFromBranch(config, pull.head.ref);
  const archived = weeklyArchiveContainsItems(existingArchive, currentPublishedItems);
  if (!archived || (payload?.approvedItems?.length || 0) < (payload?.counts?.total || payload?.approvedItems?.length || 0)) {
    return updateWeeklyFileOnBranch(config, pull, payload.approvedItems, payload.summary);
  }

  const statuses = await githubFetch(config, `/commits/${pull.head.sha}/status`);
  if (statuses.state && statuses.state !== "success") {
    return { ok:false, published:false, reason:`PR checks are ${statuses.state}; not publishing.` };
  }
  const result = await githubFetch(config, `/pulls/${config.pullNumber}/merge`, {
    method:"PUT",
    body: JSON.stringify({
      merge_method:"squash",
      commit_title:`chore: publish weekly update (#${config.pullNumber})`,
      commit_message: payload?.summary || "Approved in Weekly Update Review sandbox.",
    }),
  });
  return {
    ok:true,
    published:true,
    pullNumber:config.pullNumber,
    merged:result.merged,
    sha:result.sha,
    message:result.message,
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Weekly-Review-Token");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return json(res, 405, { error:"Method not allowed" });

  const validation = validatePublishRequest(req);
  if (!validation.ok) return json(res, validation.status, { error:validation.error });

  try {
    const result = await publishWeeklyReview(validation.config, req.body);
    return json(res, result.ok ? 200 : 409, result);
  } catch (error) {
    return json(res, error.status || 500, { error:error.message || "Publish failed" });
  }
}
