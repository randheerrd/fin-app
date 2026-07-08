import { readJson } from '../_setu.js';

// Setu's notification callback for consent/session status changes — configure
// this endpoint's URL against your Product Instance in the Setu dashboard.
// Complements the browser redirect: this fires server-to-server so status
// updates aren't lost if the user closes the tab before returning.
// Currently just acknowledges receipt; wire in persistence here if you need
// server-side state beyond the client's polling (waitForConsent/waitForData).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const event = await readJson(req);
  console.log('Setu AA notification:', JSON.stringify(event));

  return res.status(200).json({ received: true });
}
