// api/voice/tts.js (CommonJS) — proxy binaire vers Cloud Run /api/voice/tts
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
    const text = body.text ?? body.message ?? "";

    const r = await fetch(`${BACKEND}/api/voice/tts`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text })
    });

    const ct = r.headers.get("content-type") || "audio/mpeg";
    const ab = await r.arrayBuffer();
    res.status(r.status);
    res.setHeader("content-type", ct);
    res.send(Buffer.from(ab));
  } catch (e) {
    return res.status(502).json({
      error: "Upstream /api/voice/tts failed",
      backend: BACKEND,
      detail: String(e?.message || e)
    });
  }
};
