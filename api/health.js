import { base } from './_utils.js';
export default async function handler(_req, res) {
  const upstream = base();
  try {
    const r = await fetch(`${upstream}/health`);
    const t = await r.text();
    res.status(200).json({ ok: r.ok, backend: upstream, health: t });
  } catch (e) {
    res.status(200).json({ ok: false, backend: upstream, error: String(e?.message || e) });
  }
}
