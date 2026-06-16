// Client helper for the Setu AA proxy (/api/aa/*).
// Enabled when VITE_AA_API_URL is set (e.g. "/api/aa"); otherwise the app uses
// the demo mock. The secret lives only on the server function — never here.
const BASE = import.meta.env.VITE_AA_API_URL || '';
export const aaEnabled = Boolean(BASE);

async function post(path, body) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}
async function get(path) {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(`${path} failed: ${r.status}`);
  return r.json();
}

// 1. Create consent → returns { id, url, status }
export const createConsent = (mobile, redirectUrl) => post('/consent', { mobile, redirectUrl });
// 3. Poll consent status → { status: PENDING | ACTIVE | REJECTED }
export const getConsentStatus = (id) => get(`/consent-status?id=${encodeURIComponent(id)}`);
// 4. Create data session → { id, status }
export const createSession = (consentId) => post('/session', { consentId });
// 5. Fetch FI data → accounts + transactions
export const fetchFIData = (sessionId) => get(`/data?sessionId=${encodeURIComponent(sessionId)}`);

// Poll a consent until ACTIVE/REJECTED (used after the user returns from the AA page).
export async function waitForConsent(id, { tries = 30, intervalMs = 2000 } = {}) {
  for (let i = 0; i < tries; i++) {
    const c = await getConsentStatus(id);
    if (c.status === 'ACTIVE' || c.status === 'REJECTED') return c;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Consent approval timed out');
}
