import { setu, envReady } from '../_setu.js';

// STEP 5 — Fetch FI data for a session.
// GET /api/aa/data?sessionId=<id>  → { status: COMPLETED, ... FI accounts + transactions }
export default async function handler(req, res) {
  if (!envReady(res)) return;
  const sessionId = req.query?.sessionId || new URL(req.url, 'http://x').searchParams.get('sessionId');
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const r = await setu(`/sessions/${sessionId}`);
  return res.status(r.status).json(r.data);
}
