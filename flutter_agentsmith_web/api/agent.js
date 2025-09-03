import { base, methodGuard, json } from './_utils.js';
export default async function handler(req, res) {
  const upstream = base();

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, base: upstream });
  }
  if (!methodGuard(req, res, ['POST'])) return;

  const body = await json(req);
  const r = await fetch(`${upstream}/api/agent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await r.text();
  try { res.status(r.status).json(JSON.parse(text)); }
  catch { res.status(r.status).send(text); }
}
