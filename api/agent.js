export default async function handler(req, res) {
  try {
    const base = process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const r = await fetch(`${base}/agents/echo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body.message ?? "Bonjour" })
    });
    const data = await r.json().catch(() => ({}));
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message ?? e) });
  }
}
