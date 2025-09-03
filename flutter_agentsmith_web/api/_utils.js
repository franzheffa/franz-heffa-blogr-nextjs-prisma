export const base = () =>
  process.env.BACKEND ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://agent-smith-heffa-112329442315.us-central1.run.app";

export const methodGuard = (req, res, methods = ['GET','POST']) => {
  if (!methods.includes(req.method)) {
    res.setHeader('Allow', methods.join(', '));
    res.status(405).json({ error: 'Method Not Allowed' });
    return false;
  }
  return true;
};

export const json = async (req) => {
  try {
    return typeof req.body === 'string'
      ? JSON.parse(req.body || '{}')
      : (req.body || {});
  } catch { return {}; }
};
