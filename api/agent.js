import { base, methodGuard } from './_utils.js';

export default async function handler(req, res) {
  const upstream = base();

  if (req.method === 'GET') {
    try {
      const r = await fetch(upstream + '/health');
      const text = await r.text();
      return res.status(200).json({ ok: r.ok, backend: upstream, health: text });
    } catch (e) {
      return res.status(200).json({ ok: false, backend: upstream, error: String(e?.message ?? e) });
    }
  }

  const guard = await methodGuard({ method: req.method }, ['POST']); 
  if (guard) { res.setHeader('Allow','GET, POST'); return res.status(405).json({ error:'Method Not Allowed' }); }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const r = await fetch(upstream + '/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: body.message ?? 'Bonjour' })
    });
    const text = await r.text();
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
