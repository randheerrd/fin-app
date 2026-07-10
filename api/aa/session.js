import { setu, envReady, readJson } from '../_setu.js';

// STEP 4 — Create a data session (request FI data once consent is ACTIVE).
// POST /api/aa/session  body: { consentId, from?, to? }  → { id (sessionId), status }
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!envReady(res)) return;

  const { consentId, from, to } = await readJson(req);
  if (!consentId) return res.status(400).json({ error: 'consentId is required' });

  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180);

  const body = {
    consentId,
    dataRange: { from: from || sixMonthsAgo.toISOString(), to: to || now.toISOString() },
    format: 'json',
  };

  const r = await setu('/sessions', { method: 'POST', body });
  if (!r.ok) console.error('AA session creation failed:', JSON.stringify(r.data));
  return res.status(r.status).json(r.data);
}
