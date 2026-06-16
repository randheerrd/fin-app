// Rich demo dataset for the test account (+91 9876543210 / OTP 111111).
// Generates ~6 months of realistic transactions so the dashboard/insights look full.

export const DEMO_PHONE = '9876543210'; // login / returning user — preloaded with 6 months of data
export const FRESH_DEMO_PHONE = '1234567890'; // signup / new user — always starts a fresh onboarding flow

const MERCHANTS = [
  { name: 'Swiggy', category: 'food', min: 180, max: 720 },
  { name: 'Zomato', category: 'food', min: 160, max: 680 },
  { name: "Domino's", category: 'food', min: 250, max: 900 },
  { name: 'Starbucks', category: 'food', min: 300, max: 600 },
  { name: 'Uber', category: 'transport', min: 90, max: 450 },
  { name: 'Ola', category: 'transport', min: 80, max: 400 },
  { name: 'Rapido', category: 'transport', min: 40, max: 160 },
  { name: 'Indian Oil', category: 'transport', min: 800, max: 2500 },
  { name: 'Amazon', category: 'shopping', min: 400, max: 4500 },
  { name: 'Myntra', category: 'shopping', min: 600, max: 3500 },
  { name: 'Flipkart', category: 'shopping', min: 500, max: 4000 },
  { name: 'Blinkit', category: 'groceries', min: 200, max: 1400 },
  { name: 'Zepto', category: 'groceries', min: 180, max: 1200 },
  { name: 'BigBasket', category: 'groceries', min: 800, max: 3200 },
  { name: 'Swiggy Instamart', category: 'groceries', min: 250, max: 1500 },
  { name: 'Apollo Pharmacy', category: 'health', min: 200, max: 1800 },
  { name: 'Practo', category: 'health', min: 400, max: 1200 },
  { name: 'BookMyShow', category: 'entertainment', min: 300, max: 1200 },
  { name: 'PVR Cinemas', category: 'entertainment', min: 400, max: 1600 },
];

const RECURRING = [
  { name: 'Rent', category: 'rent', amount: 25000, day: 1 },
  { name: 'Car EMI', category: 'emi', amount: 12400, day: 5 },
  { name: 'SIP Index fund', category: 'emi', amount: 10000, day: 3 },
  { name: 'Netflix', category: 'subscriptions', amount: 649, day: 12 },
  { name: 'Spotify', category: 'subscriptions', amount: 119, day: 8 },
  { name: 'Gym', category: 'health', amount: 2000, day: 1 },
  { name: 'Electricity Bill', category: 'utilities', amount: 1850, day: 18 },
];

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

  // Daily discretionary spend
  for (let d = 0; d < months * 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const count = Math.floor(rand() * 3); // 0–2 txns/day
    for (let i = 0; i < count; i++) {
      const m = MERCHANTS[Math.floor(rand() * MERCHANTS.length)];
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

export const DEMO_GOALS = [
  { id: 'demo-1', name: 'Nepal Trip', target: 60000, saved: 18000, monthly: 6000, deadline: 'Nov 2026', linked: ['food', 'transport'], detected: false },
  { id: 'demo-2', name: 'Emergency Fund', target: 200000, saved: 165000, monthly: 16000, deadline: 'Dec 2026', linked: ['groceries'], detected: false },
];
