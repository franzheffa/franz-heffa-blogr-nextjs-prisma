export const base = () =>
  process.env.BACKEND || "https://agent-smith-heffa-112329442315.us-central1.run.app";

export const readJson = async (req) => {
  try {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  } catch {
    return {};
  }
};
