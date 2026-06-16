import { setu, envReady, readJson } from '../_setu.js';

// STEP 1 — Create a consent request.
// POST /api/aa/consent  body: { mobile, redirectUrl }
// Returns Setu's consent object including `id` and the `url` to redirect the user to.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!envReady(res)) return;

  const { mobile, redirectUrl } = await readJson(req);
  if (!mobile) return res.status(400).json({ error: 'mobile is required' });

  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180);

  // Setu AA v2 consent schema (verified live against the sandbox).
  const body = {
    consentDuration: { unit: 'MONTH', value: '12' },
    consentMode: 'STORE',
    consentTypes: ['TRANSACTIONS', 'PROFILE', 'SUMMARY'],
    fetchType: 'PERIODIC',
    fiTypes: ['DEPOSIT'],
    dataRange: { from: sixMonthsAgo.toISOString(), to: now.toISOString() },
    // Virtual User Address. Sandbox test handle: <mobile>@onemoney
    vua: `${mobile}@onemoney`,
    ...(redirectUrl ? { redirectUrl } : {}),
  };

  const r = await setu('/consents', { method: 'POST', body });
  return res.status(r.status).json(r.data);
}
