import { base, methodGuard } from './_utils.ts';

export default async function handler(req, res) {
  const upstream = base();

  if (req.method === 'GET') {
    try {
      const r = await fetch(upstream + "/health");
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
    const up = await fetch(`${upstream}/agents/echo`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });
    const data = await up.json().catch(()=>({}));
    return res.status(up.ok ? 200 : up.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
export const config = { runtime:'edge', regions:['iad1','cdg1','fra1'] };
