export default async function handler(req, res) {
  const results = {};

  // Check env vars are present
  results.hasRedisUrl   = !!process.env.UPSTASH_REDIS_REST_URL;
  results.hasRedisToken = !!process.env.UPSTASH_REDIS_REST_TOKEN;
  results.redisUrlPrefix = process.env.UPSTASH_REDIS_REST_URL?.slice(0, 30);

  // Try reading each key from Redis
  for (const section of ["guidelines", "articles", "news"]) {
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/gihub:${section}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
      });
      const text = await response.text();
      results[section] = {
        status: response.status,
        rawLength: text.length,
        preview: text.slice(0, 200),
      };
    } catch (e) {
      results[section] = { error: e.message };
    }
  }

  return res.status(200).json(results);
}