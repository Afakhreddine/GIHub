// api/cron-weekly.js
// Legacy endpoint kept as an explicit no-op after Weekly Update moved to
// Hermes-managed repo data. Do not publish weekly updates from Vercel/Redis.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  return res.status(410).json({
    ok: false,
    error: "Weekly Update is repo-managed. Use Hermes to update src/data/weekly.js through a GitHub PR.",
  });
}
