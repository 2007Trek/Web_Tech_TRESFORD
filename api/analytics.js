module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return res.status(503).json({ enabled: false, error: "Analytics storage is not configured." });

  try {
    const endpoint = req.method === "POST" ? "INCR/portfolio:pageviews" : "GET/portfolio:pageviews";
    const response = await fetch(`${url.replace(/\/$/, "")}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`Storage returned ${response.status}`);
    const data = await response.json();
    return res.status(200).json({ enabled: true, visits: Number(data.result) || 0 });
  } catch (error) {
    console.error("Analytics endpoint error:", error);
    return res.status(502).json({ enabled: false, error: "Analytics is temporarily unavailable." });
  }
};
