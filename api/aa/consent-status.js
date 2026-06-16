import { setu, envReady } from '../_setu.js';

// STEP 3 (poll) — Check consent status directly.
// GET /api/aa/consent-status?id=<consentId>  → { status: PENDING | ACTIVE | REJECTED, ... }
export default async function handler(req, res) {
  if (!envReady(res)) return;
  const id = req.query?.id || new URL(req.url, 'http://x').searchParams.get('id');
  if (!id) return res.status(400).json({ error: 'id is required' });

  const r = await setu(`/consents/${id}`);
  return res.status(r.status).json(r.data);
}
