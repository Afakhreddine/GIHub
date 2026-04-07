export default async function handler(req, res) {
  const results = {};

  results.hasRedisUrl   = !!process.env.UPSTASH_REDIS_REST_URL;
  results.hasRedisToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;

  for (const section of ["guidelines", "articles", "news"]) {
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/gihub:${section}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      const json = await response.json();

      // Attempt full parse chain
      let val = json.result;
      let parseSteps = 0;
      while (typeof val === "string" && parseSteps < 3) {
        try { val = JSON.parse(val); parseSteps++; } catch { break; }
      }

      results[section] = {
        status: response.status,
        parseSteps,
        isObject: typeof val === "object",
        hasData: Array.isArray(val?.data),
        dataCount: Array.isArray(val?.data) ? val.data.length : 0,
        fetchedAt: val?.fetchedAt ? new Date(val.fetchedAt).toISOString() : null,
        firstItem: Array.isArray(val?.data) && val.data.length > 0 ? val.data[0] : null,
      };
    } catch (e) {
      results[section] = { error: e.message };
    }
  }

  return res.status(200).json(results);
}