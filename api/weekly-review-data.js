const DEFAULT_OWNER = "Afakhreddine";
const DEFAULT_REPO = "GIHub";

function json(res, status, body) {
  return res.status(status).json(body);
}

export function parseWeeklyModuleSource(source) {
  const match = String(source || "").match(/const\s+weekly\s*=\s*([\s\S]*?);\s*export\s+default\s+weekly\s*;/);
  if (!match) throw new Error("Could not find weekly array export.");
  const parsed = JSON.parse(match[1]);
  if (!Array.isArray(parsed)) throw new Error("Weekly module did not contain an array.");
  return parsed;
}

async function githubFetch(path, env = process.env) {
  const owner = env.GITHUB_OWNER || DEFAULT_OWNER;
  const repo = env.GITHUB_REPO || DEFAULT_REPO;
  const token = env.GITHUB_TOKEN || env.GH_TOKEN || "";
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}${path}`, {
    headers: {
      "Accept":"application/vnd.github+json",
      ...(token ? { "Authorization":`Bearer ${token}` } : {}),
      "X-GitHub-Api-Version":"2022-11-28",
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { raw:text }; }
  if (!response.ok) throw new Error(body?.message || body?.raw || `GitHub API failed with HTTP ${response.status}`);
  return body;
}

export async function loadWeeklyReviewDataForPr(pr, env = process.env) {
  const pullNumber = Number.parseInt(pr, 10);
  if (!Number.isFinite(pullNumber) || pullNumber <= 0) throw new Error("A valid pull-request number is required.");
  const pull = await githubFetch(`/pulls/${pullNumber}`, env);
  const file = await githubFetch(`/contents/src/data/weekly.js?ref=${encodeURIComponent(pull.head.ref)}`, env);
  const source = Buffer.from(file.content || "", file.encoding || "base64").toString("utf8");
  return {
    pr:pullNumber,
    branch:pull.head.ref,
    url:pull.html_url,
    items:parseWeeklyModuleSource(source),
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return json(res, 405, { error:"Method not allowed" });

  try {
    const pr = req.query?.pr || new URL(req.url, "http://localhost").searchParams.get("pr");
    const data = await loadWeeklyReviewDataForPr(pr);
    return json(res, 200, data);
  } catch (error) {
    return json(res, 400, { error:error.message || "Could not load weekly review data" });
  }
}
