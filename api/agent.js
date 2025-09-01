export default async function handler(req, res) {
  const base = process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";

  if (req.method === 'GET') {
    try {
      const r = await fetch(base + "/health");
      const text = await r.text();
      return res.status(200).json({ ok: r.ok, backend: base, health: text });
    } catch (e) {
      return res.status(200).json({ ok: false, backend: base, error: String(e?.message ?? e) });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    // ton backend attend { prompt: string, image_url?: string }
    const payload = { prompt: body.message ?? body.prompt ?? "Bonjour" };

    const r = await fetch(base + "/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await r.text(); // robustesse: si ce n'est pas du JSON on te renvoie le texte brut
    let data; try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(r.ok ? 200 : r.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: String(e?.message ?? e) });
  }
}
