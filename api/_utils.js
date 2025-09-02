export function base() {
  return process.env.BACKEND || process.env.NEXT_PUBLIC_API_BASE_URL || "";
}
export async function methodGuard(req, allowed) {
  if (!allowed.includes(req.method)) {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }
}
export function passThrough(up) {
  const h = new Headers(up.headers);
  h.set('x-proxy','vercel-node');
  return new Response(up.body, { status: up.status, headers: h });
}
export const gw = base; // alias pour anciens imports
