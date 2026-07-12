// AI categorization fallback — for bank-imported transactions that neither
// learned overrides nor keyword rules could resolve (see lib/categorize.js).
// Calls the server-side /api/categorize endpoint (keeps ANTHROPIC_API_KEY
// server-only) and learns each result so the same merchant resolves instantly
// next time without another AI call.
import { learnCategory } from './categorize';

// Takes the transactions returned by mapTransactions(), resolves any flagged
// `aiPending`, and returns a new array with categories filled in (and the
// flag cleared). Transactions with no pending flag pass through unchanged.
// On any failure, pending transactions are left as 'cash' (already the
// fallback set by mapTransactions) with the flag cleared.
export async function resolveAiPendingCategories(transactions) {
  const pending = transactions.filter((t) => t.aiPending);
  if (pending.length === 0) return transactions;

  try {
    const r = await fetch('/api/categorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ narrations: pending.map((t) => t.merchant) }),
    });
    if (!r.ok) throw new Error(`categorize failed: ${r.status}`);
    const { categories } = await r.json();

    const byId = new Map(pending.map((t, i) => [t.id, categories[i] || 'cash']));
    return transactions.map((t) => {
      if (!t.aiPending) return t;
      const category = byId.get(t.id) || 'cash';
      learnCategory(t.merchant, category);
      const { aiPending, ...rest } = t;
      return { ...rest, category };
    });
  } catch (e) {
    console.error('AI categorization failed:', e);
    return transactions.map((t) => {
      if (!t.aiPending) return t;
      const { aiPending, ...rest } = t;
      return rest;
    });
  }
}
