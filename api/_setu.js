// Shared Setu AA (FIU) client — runs ONLY on the server (Vercel function),
// so the client secret never reaches the browser.
// Sandbox base URL defaults to Setu's FIU sandbox; override with SETU_BASE_URL.
// Verified against the sandbox: v2 endpoints accept x-client-id/secret + x-product-instance-id.
const BASE = process.env.SETU_BASE_URL || 'https://fiu-sandbox.setu.co/v2';

export function envReady(res) {
  const missing = ['SETU_CLIENT_ID', 'SETU_CLIENT_SECRET', 'SETU_PRODUCT_INSTANCE_ID'].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    res.status(500).json({ error: `Missing Setu env: ${missing.join(', ')}` });
    return false;
  }
  return true;
}

export async function setu(path, { method = 'GET', body } = {}) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': process.env.SETU_CLIENT_ID,
      'x-client-secret': process.env.SETU_CLIENT_SECRET,
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
