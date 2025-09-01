export default async function handler(req, res) {
  const base = process.env.BACKEND;
  if (!base) return res.status(500).json({ error: 'BACKEND env var missing' });

  if (req.method === 'GET') return res.status(200).json({ ok: true, base });

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const r = await fetch(`${base}/api/agents/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: body.message ?? 'Bonjour' })
    });
    const data = await r.json().catch(() => ({}));
    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message ?? e) });
  }
}
