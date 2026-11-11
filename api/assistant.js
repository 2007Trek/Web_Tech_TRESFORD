const SYSTEM_PROMPT = `You are the portfolio assistant for Tresford Mulilima. Answer only from the facts below. If asked about something not listed, say you do not have verified information and suggest contacting Tresford. Never invent qualifications, employment, awards, certifications, grades, project outcomes or skill levels.

Verified portfolio context:
- Tresford Mulilima is a second-year Bachelor of Science in Computer Science student at Mulungushi University in Zambia.
- Professional interests: software engineering, programming, computer systems, databases and artificial intelligence.
- Technologies studied, used in coursework or explored: Java, Python, JavaScript, HTML, CSS, FastAPI, REST APIs, SQLite, PostgreSQL and Git.
- Exploring: AI/ML, retrieval-augmented generation, cybersecurity and cloud deployment.
- Projects: CustomerManager (Java customer records/CRUD); TechShelf (inventory/CRUD coursework project); TREK TIMEWISE (Python/FastAPI productivity tracking MVP); Local AI Studio (Windows local AI/RAG experiment); personal portfolio (HTML/CSS/JavaScript).
- Contact: tresfordmulilima@gmail.com; GitHub https://github.com/2007Trek; WhatsApp +260960940621.
Keep answers concise, professional and transparent about the difference between experience and learning interests.`;


async function withinDailyLimit(key, limit) {
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return false;
  const day = new Date().toISOString().slice(0, 10);
  const root = base.replace(/\\/$/, "");
  const headers = { Authorization: `Bearer ${token}` };
  const increment = await fetch(`${root}/incr/${key}:${day}`, { headers, cache: "no-store" });
  if (!increment.ok) throw new Error("Rate-limit storage unavailable");
  const data = await increment.json();
  if (Number(data.result) === 1) {
    await fetch(`${root}/expire/${key}:${day}/172800`, { headers, cache: "no-store" });
  }
  return Number(data.result) <= limit;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "The AI assistant is not configured yet." });
  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-8) : [];
  if (!messages.length || messages.some(m => !["user", "assistant"].includes(m.role) || typeof m.content !== "string" || m.content.length > 1200)) {
    return res.status(400).json({ error: "Send up to 8 valid messages, each no longer than 1,200 characters." });
  }
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 350,
        temperature: 0.3
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", response.status, JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: "The assistant is temporarily unavailable." });
    }
    return res.status(200).json({ reply: data.choices?.[0]?.message?.content || "I could not generate a response." });
  } catch (error) {
    console.error("Assistant endpoint error:", error);
    return res.status(500).json({ error: "Unexpected server error." });
  }
};
