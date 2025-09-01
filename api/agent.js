export default async function handler(req, res) {
  const base = process.env.BACKEND;
  if (!base) return res.status(500).json({ error: 'BACKEND env var missing' });

  if (req.method === 'GET') {
    // Petit healthcheck proxy pour vérifier la connectivité
    try {
      const r = await fetch(base + '/health');
      const t = await r.text();
      return res.status(200).json({ ok: r.ok, base, health: t });
    } catch (e) {
      return res.status(502).json({ ok: false, base, error: String(e?.message ?? e) });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Autoprobe: on essaye plusieurs chemins d'echo jusqu'à trouver un non-404
  const candidates = [
    '/agents/echo',
    '/api/agents/echo',
    '/agent/echo',
    '/api/agent/echo',
    '/echo'
  ];

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const payload = { message: body.message ?? 'Bonjour' };

  for (const p of candidates) {
    try {
      const r = await fetch(base + p, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (r.status !== 404) {
        const data = await r.json().catch(() => ({}));
        return res.status(r.ok ? 200 : r.status).json({ path: p, data });
      }
    } catch (_) { /* on essaye le suivant */ }
  }

  return res.status(502).json({ error: 'No echo endpoint found', tried: candidates });
}
