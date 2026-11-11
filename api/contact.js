const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


async function withinDailyLimit(key, limit) {
  const base = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return false;
  const day = new Date().toISOString().slice(0, 10);
  const root = base.endsWith("/") ? base.slice(0, -1) : base;
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

  const origin = req.headers.origin;
  const allowedOrigin = process.env.SITE_URL;
  if (origin && allowedOrigin && new URL(origin).origin !== new URL(allowedOrigin).origin) {
    return res.status(403).json({ error: "Origin not allowed." });
  }

  const { name, email, message, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true });
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 80 ||
      typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254 ||
      typeof message !== "string" || message.trim().length < 10 || message.length > 4000) {
    return res.status(400).json({ error: "Please provide a valid name, email and message (10–4,000 characters)." });
  }
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
    return res.status(503).json({ error: "The contact service is not configured yet. Please use the email link instead." });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL,
        to: [process.env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Portfolio enquiry from ${name.trim().slice(0, 80)}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error("Resend error:", response.status, detail.slice(0, 500));
      return res.status(502).json({ error: "Message delivery failed. Please email directly." });
    }
    return res.status(200).json({ ok: true, message: "Your message has been sent." });
  } catch (error) {
    console.error("Contact endpoint error:", error);
    return res.status(500).json({ error: "Unexpected server error. Please email directly." });
  }
};
