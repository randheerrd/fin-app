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

// Poll a data session until the FI data is ready.
export async function waitForData(sessionId, { tries = 30, intervalMs = 2000 } = {}) {
  for (let i = 0; i < tries; i++) {
    const d = await fetchFIData(sessionId);
    if (d.status === 'COMPLETED' || d.status === 'PARTIAL' || d.Accounts || d.fips) return d;
    if (d.status === 'FAILED' || d.status === 'EXPIRED') throw new Error(`Data session ${d.status}`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Data fetch timed out');
}

// Defensive extractor: AA / Setu FI payloads nest the transaction array differently
// across FIPs, so we recursively find objects that look like bank transactions.
function findTransactions(node, out = []) {
  if (Array.isArray(node)) {
    node.forEach((n) => findTransactions(n, out));
  } else if (node && typeof node === 'object') {
    const hasAmount = node.amount != null;
    const looksTxn = node.narration != null || node.txnId != null || node.transactionTimestamp != null;
    if (hasAmount && looksTxn) out.push(node);
    Object.values(node).forEach((v) => findTransactions(v, out));
  }
  return out;
}

const KEYWORDS = [
  [/swiggy|zomato|domino|pizza|restaurant|food|cafe/i, 'food'],
  [/uber|ola|rapido|metro|fuel|petrol|transport/i, 'transport'],
  [/amazon|flipkart|myntra|shop/i, 'shopping'],
  [/netflix|spotify|prime|subscription/i, 'subscriptions'],
  [/blinkit|zepto|instamart|grocery|bigbasket|dmart/i, 'groceries'],
  [/pharmacy|apollo|hospital|medical|health/i, 'health'],
];
function categorize(narration = '') {
  for (const [re, cat] of KEYWORDS) if (re.test(narration)) return cat;
  return 'cash';
}

// Map raw FI data → FinApp transactions. Imports DEBIT entries as expenses.
export function mapTransactions(fiData) {
  return findTransactions(fiData)
    .filter((t) => String(t.type || 'DEBIT').toUpperCase() === 'DEBIT')
    .map((t) => ({
      id: crypto.randomUUID(),
      date: (t.transactionTimestamp || t.valueDate || new Date().toISOString()).slice(0, 10),
      merchant: (t.narration || 'Bank transaction').toString().slice(0, 60),
      category: categorize(t.narration),
      amount: Math.abs(Number(t.amount) || 0),
      source: 'bank',
      atm: false,
    }))
    .filter((t) => t.amount > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
