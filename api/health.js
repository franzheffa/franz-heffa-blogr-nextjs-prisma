const upstream = process.env.BACKEND || process.env.NEXT_PUBLIC_API_BASE_URL;
export default async function handler(req, res) {
  try {
    const r = await fetch(`${upstream}/health`);
    const text = await r.text();
    res.status(200).json({ ok: r.ok, backend: upstream, health: text });
  } catch (e) {
    res.status(200).json({ ok: false, backend: upstream, error: String(e?.message || e) });
  }
}
