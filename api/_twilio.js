// Twilio Verify client — runs ONLY on the server (Vercel function), so the
// auth token never reaches the browser. Primary OTP provider; the frontend
// falls back to Firebase Phone Auth if these endpoints are unavailable.
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;
const BASE = `https://verify.twilio.com/v2/Services/${VERIFY_SERVICE_SID}`;

export function twilioEnvReady(res) {
  const missing = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SERVICE_SID'].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    res.status(500).json({ error: `Missing Twilio env: ${missing.join(', ')}` });
    return false;
  }
  return true;
}

function authHeader() {
  return 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');
}

async function verifyRequest(path, params) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(params),
  });
  const data = await r.json();
  return { status: r.status, ok: r.ok, data };
}

export function startVerification(phoneE164) {
  return verifyRequest('/Verifications', { To: phoneE164, Channel: 'sms' });
}

export function checkVerification(phoneE164, code) {
  return verifyRequest('/VerificationCheck', { To: phoneE164, Code: code });
}
