// Shared Setu AA (FIU) client — runs ONLY on the server (Vercel function),
// so client credentials never reach the browser.
// Sandbox base URL defaults to Setu's FIU sandbox; override with SETU_BASE_URL.
// Auth: org-service client-credentials login (bearer token), not raw x-client-id/secret headers.
const BASE = process.env.SETU_BASE_URL || 'https://fiu-sandbox.setu.co/v2';
const ORG_LOGIN_URL = process.env.SETU_ORG_LOGIN_URL || 'https://orgservice-prod.setu.co/v1/users/login';

export function envReady(res) {
  const missing = ['SETU_ORG_CLIENT_ID', 'SETU_ORG_CLIENT_SECRET', 'SETU_PRODUCT_INSTANCE_ID'].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    res.status(500).json({ error: `Missing Setu env: ${missing.join(', ')}` });
    return false;
  }
  return true;
}

// In-memory token cache — persists across warm invocations of the same
// serverless instance; cheap enough to just re-fetch on a cold start.
let cachedToken = null;

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const r = await fetch(ORG_LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', client: 'bridge' },
    body: JSON.stringify({
      clientID: process.env.SETU_ORG_CLIENT_ID,
      grant_type: 'client_credentials',
      secret: process.env.SETU_ORG_CLIENT_SECRET,
    }),
  });
  if (!r.ok) throw new Error(`Setu org login failed: ${r.status}`);
  const data = await r.json();
  const token = data.access_token;
  // JWT doesn't expose expiry here without decoding; refresh a bit early to be safe.
  cachedToken = { value: token, expiresAt: Date.now() + 25 * 60 * 1000 };
  return token;
}

export async function setu(path, { method = 'GET', body } = {}) {
  const token = await getAccessToken();
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-product-instance-id': process.env.SETU_PRODUCT_INSTANCE_ID,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: r.status, ok: r.ok, data };
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  return new Promise((resolve) => {
    let s = '';
    req.on('data', (c) => (s += c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(s || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}
