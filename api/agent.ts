import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleAuth } from "google-auth-library";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient("https://viize-agent-gemini-112329442315.us-central1.run.app");
    const result = await client.request({ url: "https://viize-agent-gemini-112329442315.us-central1.run.app/" });
    res.status(200).json(result.data);
  } catch (err) {
    console.error("❌ Cloud Run call failed:", err);
    res.status(500).json({ error: "Agent unreachable" });
  }
}
