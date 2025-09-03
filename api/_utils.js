export const base = () =>
  process.env.BACKEND ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://agent-smith-heffa-112329442315.us-central1.run.app";
