import { twilioEnvReady, checkVerification } from '../_twilio.js';
import { mintCustomToken } from '../_firebaseAdmin.js';
import { readJson } from '../_setu.js';

// POST /api/otp/verify  body: { phone, code } → Twilio Verify checks the code;
// on success, mints a Firebase custom token (if configured) so the client can
// sign in and keep Firestore persistence working.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!twilioEnvReady(res)) return;

  const { phone, code } = await readJson(req);
  if (!/^\d{10}$/.test(phone || '') || !code) {
    return res.status(400).json({ error: 'phone and code are required' });
  }

  const r = await checkVerification(`+91${phone}`, code);
  if (!r.ok || r.data.status !== 'approved') {
    return res.status(400).json({ verified: false, error: r.data.message || 'Invalid code' });
  }

  const customToken = await mintCustomToken(`otp_${phone}`);
  return res.status(200).json({ verified: true, customToken });
}
