// Shared goal math: parse a deadline, and produce the live "reality-check" line
// connecting Target ↔ Monthly ↔ Deadline. Used by the onboarding goal step and
// the Declare/Edit goal modal.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

// Parse "2026-12" (picker), "12/2026", "Dec 2026", or "December 2026" → 1st of month.
export function parseMonthYear(str) {
  if (!str) return null;
  const s = String(str).trim().toLowerCase();
  const iso = s.match(/^(\d{4})-(\d{1,2})$/);
  if (iso) return new Date(+iso[1], Math.min(+iso[2] - 1, 11), 1);
  const numeric = s.match(/(\d{1,2})[/-](\d{4})/);
  if (numeric) return new Date(+numeric[2], Math.min(+numeric[1] - 1, 11), 1);
  const year = s.match(/(\d{4})/);
  if (!year) return null;
  const name = s.match(/([a-z]{3,})/);
  const mIdx = name ? MONTHS.findIndex((m) => name[1].startsWith(m)) : -1;
  return new Date(+year[1], mIdx >= 0 ? mIdx : 11, 1);
}

export const fmtMonth = (d) => d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
export const toMonthValue = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
const money = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// "Available to save this month" — for each linked category, how far UNDER your
// usual monthly pace you are right now (usual pace = the category's historical
// monthly average, used as the implicit budget since the app has no per-category
// budgets). This is a *suggestion* the user can move to the goal; nothing is
// credited automatically. Amounts already moved this month (logged as 'auto'
// contributions) are subtracted so the same surplus isn't offered twice.
// Returns { total, cats: [{ cat, amount }] } — rounded ₹.
export function availableToSave(goal, transactions = []) {
  const cats = goal?.linked || [];
  if (cats.length === 0) return { total: 0, cats: [] };

  const byCatMonth = {}; // category -> { 'YYYY-MM': spend }
  for (const t of transactions) {
    if (t.atm || !cats.includes(t.category)) continue;
    const m = String(t.date).slice(0, 7);
    (byCatMonth[t.category] ??= {})[m] = (byCatMonth[t.category][m] || 0) + t.amount;
  }

  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const catBreakdown = [];
  let total = 0;
  for (const c of cats) {
    const months = byCatMonth[c] || {};
    const completed = Object.entries(months).filter(([m]) => m !== curMonth);
    if (completed.length === 0) continue;
    const usual = completed.reduce((s, [, v]) => s + v, 0) / completed.length; // implicit budget
    const under = Math.max(usual - (months[curMonth] || 0), 0); // under your usual pace this month
    if (under > 0) {
      catBreakdown.push({ cat: c, amount: Math.round(under) });
      total += under;
    }
  }

  // Don't re-offer surplus already moved this month.
  const movedThisMonth = (goal.contributionLog || [])
    .filter((e) => e.type === 'auto' && String(e.date).slice(0, 7) === curMonth)
    .reduce((s, e) => s + (e.amount || 0), 0);

  return {
    total: Math.max(Math.round(total) - movedThisMonth, 0),
    cats: catBreakdown.sort((a, b) => b.amount - a.amount),
  };
}

// Deadline-driven status for an existing goal. The goal is defined by target +
// deadline; the monthly amount needed is DERIVED from what's left and the time
// remaining (so there's nothing for the user to over-specify or contradict).
// Returns { status, tone, text, requiredMonthly } where status is
// 'done' | 'on-track' | 'overdue' | 'planning'.
export function goalProjection(goal) {
  const target = goal.target || 0;
  const saved = goal.saved || 0;
  const remaining = Math.max(target - saved, 0);
  const deadlineDate = parseMonthYear(goal.deadline);
  const today = new Date();

  if (target > 0 && remaining <= 0) {
    return { status: 'done', tone: 'ok', requiredMonthly: 0, text: 'Goal reached — nicely done! 🎉' };
  }
  if (!deadlineDate) {
    return { status: 'planning', tone: 'neutral', requiredMonthly: 0, text: 'Add a deadline to get a monthly target.' };
  }

  const monthsLeft = monthsBetween(today, deadlineDate);
  if (monthsLeft < 0) {
    return {
      status: 'overdue',
      tone: 'warn',
      requiredMonthly: remaining,
      text: `Deadline passed — ${money(remaining)} still to go. Update the deadline?`,
    };
  }

  const required = Math.ceil(remaining / Math.max(monthsLeft, 1));
  return {
    status: 'on-track',
    tone: 'ok',
    requiredMonthly: required,
    text: `Save ${money(required)}/mo to hit ${fmtMonth(deadlineDate)}.`,
  };
}

// Reality-check for the create/edit form (deadline-driven): given a target and
// deadline, what monthly does it take? Returns { tone, text } or null.
export function goalInsight(target, deadline) {
  const t = parseFloat(target) || 0;
  if (t <= 0) return null;
  const deadlineDate = parseMonthYear(deadline);
  if (!deadlineDate) return null;

  const monthsLeft = monthsBetween(new Date(), deadlineDate);
  if (monthsLeft < 0) return { tone: 'warn', text: 'Pick a future deadline.' };

  const required = Math.ceil(t / Math.max(monthsLeft, 1));
  return { tone: 'ok', text: `Save ${money(required)}/mo to reach ${money(t)} by ${fmtMonth(deadlineDate)}.` };
}
