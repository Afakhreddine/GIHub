const DEFAULT_OWNER = "Afakhreddine";
const DEFAULT_REPO = "GIHub";

function json(res, status, body) {
  return res.status(status).json(body);
}

export function resolvePublishConfig(env = process.env) {
  const pullNumber = Number.parseInt(env.VERCEL_GIT_PULL_REQUEST_ID || env.GITHUB_PULL_REQUEST_ID || "", 10);
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
  const config = resolvePublishConfig(env);
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

async function updateWeeklyFileOnBranch(config, pull, approvedItems, summary) {
  const current = await githubFetch(config, "/contents/src/data/weekly.js?ref=" + encodeURIComponent(pull.head.ref));
  const content = buildUpdatedWeeklyFile(approvedItems);
  const encoded = Buffer.from(content, "utf8").toString("base64");
  const result = await githubFetch(config, "/contents/src/data/weekly.js", {
    method:"PUT",
    body:JSON.stringify({
      message:"chore: publish approved weekly update cards",
      content:encoded,
      sha:current.sha,
      branch:pull.head.ref,
      committer:{ name:"GIHub Review Bot", email:"review@gihub.local" },
      author:{ name:"GIHub Review Bot", email:"review@gihub.local" },
    }),
  });
  return {
    ok:true,
    published:false,
    updated:true,
    commitSha:result?.commit?.sha,
    message:"Updated the PR branch to contain only approved cards. Wait for the preview checks to pass, then click Publish approved again to merge.",
    summary,
  };
}

export async function publishWeeklyReview(config, payload) {
  const pull = await githubFetch(config, `/pulls/${config.pullNumber}`);
  if (pull.state !== "open") {
    return { ok:false, published:false, reason:`PR #${config.pullNumber} is ${pull.state}.` };
  }
  if ((payload?.approvedItems?.length || 0) < (payload?.counts?.total || payload?.approvedItems?.length || 0)) {
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
