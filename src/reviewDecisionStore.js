const VALID_WORKFLOWS = new Set(["weekly", "schedule"]);
const VALID_DECISIONS = new Set(["Approve", "Hold", "Reject"]);

function defaultEnv() {
  return globalThis.process?.env || {};
}

function redisConfigured(env = defaultEnv()) {
  return Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
}

function redisHeaders(env = defaultEnv()) {
  return { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` };
}

function redisUrl(path, env = defaultEnv()) {
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

async function redisGetJson(key, env = defaultEnv()) {
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

async function redisSetJson(key, value, env = defaultEnv()) {
  const response = await fetch(redisUrl(`/set/${encodeURIComponent(key)}`, env), {
    method:"POST",
    headers:{ ...redisHeaders(env), "Content-Type":"application/json" },
    body:JSON.stringify(value),
  });
  if (!response.ok) throw new Error(`Decision save failed: ${response.status}`);
}

export async function loadReviewDecisions({ workflow, pullNumber }, env = defaultEnv()) {
  if (!redisConfigured(env)) return { configured:false, decisions:{} };
  const key = reviewDecisionKey(workflow, pullNumber);
  if (!key) return { configured:true, decisions:{} };
  const stored = await redisGetJson(key, env);
  return { configured:true, decisions:normalizeDecisions(stored.decisions || stored) };
}

export async function saveReviewDecisions({ workflow, pullNumber, decisions }, env = defaultEnv()) {
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
