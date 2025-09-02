export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['iad1','cdg1','fra1'];

export function base(): string {
  // BACKEND = Cloud Run direct (us-central1)
  return (
    process.env.BACKEND ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    ""
  );
}

export async function methodGuard(req: Request, allowed: string[]) {
  if (!allowed.includes(req.method)) {
    return new Response(JSON.stringify({ error: 'Method Not Allowed'}), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }
}

export function passThrough(up: Response): Promise<Response> {
  const headers = new Headers(up.headers);
  headers.set('x-proxy', 'vercel-edge');
  return Promise.resolve(new Response(up.body, { status: up.status, headers }));
}
