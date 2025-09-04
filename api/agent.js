// api/agent.js (CommonJS) — proxy vers Cloud Run /api/gemini
const BACKEND =
  process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const prompt = body.prompt ?? body.message ?? "";
    const image_url = body.image_url ?? null;

    const r = await fetch(`${BACKEND}/api/gemini`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt, image_url })
    });

    const text = await r.text();
    try { return res.status(r.status).json(JSON.parse(text)); }
    catch { return res.status(r.status).send(text); }
  } catch (e) {
    return res.status(502).json({
      error: "Upstream /api/gemini failed",
      backend: BACKEND,
      detail: String(e?.message || e)
    });
  }
};
