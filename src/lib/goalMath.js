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
