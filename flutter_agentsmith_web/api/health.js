import { base as gw } from './_utils.js';
export default async function handler(req, res) {
  const upstream = gw();
  try {
    const r = await fetch(`${upstream}/health`);
    const text = await r.text();
    res.status(200).json({ ok: r.ok, backend: upstream, health: text });
  } catch (e) {
    res.status(200).json({ ok: false, backend: upstream, error: String(e?.message || e) });
  }
}
