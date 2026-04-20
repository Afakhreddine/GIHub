// ── LECTURE: guideline from repo, articles/news from Redis ───────────
if (type === "lecture") {
  if (!topic) return res.status(400).json({ error: "Missing topic slug" });

  const cached = await redisGet(`gihub:lecture:${topic}`);
  const repo   = await redisGet("gihub:guidelines:repo");

  let guideline = [];
  if (Array.isArray(repo) && repo.length > 0) {
    // Convert slug to search terms, strip stopwords
    const STOPWORDS = new Set(["and","the","for","with","from","that","this","into","versus","related","management","diagnosis","treatment","clinical","practice","guideline","guidelines","update"]);
    const topicWords = topic.replace(/-/g," ").toLowerCase().split(" ")
      .filter(w => w.length > 2 && !STOPWORDS.has(w));

    const scored = repo.map(g => {
      const titleLower   = g.title.toLowerCase();
      const topicLower   = (g.topic || "").toLowerCase();
      const summaryLower = (g.summary || "").toLowerCase();

      // Pass 1: exact slug-word match in guideline title or topic field (highest weight)
      const titleMatches   = topicWords.filter(w => titleLower.includes(w)).length;
      const topicMatches   = topicWords.filter(w => topicLower.includes(w)).length;
      const summaryMatches = topicWords.filter(w => summaryLower.includes(w)).length;

      const score = (titleMatches * 3) + (topicMatches * 2) + summaryMatches;
      return { ...g, _score: score };
    }).filter(g => g._score > 0);

    scored.sort((a, b) => b._score - a._score);

    if (scored.length > 0) {
      const { _score, ...best } = scored[0];
      guideline = [best];
    }
  }

  return res.status(200).json({
    guideline,
    articles:  cached?.articles  || [],
    news:      cached?.news      || [],
    fetchedAt: cached?.fetchedAt || null,
  });
}
