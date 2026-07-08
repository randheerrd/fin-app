import { twilioEnvReady, startVerification } from '../_twilio.js';
import { readJson } from '../_setu.js';

// POST /api/otp/send  body: { phone } (10-digit) → Twilio Verify sends an SMS code.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!twilioEnvReady(res)) return;

  const { phone } = await readJson(req);
  if (!/^\d{10}$/.test(phone || '')) return res.status(400).json({ error: 'phone must be a 10-digit number' });

  const r = await startVerification(`+91${phone}`);
  return res.status(r.status).json(r.data);
}
