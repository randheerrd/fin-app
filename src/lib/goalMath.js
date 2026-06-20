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

const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
const money = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// "Linked rupee" tracking: for each linked category, money spent BELOW the
// category's usual monthly pace (its historical average) is credited to the
// goal. Returns { total, thisMonth, cats: [{ cat, saved }] } — all rounded ₹.
export function linkedSavings(goal, transactions = []) {
  const cats = goal?.linked || [];
  if (cats.length === 0) return { total: 0, thisMonth: 0, cats: [] };

  // category -> { 'YYYY-MM': spend }
  const byCatMonth = {};
  for (const t of transactions) {
    if (t.atm || !cats.includes(t.category)) continue;
    const m = String(t.date).slice(0, 7);
    (byCatMonth[t.category] ??= {})[m] = (byCatMonth[t.category][m] || 0) + t.amount;
  }

  const now = new Date();
  const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const elapsed = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  let total = 0;
  let thisMonth = 0;
  const breakdown = [];

  for (const c of cats) {
    const months = byCatMonth[c] || {};
    const completed = Object.entries(months).filter(([m]) => m !== curMonth);
    if (completed.length === 0) continue;
    const baseline = completed.reduce((s, [, v]) => s + v, 0) / completed.length; // usual monthly spend

    let catSaved = 0;
    for (const [, v] of completed) catSaved += Math.max(baseline - v, 0);
    total += catSaved;
    if (catSaved > 0) breakdown.push({ cat: c, saved: Math.round(catSaved) });

    // Pace so far this month vs the prorated baseline.
    const prorated = baseline * (elapsed / daysInMonth);
    thisMonth += Math.max(prorated - (months[curMonth] || 0), 0);
  }

  return { total: Math.round(total), thisMonth: Math.round(thisMonth), cats: breakdown };
}

// Effective saved = base balance + linked-category auto-savings (capped at target).
export function effectiveSaved(goal, transactions = []) {
  const auto = linkedSavings(goal, transactions).total;
  return Math.min((goal.saved || 0) + auto, goal.target || 0);
}

// Forward-looking status for an existing goal (accounts for what's saved).
// Returns { status, tone, text, eta? } where status is
// 'done' | 'on-track' | 'at-risk' | 'planning'.
export function goalProjection(goal) {
  const target = goal.target || 0;
  const saved = goal.saved || 0;
  const monthly = goal.monthly || 0;
  const remaining = Math.max(target - saved, 0);
  const deadlineDate = parseMonthYear(goal.deadline);
  const today = new Date();

  if (target > 0 && remaining <= 0) {
    return { status: 'done', tone: 'ok', text: 'Goal reached — nicely done! 🎉' };
  }

  if (monthly > 0) {
    const monthsNeeded = Math.ceil(remaining / monthly);
    const eta = addMonths(today, monthsNeeded);
    if (deadlineDate) {
      const slack = monthsBetween(eta, deadlineDate); // +ve = ahead of deadline
      if (slack >= 0) {
        return {
          status: 'on-track',
          tone: 'ok',
          eta,
          text: `On pace to finish by ${fmtMonth(eta)}${
            slack > 0 ? ` — ${slack} month${slack > 1 ? 's' : ''} ahead of your deadline.` : ' — right on your deadline.'
          }`,
        };
      }
      const monthsToDeadline = Math.max(monthsBetween(today, deadlineDate), 0);
      const shortfall = Math.max(remaining - monthly * monthsToDeadline, 0);
      const required = monthsToDeadline > 0 ? Math.ceil(remaining / monthsToDeadline) : 0;
      return {
        status: 'at-risk',
        tone: 'warn',
        eta,
        text: `At ${money(monthly)}/mo you'll be ${money(shortfall)} short by ${fmtMonth(deadlineDate)}. Save ${
          required ? `${money(required)}/mo` : 'more'
        } to make it.`,
      };
    }
    return {
      status: 'on-track',
      tone: 'ok',
      eta,
      text: `On pace to finish by ${fmtMonth(eta)} (${monthsNeeded} month${monthsNeeded > 1 ? 's' : ''} to go).`,
    };
  }

  // No monthly contribution set yet.
  if (deadlineDate) {
    const monthsToDeadline = Math.max(monthsBetween(today, deadlineDate), 0);
    const required = monthsToDeadline > 0 ? Math.ceil(remaining / monthsToDeadline) : remaining;
    return { status: 'planning', tone: 'neutral', text: `Set aside ${money(required)}/mo to hit your deadline of ${fmtMonth(deadlineDate)}.` };
  }
  return { status: 'planning', tone: 'neutral', text: 'Add a monthly amount to see your timeline.' };
}

// Returns { tone: 'ok' | 'warn', text } or null when there's nothing to say yet.
export function goalInsight(target, monthly, deadline) {
  const t = parseFloat(target) || 0;
  const m = parseFloat(monthly) || 0;
  if (t <= 0) return null;

  const deadlineDate = parseMonthYear(deadline);
  const today = new Date();

  if (m > 0) {
    const projected = addMonths(today, Math.ceil(t / m));
    if (deadlineDate) {
      const slack = monthsBetween(projected, deadlineDate); // +ve = ahead of deadline
      if (slack >= 0) {
        return {
          tone: 'ok',
          text: `At ${money(m)}/mo you'll reach ${money(t)} by ${fmtMonth(projected)}${
            slack > 0 ? ` — ${slack} month${slack > 1 ? 's' : ''} ahead of your deadline.` : ' — right on your deadline.'
          }`,
        };
      }
      const monthsToDeadline = Math.max(monthsBetween(today, deadlineDate), 0);
      const required = monthsToDeadline > 0 ? Math.ceil(t / monthsToDeadline) : 0;
      return {
        tone: 'warn',
        text: `At ${money(m)}/mo you'll have ${money(m * monthsToDeadline)} by ${fmtMonth(deadlineDate)} — short of ${money(
          t
        )}. Save ${required ? `${money(required)}/mo` : 'more'} to make it.`,
      };
    }
    const months = Math.ceil(t / m);
    return {
      tone: 'ok',
      text: `At ${money(m)}/mo you'll reach ${money(t)} by ${fmtMonth(projected)} (${months} month${months > 1 ? 's' : ''}).`,
    };
  }

  if (deadlineDate) {
    const monthsToDeadline = Math.max(monthsBetween(today, deadlineDate), 0);
    const required = monthsToDeadline > 0 ? Math.ceil(t / monthsToDeadline) : t;
    return { tone: 'ok', text: `To reach ${money(t)} by ${fmtMonth(deadlineDate)}, save about ${money(required)}/mo.` };
  }

  return null;
}
