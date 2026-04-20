if (type === "lecture") {
  if (!topic) return res.status(400).json({ error: "Missing topic slug" });
  const cached = await redisGet(`gihub:lecture:${topic}`);
  return res.status(200).json({
    guideline: cached?.guideline || [],
    articles:  cached?.articles  || [],
    news:      cached?.news      || [],
    fetchedAt: cached?.fetchedAt || null,
  });
}
