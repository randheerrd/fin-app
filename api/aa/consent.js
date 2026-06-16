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

  // NOTE: this body follows Setu's AA consent schema. Confirm field values against
  // your Setu product docs (consentTypes / fiTypes / Purpose code may differ).
  const body = {
    consentDuration: { unit: 'MONTH', value: '12' },
    consentMode: 'STORE',
    consentTypes: ['TRANSACTIONS', 'PROFILE', 'SUMMARY'],
    fetchType: 'PERIODIC',
    Frequency: { unit: 'DAY', value: 1 },
    DataFilter: [],
    fiTypes: ['DEPOSIT'],
    DataLife: { unit: 'MONTH', value: 12 },
    DataConsumer: { id: process.env.SETU_PRODUCT_INSTANCE_ID },
    // Virtual User Address — in sandbox use a test AA handle (e.g. <mobile>@onemoney)
    Customer: { id: `${mobile}@onemoney` },
    Purpose: {
      code: '101',
      text: 'Personal finance management',
      refUri: 'https://api.rebit.org.in/aa/purpose/101.xml',
      Category: { type: 'Personal Finance' },
    },
    FIDataRange: { from: sixMonthsAgo.toISOString(), to: now.toISOString() },
    ...(redirectUrl ? { redirectUrl } : {}),
  };

  const r = await setu('/consents', { method: 'POST', body });
  return res.status(r.status).json(r.data);
}
