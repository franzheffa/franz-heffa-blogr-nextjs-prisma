import { base, methodGuard, json } from "./_utils.js";

const candidatePaths = [
  "/agents/echo",
  "/api/agent",
  "/api/chat",
  "/echo"
];

export default async function handler(req, res) {
  const upstream = base();

  if (req.method === "GET") {
    // utilisé par ton front pour afficher "En ligne"
    return res.status(200).json({ ok: true, base: upstream });
  }

  if (!methodGuard(req, res, ["POST"])) return;

  const body = await json(req);

  // tente Cloud Run d'abord (plusieurs chemins possibles)
  for (const p of candidatePaths) {
    try {
      const r = await fetch(`${upstream}${p}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      if (r.status !== 404) {
        const text = await r.text();
        try { return res.status(r.status).json(JSON.parse(text)); }
        catch { return res.status(r.status).send(text); }
      }
    } catch (_) {
      // on tente le suivant
    }
  }

  // Fallback : écho local pour ne pas casser l'UI
  const msg = typeof body?.message === "string" ? body.message : "(vide)";
  return res.status(200).json({ reply: `Pong (local): ${msg}` });
}
