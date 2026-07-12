// Three-tier transaction categorization: learned overrides (fastest, free,
// what the user actually told us) → keyword rules (fast, free, obvious cases)
// → AI (slower, costs tokens, only for what the first two couldn't resolve).

const OVERRIDES_KEY = 'finapp:categoryOverrides';

// A "merchant key" collapses narration variants (UPI refs, txn IDs, case) down
// to something stable enough to match on next time: "UPI-SWIGGY-1234@ok" and
// "swiggy bangalore" should both key to "swiggy".
export function merchantKey(narration = '') {
  return String(narration)
    .toLowerCase()
    .replace(/\d+/g, ' ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 3)
    .join(' ')
    .trim();
}

function readOverrides() {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeOverrides(map) {
  try {
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// Called whenever the user manually recategorizes a transaction, so the same
// merchant gets the corrected category automatically next time.
export function learnCategory(narration, category) {
  const key = merchantKey(narration);
  if (!key) return;
  const overrides = readOverrides();
  overrides[key] = category;
  writeOverrides(overrides);
}

export function getLearnedCategory(narration) {
  const key = merchantKey(narration);
  return key ? readOverrides()[key] : undefined;
}

const KEYWORDS = [
  [/swiggy|zomato|domino|pizza|restaurant|food|cafe/i, 'food'],
  [/uber|ola|rapido|metro|fuel|petrol|transport/i, 'transport'],
  [/amazon|flipkart|myntra|shop/i, 'shopping'],
  [/netflix|spotify|prime|subscription/i, 'subscriptions'],
  [/blinkit|zepto|instamart|grocery|bigbasket|dmart/i, 'groceries'],
  [/pharmacy|apollo|hospital|medical|health/i, 'health'],
];

function keywordCategory(narration = '') {
  for (const [re, cat] of KEYWORDS) if (re.test(narration)) return cat;
  return null;
}

// Best-effort synchronous categorization: learned override, then keywords.
// Returns null if neither tier can resolve it — the caller decides the
// fallback (e.g. 'cash', or queue it for AI categorization).
export function categorizeSync(narration) {
  return getLearnedCategory(narration) ?? keywordCategory(narration) ?? null;
}
