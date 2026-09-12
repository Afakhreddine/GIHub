const VALID_WORKFLOWS = new Set(["weekly", "schedule"]);
const VALID_DECISIONS = new Set(["Approve", "Hold", "Reject"]);

function json(res, status, body) {
  return res.status(status).json(body);
}

function redisConfigured(env = process.env) {
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

function redisHeaders(env = process.env) {
  return { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` };
}

function redisUrl(path, env = process.env) {
  return `${env.UPSTASH_REDIS_REST_URL}${path}`;
}

export function reviewDecisionKey(workflow, pullNumber) {
  const cleanWorkflow = String(workflow || "").toLowerCase();
  const cleanPullNumber = String(pullNumber || "").replace(/[^0-9]/g, "");
  if (!VALID_WORKFLOWS.has(cleanWorkflow) || !cleanPullNumber) return "";
  return `gihub:review-decisions:${cleanWorkflow}:pr:${cleanPullNumber}`;
}

export function normalizeDecisions(input) {
  const output = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return output;
  for (const [rawKey, rawDecision] of Object.entries(input)) {
    const key = String(rawKey || "").slice(0, 500);
    const decision = String(rawDecision || "");
    if (!key || !VALID_DECISIONS.has(decision)) continue;
    output[key] = decision;
  }
  return output;
}

async function redisGetJson(key, env = process.env) {
  const response = await fetch(redisUrl(`/get/${encodeURIComponent(key)}`, env), { headers:redisHeaders(env) });
  if (!response.ok) throw new Error(`Decision load failed: ${response.status}`);
  const jsonBody = await response.json();
  if (!jsonBody.result) return {};
  let value = jsonBody.result;
  for (let i = 0; i < 3; i += 1) {
    if (typeof value !== "string") break;
    try { value = JSON.parse(value); } catch { break; }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

async function redisSetJson(key, value, env = process.env) {
  const response = await fetch(redisUrl(`/set/${encodeURIComponent(key)}`, env), {
    method:"POST",
    headers:{ ...redisHeaders(env), "Content-Type":"application/json" },
    body:JSON.stringify(value),
  });
  if (!response.ok) throw new Error(`Decision save failed: ${response.status}`);
}

export async function loadReviewDecisions({ workflow, pullNumber }, env = process.env) {
  if (!redisConfigured(env)) return { configured:false, decisions:{} };
  const key = reviewDecisionKey(workflow, pullNumber);
  if (!key) return { configured:true, decisions:{} };
  const stored = await redisGetJson(key, env);
  return { configured:true, decisions:normalizeDecisions(stored.decisions || stored) };
}

export async function saveReviewDecisions({ workflow, pullNumber, decisions }, env = process.env) {
  if (!redisConfigured(env)) return { configured:false, decisions:normalizeDecisions(decisions) };
  const key = reviewDecisionKey(workflow, pullNumber);
  if (!key) throw new Error("Invalid review decision key");
  const normalized = normalizeDecisions(decisions);
  const payload = {
    workflow:String(workflow || "").toLowerCase(),
    pullNumber:String(pullNumber || ""),
    decisions:normalized,
    updatedAt:new Date().toISOString(),
  };
  await redisSetJson(key, payload, env);
  return { configured:true, decisions:normalized, updatedAt:payload.updatedAt };
}

function readQuery(req) {
  const query = req.query || {};
  return {
    workflow:query.workflow || query.type || "",
    pullNumber:query.pullNumber || query.pr || "",
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { workflow, pullNumber } = readQuery(req);
      const result = await loadReviewDecisions({ workflow, pullNumber });
      return json(res, 200, { ok:true, workflow, pullNumber:String(pullNumber || ""), ...result });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const workflow = body.workflow || body.type || "";
      const pullNumber = body.pullNumber || body.pr || "";
      const result = await saveReviewDecisions({ workflow, pullNumber, decisions:body.decisions || {} });
      return json(res, 200, { ok:true, workflow, pullNumber:String(pullNumber || ""), ...result });
    }

    res.setHeader("Allow", "GET, POST");
    return json(res, 405, { ok:false, error:"Method not allowed" });
  } catch (error) {
    return json(res, 500, { ok:false, error:error.message || "Review decisions failed" });
  }
}
