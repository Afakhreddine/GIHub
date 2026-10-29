// Combines GitHub's legacy commit statuses (e.g. Vercel previews) with check runs
// (e.g. GitHub Actions) into one state, so publishing works on any host.
const PASSING_CONCLUSIONS = new Set(["success", "neutral", "skipped"]);

export function summarizePrChecks(statuses, checkRuns) {
  const states = [];
  if (Number(statuses?.total_count || 0) > 0) states.push(statuses.state);
  for (const run of checkRuns?.check_runs || []) {
    if (run.status !== "completed") states.push("pending");
    else states.push(PASSING_CONCLUSIONS.has(run.conclusion) ? "success" : "failure");
  }
  // No checks at all means CI has not reported yet; never merge blind.
  if (states.length === 0) return "pending";
  if (states.some(state => state === "failure" || state === "error")) return "failure";
  if (states.some(state => state !== "success")) return "pending";
  return "success";
}

export async function loadPrChecksState(githubFetch, config, sha) {
  const [statuses, checkRuns] = await Promise.all([
    githubFetch(config, `/commits/${sha}/status`),
    githubFetch(config, `/commits/${sha}/check-runs?per_page=100`),
  ]);
  return summarizePrChecks(statuses, checkRuns);
}
