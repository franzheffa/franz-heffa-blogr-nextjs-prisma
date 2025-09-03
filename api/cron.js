export default async function handler(req, res) {
  const upstream = process.env.BACKEND || process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    // Remplace /health par /api/cron côté Cloud Run si besoin
    const r = await fetch(`${upstream}/health`);
    const text = await r.text();
    res.status(200).json({ ok: r.ok, backend: upstream, health: text });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
}
