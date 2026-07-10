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

  // Setu AA v2 consent schema — matches Setu's published FIU v2 /consents reference.
  // `purpose` is mandated by the RBI/ReBIT AA spec (101 = wealth management, the
  // standard default); `frequency` is required alongside PERIODIC fetchType.
  const body = {
    consentDuration: { unit: 'MONTH', value: 12 },
    consentMode: 'STORE',
    consentTypes: ['PROFILE', 'SUMMARY', 'TRANSACTIONS'],
    fetchType: 'PERIODIC',
    frequency: { unit: 'MONTH', value: 1 },
    fiTypes: ['DEPOSIT'],
    dataRange: { from: sixMonthsAgo.toISOString(), to: now.toISOString() },
    purpose: {
      code: '101',
      text: 'Wealth management service',
      category: { type: 'Personal Finance' },
      refUri: 'https://api.rebit.org.in/aa/purpose/101.xml',
    },
    // Virtual User Address. <mobile>@onemoney routes to the OneMoney AA partner.
    vua: `${mobile}@onemoney`,
    // Forces account discovery straight to the "Setu FIP 2" mock bank (static OTP
    // 123456) so local/QA testing doesn't need a real phone number or OneMoney's
    // test-number whitelisting (1-2 business day turnaround).
    context: [{ key: 'fipId', value: 'setu-fip-2' }],
    ...(redirectUrl ? { redirectUrl } : {}),
  };

  const r = await setu('/consents', { method: 'POST', body });
  return res.status(r.status).json(r.data);
}
