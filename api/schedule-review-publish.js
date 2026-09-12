const DEFAULT_OWNER = "Afakhreddine";
const DEFAULT_REPO = "GIHub";

function json(res, status, body) {
  return res.status(status).json(body);
}

export function resolveSchedulePublishConfig(env = process.env, payload = {}) {
  const rawPullNumber = payload.pullNumber || payload.pr || env.VERCEL_GIT_PULL_REQUEST_ID || env.GITHUB_PULL_REQUEST_ID || "";
  const pullNumber = Number.parseInt(rawPullNumber, 10);
  return {
    owner: env.GITHUB_OWNER || DEFAULT_OWNER,
    repo: env.GITHUB_REPO || DEFAULT_REPO,
    pullNumber: Number.isFinite(pullNumber) ? pullNumber : null,
    token: env.GITHUB_TOKEN || env.GH_TOKEN || "",
    reviewToken: env.WEEKLY_REVIEW_PUBLISH_TOKEN || env.SCHEDULE_REVIEW_PUBLISH_TOKEN || "",
  };
}

export function validateSchedulePublishRequest(req, env = process.env) {
  const config = resolveSchedulePublishConfig(env, req?.body || {});
  const suppliedToken = String(req?.body?.token || req?.headers?.["x-schedule-review-token"] || "");
  if (!config.reviewToken) return { ok:false, status:503, error:"Schedule review publishing is not configured." };
  if (!config.token) return { ok:false, status:503, error:"GitHub publishing token is not configured." };
  if (suppliedToken !== config.reviewToken) return { ok:false, status:401, error:"Invalid review publish token." };
  if (!config.pullNumber) return { ok:false, status:400, error:"Publishing is only available from a schedule PR preview deployment." };
  if (!req?.body?.approved) return { ok:false, status:400, error:"At least one card must be approved, and every card must be reviewed before publishing." };
  if (!Array.isArray(req?.body?.approvedItems) || req.body.approvedItems.length === 0) return { ok:false, status:400, error:"No approved schedule cards were provided for publication." };
  return { ok:true, config };
}

function identity(item) {
  return `${item?.slug || ""}|${item?.kind || ""}|${item?.title || ""}|${item?.url || item?.pmid || item?.doi || ""}`;
}

export function parseScheduleResourcesSource(source) {
  const match = String(source || "").match(/const\s+scheduleResources\s*=\s*([\s\S]*?);\s*export\s+default\s+scheduleResources\s*;/);
  if (!match) throw new Error("Could not find scheduleResources object export.");
  const parsed = JSON.parse(match[1]);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Schedule resources module did not contain an object.");
  return parsed;
}

export function buildScheduleResourcesFile(resources) {
  return `// Repo-managed Schedule tab resources.\n// Built by Hermes from guidelines, weekly updates, weeklyArchive, targeted pulls, and AutoContent quizzes.\n\nconst scheduleResources = ${JSON.stringify(resources, null, 2)};\n\nexport default scheduleResources;\n`;
}

export function filterScheduleResourcesToApproved(resources = {}, approvedItems = []) {
  const approved = new Set((approvedItems || []).map(identity));
  const next = structuredClone(resources || {});
  for (const [slug, resource] of Object.entries(next)) {
    resource.guidelines = (resource.guidelines || [])
      .filter((item) => approved.has(identity({ ...item, slug, kind:"Guideline", title:item.title || "", url:item.url || "" })))
      .map((item) => ({ ...item, status:"approved" }));
    resource.newsAndArticles = (resource.newsAndArticles || [])
      .filter((item) => approved.has(identity({ ...item, slug, kind:"News and Articles", title:item.title || item.headline || "", url:item.url || "", pmid:item.pmid || "", doi:item.doi || "" })))
      .map((item) => ({ ...item, status:"approved" }));
    resource.resourceStatus = "approved";
    resource.resourceNotes = "Approved in Schedule Review sandbox; quizzes remain pending source-PDF retrieval/AutoContent unless present.";
  }
  return next;
}

function stableScheduleResources(resources = {}) {
  return Object.fromEntries(Object.entries(resources).map(([slug, resource]) => [slug, {
    guidelines:(resource.guidelines || []).map((item) => ({ title:item.title || "", url:item.url || "", org:item.org || "" })),
    newsAndArticles:(resource.newsAndArticles || []).map((item) => ({ title:item.title || item.headline || "", url:item.url || "", pmid:item.pmid || "", doi:item.doi || "" })),
  }]));
}

export function scheduleResourcesMatchApproved(resources = {}, approvedItems = []) {
  const approved = filterScheduleResourcesToApproved(resources, approvedItems);
  return JSON.stringify(stableScheduleResources(resources)) === JSON.stringify(stableScheduleResources(approved));
}

async function githubFetch(config, path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}${path}`, {
    ...options,
    headers: {
      "Accept":"application/vnd.github+json",
      "Authorization":`Bearer ${config.token}`,
      "Content-Type":"application/json",
      "X-GitHub-Api-Version":"2022-11-28",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw:text }; }
  if (!response.ok) throw Object.assign(new Error(body?.message || body?.raw || `GitHub API failed with HTTP ${response.status}`), { status:response.status, body });
  return body;
}

async function loadScheduleResourcesFromRef(config, ref) {
  const file = await githubFetch(config, "/contents/src/data/scheduleResources.js?ref=" + encodeURIComponent(ref));
  const source = Buffer.from(file.content || "", file.encoding || "base64").toString("utf8");
  return { resources:parseScheduleResourcesSource(source), sha:file.sha };
}

async function updateScheduleResourcesOnBranch(config, pull, approvedItems, summary) {
  const { resources, sha } = await loadScheduleResourcesFromRef(config, pull.head.ref);
  const filtered = filterScheduleResourcesToApproved(resources, approvedItems);
  const body = {
    message:"chore: publish approved schedule resource cards",
    content:Buffer.from(buildScheduleResourcesFile(filtered), "utf8").toString("base64"),
    sha,
    branch:pull.head.ref,
    committer:{ name:"GIHub Review Bot", email:"review@gihub.local" },
    author:{ name:"GIHub Review Bot", email:"review@gihub.local" },
  };
  const result = await githubFetch(config, "/contents/src/data/scheduleResources.js", { method:"PUT", body:JSON.stringify(body) });
  return {
    ok:true,
    published:false,
    updated:true,
    commitSha:result?.commit?.sha,
    message:"Updated the PR branch to contain only approved Schedule resource cards. Wait for preview checks to pass, then click Publish approved again to merge.",
    summary,
  };
}

export async function publishScheduleReview(config, payload) {
  const pull = await githubFetch(config, `/pulls/${config.pullNumber}`);
  if (pull.state !== "open") return { ok:false, published:false, reason:`PR #${config.pullNumber} is ${pull.state}.` };

  const { resources } = await loadScheduleResourcesFromRef(config, pull.head.ref);
  const branchAlreadyPrepared = scheduleResourcesMatchApproved(resources, payload.approvedItems || []);
  if (!branchAlreadyPrepared) return updateScheduleResourcesOnBranch(config, pull, payload.approvedItems || [], payload.summary);

  const statuses = await githubFetch(config, `/commits/${pull.head.sha}/status`);
  if (statuses.state && statuses.state !== "success") return { ok:false, published:false, reason:`PR checks are ${statuses.state}; not publishing.` };
  const result = await githubFetch(config, `/pulls/${config.pullNumber}/merge`, {
    method:"PUT",
    body:JSON.stringify({ merge_method:"squash", commit_title:`chore: publish schedule resource cards (#${config.pullNumber})`, commit_message:payload?.summary || "Approved in Schedule Review sandbox." }),
  });
  return { ok:true, published:true, pullNumber:config.pullNumber, merged:result.merged, sha:result.sha, message:result.message };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Schedule-Review-Token");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return json(res, 405, { error:"Method not allowed" });

  const validation = validateSchedulePublishRequest(req);
  if (!validation.ok) return json(res, validation.status, { error:validation.error });
  try {
    const result = await publishScheduleReview(validation.config, req.body);
    return json(res, result.ok ? 200 : 409, result);
  } catch (error) {
    return json(res, error.status || 500, { error:error.message || "Publish failed" });
  }
}
