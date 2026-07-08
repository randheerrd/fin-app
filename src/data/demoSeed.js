// Rich demo dataset for the test account (+91 9876543210 / OTP 111111).
// Generates ~6 months of realistic transactions so the dashboard/insights look full.

export const DEMO_PHONE = '9876543210'; // login / returning user — preloaded with 6 months of data
export const FRESH_DEMO_PHONE = '1234567890'; // signup / new user — always starts a fresh onboarding flow

// Demo accounts skip Firebase entirely (no reCAPTCHA / SMS / billing) — the OTP
// is validated locally against these fixed codes.
export const DEMO_CODES = {
  [DEMO_PHONE]: '111111',
  [FRESH_DEMO_PHONE]: '000000',
};
export const isDemoPhone = (p = '') => Object.prototype.hasOwnProperty.call(DEMO_CODES, p);
export const demoCode = (p = '') => DEMO_CODES[p];

// `weight` biases how often a merchant shows up (everyday spends are common,
// big-ticket shopping is rarer) so the generated history feels realistic.
const MERCHANTS = [
  // Food & dining (frequent)
  { name: 'Swiggy', category: 'food', min: 180, max: 720, weight: 9 },
  { name: 'Zomato', category: 'food', min: 160, max: 680, weight: 8 },
  { name: "Domino's", category: 'food', min: 250, max: 900, weight: 4 },
  { name: 'Starbucks', category: 'food', min: 280, max: 620, weight: 4 },
  { name: "McDonald's", category: 'food', min: 200, max: 650, weight: 3 },
  { name: 'KFC', category: 'food', min: 300, max: 850, weight: 2 },
  { name: 'Chaayos', category: 'food', min: 120, max: 480, weight: 4 },
  { name: 'Third Wave Coffee', category: 'food', min: 250, max: 550, weight: 3 },
  // Transport & fuel
  { name: 'Uber', category: 'transport', min: 90, max: 450, weight: 7 },
  { name: 'Ola', category: 'transport', min: 80, max: 400, weight: 5 },
  { name: 'Rapido', category: 'transport', min: 40, max: 160, weight: 6 },
  { name: 'Indian Oil', category: 'transport', min: 800, max: 2500, weight: 2 },
  { name: 'IRCTC', category: 'transport', min: 350, max: 2200, weight: 1 },
  // Groceries
  { name: 'Blinkit', category: 'groceries', min: 200, max: 1400, weight: 7 },
  { name: 'Zepto', category: 'groceries', min: 180, max: 1200, weight: 6 },
  { name: 'Swiggy Instamart', category: 'groceries', min: 250, max: 1500, weight: 5 },
  { name: 'BigBasket', category: 'groceries', min: 800, max: 3200, weight: 2 },
  { name: 'DMart', category: 'groceries', min: 900, max: 3800, weight: 2 },
  // Shopping (rarer, bigger)
  { name: 'Amazon', category: 'shopping', min: 400, max: 4500, weight: 4 },
  { name: 'Flipkart', category: 'shopping', min: 500, max: 4000, weight: 3 },
  { name: 'Myntra', category: 'shopping', min: 600, max: 3500, weight: 3 },
  { name: 'Ajio', category: 'shopping', min: 700, max: 3200, weight: 2 },
  { name: 'Nike', category: 'shopping', min: 1500, max: 8000, weight: 1 },
  { name: 'Decathlon', category: 'shopping', min: 600, max: 4500, weight: 1 },
  // Health
  { name: 'Apollo Pharmacy', category: 'health', min: 200, max: 1800, weight: 3 },
  { name: '1mg', category: 'health', min: 250, max: 1600, weight: 2 },
  { name: 'Pharmeasy', category: 'health', min: 200, max: 1400, weight: 2 },
  { name: 'Practo', category: 'health', min: 400, max: 1200, weight: 1 },
  // Entertainment
  { name: 'BookMyShow', category: 'entertainment', min: 300, max: 1200, weight: 3 },
  { name: 'PVR Cinemas', category: 'entertainment', min: 400, max: 1600, weight: 2 },
];

const RECURRING = [
  { name: 'Rent', category: 'rent', amount: 28000, day: 1 },
  { name: 'Car EMI', category: 'emi', amount: 12400, day: 5 },
  { name: 'SIP Index Fund', category: 'emi', amount: 10000, day: 3 },
  { name: 'Netflix', category: 'subscriptions', amount: 649, day: 12 },
  { name: 'Spotify', category: 'subscriptions', amount: 119, day: 8 },
  { name: 'Hotstar', category: 'subscriptions', amount: 299, day: 15 },
  { name: 'Cult.fit', category: 'health', amount: 2200, day: 2 },
  { name: 'Jio Recharge', category: 'utilities', amount: 399, day: 22 },
  { name: 'Airtel Postpaid', category: 'utilities', amount: 799, day: 14 },
  { name: 'Tata Power', category: 'utilities', amount: 1850, day: 18 },
];

// Flatten the weighted merchant list into a pool for cheap weighted picks.
const MERCHANT_POOL = MERCHANTS.flatMap((m) => Array(m.weight).fill(m));

export function generateDemoTransactions(months = 6) {
  const txns = [];
  const today = new Date();
  // Small LCG for deterministic-but-varied data.
  let seed = 987654321;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const iso = (d) => d.toISOString().slice(0, 10);

  // Daily discretionary spend — busier on weekends, weighted toward everyday spends.
  for (let d = 0; d < months * 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    // 1–3 txns on weekdays, 2–4 on weekends.
    const count = (weekend ? 2 : 1) + Math.floor(rand() * 3);
    for (let i = 0; i < count; i++) {
      const m = MERCHANT_POOL[Math.floor(rand() * MERCHANT_POOL.length)];
      txns.push({
        id: crypto.randomUUID(),
        date: iso(date),
        merchant: m.name,
        category: m.category,
        amount: Math.round(m.min + rand() * (m.max - m.min)),
        source: 'bank',
        atm: false,
      });
    }
  }

  // Monthly recurring
  for (let mo = 0; mo < months; mo++) {
    const base = new Date(today.getFullYear(), today.getMonth() - mo, 1);
    for (const r of RECURRING) {
      const date = new Date(base.getFullYear(), base.getMonth(), r.day);
      if (date <= today) {
        txns.push({
          id: crypto.randomUUID(),
          date: iso(date),
          merchant: r.name,
          category: r.category,
          amount: r.amount,
          source: 'bank',
          atm: false,
        });
      }
    }
  }

  return txns.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export const DEMO_BANKS = [
  { name: 'HDFC Bank', type: 'Salary account', mask: '··4521', synced: 'just now' },
  { name: 'ICICI Bank', type: 'Saving account', mask: '··2291', synced: 'just now' },
];

const ago = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

// Returning-user demo scenarios — injected on login for +91 9876543210 so every
// product moment is visible without setup:
//   • an untracked ATM withdrawal  → Dashboard "Untracked Cash · Split Amount"
//   • a duplicate (user-added, then re-imported by the bank) → Spend duplicate banner
export const DEMO_ATM_REMAINING = 4880; // ₹5,000 withdrawn, ₹120 already accounted for
export function demoScenarioTxns() {
  const dup = { merchant: 'Swiggy', category: 'food', amount: 540 };
  return [
    { id: crypto.randomUUID(), date: ago(2), merchant: 'ATM Withdrawal', category: 'cash', amount: 5000, source: 'bank', atm: true },
    // The same payment twice: you added it, then HDFC imported it.
    { id: crypto.randomUUID(), date: ago(1), merchant: dup.merchant, category: dup.category, amount: dup.amount, source: 'manual', atm: false },
    { id: crypto.randomUUID(), date: ago(1), merchant: dup.merchant, category: dup.category, amount: dup.amount, source: 'bank', atm: false, dup: true },
  ];
}

export const DEMO_GOALS = [
  {
    id: 'demo-1',
    name: 'Nepal Trip',
    target: 60000,
    saved: 18000,
    monthly: 6000,
    deadline: 'Nov 2026',
    // 'food' is shared with Emergency Fund → its surplus is split across both goals.
    linked: ['food', 'transport'],
    detected: false,
    // Auto-moves are dated to prior months so this month's surplus is still on offer.
    contributionLog: [
      { id: 'c1', type: 'manual', label: 'Manual save added', amount: 10000, date: ago(40) },
      { id: 'c2', type: 'auto', label: 'From Food surplus', amount: 5000, date: ago(45), categoryId: 'food' },
      { id: 'c3', type: 'auto', label: 'From Transport surplus', amount: 3000, date: ago(50), categoryId: 'transport' },
    ],
  },
  {
    id: 'demo-2',
    name: 'Emergency Fund',
    target: 200000,
    saved: 165000,
    monthly: 16000,
    deadline: 'Dec 2026',
    // Shares 'food' with Nepal Trip to demonstrate proportional surplus allocation.
    linked: ['groceries', 'food'],
    detected: false,
    contributionLog: [
      { id: 'c4', type: 'manual', label: 'Manual save added', amount: 150000, date: ago(90) },
      { id: 'c5', type: 'auto', label: 'From Groceries surplus', amount: 15000, date: ago(48), categoryId: 'groceries' },
    ],
  },
];
