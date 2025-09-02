import { runtime, dynamic, preferredRegion, base, passThrough, methodGuard } from './_utils.ts';
export { runtime, dynamic, preferredRegion };

export default async function handler(req: Request): Promise<Response> {
  const guard = await methodGuard(req, ['GET']); if (guard) return guard;
  try {
    const up = await fetch(`${base()}/voice${new URL(req.url).search}`, { method:'GET' });
    return passThrough(up);
  } catch (e:any) {
    return new Response(`Erreur proxy voix: ${e?.message||e}`, { status: 502 });
  }
}
