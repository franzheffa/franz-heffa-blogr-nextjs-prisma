// api/cron.js (CommonJS)
const BACKEND =
  process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";

module.exports = async (_req, res) => {
  try {
    const r = await fetch(`${BACKEND}/health`);
    const t = await r.text();
    res.status(200).json({ ok: r.ok, backend: BACKEND, health: t });
  } catch (e) {
    res.status(200).json({ ok: false, backend: BACKEND, error: String(e?.message || e) });
  }
};
