// Shared auth gate for cron and admin endpoints.
//
// Vercel Cron pings include `Authorization: Bearer ${process.env.CRON_SECRET}`
// automatically when CRON_SECRET is set in the project's environment vars.
// Manual operators (e.g. running `?society=ACG` to seed, or `?reset=true`)
// must include the same header.
//
// The public consumer endpoint api/claude.js intentionally does NOT use this —
// the React app calls it without auth.

export function requireCronAuth(req, res) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    res.status(500).json({ error: "CRON_SECRET not configured" });
    return false;
  }
  const header = req.headers?.authorization;
  if (header !== `Bearer ${expected}`) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
