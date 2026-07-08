import { useState } from 'react';
import { ChevronRight, Plus, Calendar, Target } from 'lucide-react';
import {
  getTotalSpent,
  getTopCategories,
  getCategoryTotals,
  getDayOfMonth,
  getDaysInMonth,
} from '../../lib/utils';
import { CATEGORIES, CHART_PALETTE, getCategoryChip } from '../../data/categories';
import { goalProjection } from '../../lib/goalMath';
import MerchantLogo from '../MerchantLogo';
import CategoryIcon from '../CategoryIcon';
import Dropdown from '../Dropdown';

// Keep transactions within the selected period (mirrors the Spend tab).
const isoOf = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
const weekStart = (dt) => {
  const d = new Date(dt);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // Monday
  d.setHours(0, 0, 0, 0);
  return d;
};
const inPeriod = (dateStr, period) => {
  if (period === 'all') return true;
  const now = new Date();
  if (period === 'today') return dateStr === isoOf(now);
  if (period === 'week') return dateStr >= isoOf(weekStart(now));
  const d = new Date(dateStr);
  if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  if (period === 'lastmonth') {
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  }
  if (period === '3m') {
    const cut = new Date(now);
    cut.setMonth(cut.getMonth() - 3);
    return d >= cut;
  }
  return true;
};
const PERIOD_LABEL = { today: 'Today', week: 'This Week', month: 'This Month', lastmonth: 'Last Month', '3m': 'Last 3 Months', all: 'All Time' };

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

function formatTxnDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
}

/* ---------- Donut (interactive) ---------- */
function Donut({ segments, total, active, onHover, onSelect }) {
  const r = 60;
  const stroke = 22;
  const C = 2 * Math.PI * r;
  const denom = total || 1; // avoid divide-by-zero; display still uses the real total
  const arcs = segments.map((s, i) => {
    const len = (s.value / denom) * C;
    const start = segments.slice(0, i).reduce((a, x) => a + (x.value / denom) * C, 0);
    return { ...s, len, start };
  });
  const act = active != null ? segments[active] : null;
  return (
    <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90" onMouseLeave={() => onHover?.(null)}>
        {arcs.map((s, i) => (
          <circle
            key={i}
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={-s.start}
            opacity={active == null || active === i ? 1 : 0.3}
            onMouseEnter={() => onHover?.(i)}
            onClick={() => onSelect?.(s)}
            style={{ cursor: 'pointer', transition: 'opacity .15s' }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-6">
        {act ? (
          <>
            <span className="text-xs text-[#6b7280] truncate max-w-[120px]">{act.label}</span>
            <span className="text-lg font-bold text-[#111827]">{fmt(act.value)}</span>
          </>
        ) : (
          <>
            <span className="text-xl font-bold text-[#111827]">{fmt(total)}</span>
            <span className="text-xs text-[#9ca3af]">spent</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Weekly bar chart ---------- */
function WeeklyChart({ transactions }) {
  const [hover, setHover] = useState(null);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Aggregate spend by weekday across the (period-scoped) transactions, so the
  // chart responds to the dashboard filter instead of only the current week.
  const totals = labels.map(() => 0);
  for (const t of transactions) {
    if (t.atm) continue;
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const dow = d.getDay(); // 0 = Sun … 6 = Sat
    totals[dow === 0 ? 6 : dow - 1] += t.amount;
  }
  const max = Math.max(...totals, 1);
  const weekdaySum = totals.slice(0, 5).reduce((a, b) => a + b, 0);
  const weekendSum = totals[5] + totals[6];
  const grand = weekdaySum + weekendSum || 1;
  const weekendPct = Math.round((weekendSum / grand) * 100);
  const weekdayPct = 100 - weekendPct;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-6 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F08A5D]" />
          <span className="text-xs text-[#6b7280]">Weekends</span>
          <span className="text-xs font-semibold text-[#111827] ml-auto">{weekendPct}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0E3F2E]" />
          <span className="text-xs text-[#6b7280]">Weekdays</span>
          <span className="text-xs font-semibold text-[#111827] ml-auto">{weekdayPct}%</span>
        </div>
      </div>
      {/* Bars fill the available height (the card stretches to match "Where It Went") */}
      <div className="flex items-stretch justify-between gap-3 flex-1 min-h-[176px]">
        {labels.map((day, i) => {
          const isWeekend = i >= 5;
          const barPct = totals[i] > 0 ? Math.max((totals[i] / max) * 88, 5) : 1.5;
          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center cursor-default"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div className="flex-1 w-full flex flex-col justify-end items-center gap-1.5 min-h-0">
                <span className={`text-[11px] font-medium ${hover === i ? 'text-[#111827]' : 'text-[#9ca3af]'}`}>
                  {totals[i] > 0 ? fmt(totals[i]) : ''}
                </span>
                <div
                  className={`w-full rounded-md transition-opacity ${isWeekend ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
                  style={{ height: `${barPct}%`, opacity: hover == null || hover === i ? 1 : 0.4 }}
                />
              </div>
              <span className={`text-xs mt-2 ${hover === i ? 'text-[#111827] font-medium' : 'text-[#9ca3af]'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 bg-[#F0F7F3] rounded-lg px-4 py-3">
        <p className="text-xs text-[#374151]">
          <span className="font-semibold">{weekendPct}%</span> of your spending happens on weekends.
          Weekdays, you barely touch the budget.
        </p>
      </div>
    </div>
  );
}

/* ---------- Stat card ---------- */
function StatCard({ label, value, sub, subColor = 'text-[#9ca3af]', icon }) {
  return (
    <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-5">
      <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-[#111827] leading-none">{value}</p>
      {sub && (
        <p className={`text-xs mt-2 flex items-center gap-1 ${subColor}`}>
          {icon}
          {sub}
        </p>
      )}
    </div>
  );
}

export default function Dashboard({
  budget,
  transactions,
  goals,
  atmRemaining,
  manualMode,
  activeFilter,
  onAddExpense,
  onAtmSplit,
  onViewAll,
  onSetupBudget,
  onAddGoal,
  onCategorySelect,
  leftoverDoneMonth,
  onMoveLeftover,
  onDismissLeftover,
}) {
  const [activeSeg, setActiveSeg] = useState(null);
  const [period, setPeriod] = useState('month');
  const budgetSet = budget > 0;
  const periodTxns = transactions.filter((t) => inPeriod(t.date, period));
  // ATM remainder only counts toward the current month.
  const totalSpent = getTotalSpent(periodTxns, period === 'month' ? atmRemaining : 0);
  const topCategories = getTopCategories(periodTxns, 3);
  const dayOfMonth = getDayOfMonth();
  const daysInMonth = getDaysInMonth();
  const daysLeft = Math.max(daysInMonth - dayOfMonth, 0);
  const budgetUsed = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;
  const budgetLeft = Math.max(budget - totalSpent, 0);

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });

  const topCat = topCategories[0];

  // Month-to-date vs the same point last month (same day-of-month), non-ATM spend.
  const sumSpend = (startD, endD) =>
    transactions
      .filter((t) => !t.atm)
      .reduce((a, t) => {
        const d = new Date(t.date);
        return d >= startD && d <= endD ? a + t.amount : a;
      }, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMTD = sumSpend(monthStart, today);
  const prevMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  const prevSamePoint = new Date(today.getFullYear(), today.getMonth() - 1, Math.min(today.getDate(), prevMonthDays));
  const prevMTD = sumSpend(prevMonthStart, prevSamePoint);
  const momDiff = thisMTD - prevMTD;
  const prevMonthName = prevMonthStart.toLocaleDateString('en-IN', { month: 'long' });

  // Daily average across the selected period (month → days elapsed; else data span).
  const periodMs = periodTxns.map((t) => +new Date(t.date)).filter(Number.isFinite);
  const spanDays = periodMs.length
    ? Math.max(Math.round((Math.max(...periodMs) - Math.min(...periodMs)) / 86400000) + 1, 1)
    : 1;
  const avgDays = period === 'month' ? Math.max(dayOfMonth, 1) : spanDays;
  const dailyAvg = totalSpent / avgDays;

  // Headline caption: the same total spelled out — month-over-month trend (month
  // view) + biggest category — so the big number isn't repeated as a stat card below.
  const caption =
    period === 'month'
      ? `spent so far this month${
          prevMTD > 0
            ? `, ${fmt(Math.abs(momDiff))} ${momDiff < 0 ? 'less' : 'more'} than this time in ${prevMonthName}`
            : ''
        }`
      : `spent · ${PERIOD_LABEL[period]}`;

  // Goals summary (shown to everyone — friendly empty state when none).
  const totalSaved = goals.reduce((a, g) => a + (g.saved || 0), 0);
  const totalTarget = goals.reduce((a, g) => a + (g.target || 0), 0);
  const goalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // Donut data: top 5 categories + Others
  const catTotals = getCategoryTotals(periodTxns);
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const donutTop = sorted.slice(0, 5);
  const othersValue = sorted.slice(5).reduce((a, [, v]) => a + v, 0);
  const segments = [
    // 5th slot in the palette is amber — reserve amber for "Others", so give the
    // 5th category another shade of green instead.
    ...donutTop.map(([id, value], i) => ({ id, label: catName(id), value, color: i === 4 ? '#5FA777' : CHART_PALETTE[i] })),
    ...(othersValue > 0 ? [{ id: 'others', label: 'Others', value: othersValue, color: '#F59E0B' }] : []),
  ];
  const donutTotal = segments.reduce((a, s) => a + s.value, 0);

  // The categories rolled into "Others" = everything beyond the top 5 shown.
  const otherCatIds = sorted.slice(5).map(([id]) => id);
  // Open Spend filtered to the clicked category (or all "Others" categories).
  const selectSegment = (s) => onCategorySelect?.(s.id === 'others' ? otherCatIds : [s.id], period);

  // Budget pacing for the "This Month" card: current daily pace and where that
  // lands by month-end if it holds.
  const dailyPace = Math.round(totalSpent / Math.max(dayOfMonth, 1));
  const projectedMonthEnd = Math.round(dailyPace * daysInMonth);

  // Month-end leftover: did LAST month finish under budget? If so, offer to move
  // the unspent amount into a goal (re-appears each new month until handled).
  const lmDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lmKey = `${lmDate.getFullYear()}-${String(lmDate.getMonth() + 1).padStart(2, '0')}`;
  const lmName = lmDate.toLocaleDateString('en-IN', { month: 'long' });
  const lastMonthSpend = transactions
    .filter((t) => !t.atm && String(t.date).slice(0, 7) === lmKey)
    .reduce((s, t) => s + t.amount, 0);
  const leftover = budgetSet ? Math.max(budget - lastMonthSpend, 0) : 0;
  const leftoverGoals = goals.filter((g) => Math.max((g.target || 0) - (g.saved || 0), 0) > 0);
  const showLeftover = leftover > 0 && leftoverGoals.length > 0 && leftoverDoneMonth !== lmKey;

  // Over-budget helpers for the pacing card: how much over, the daily allowance to
  // finish on budget, and which category is most above its usual pace ("the driver").
  const overNow = budgetSet ? Math.max(totalSpent - budget, 0) : 0;
  const allowance = daysLeft > 0 ? Math.round(budgetLeft / daysLeft) : budgetLeft;
  const curKey = isoOf(today).slice(0, 7);
  const catMonth = {};
  transactions.forEach((t) => {
    if (t.atm) return;
    const mk = String(t.date).slice(0, 7);
    (catMonth[t.category] ??= {})[mk] = (catMonth[t.category][mk] || 0) + t.amount;
  });
  let driver = null; // { cat, now, usual, excess }
  Object.entries(catMonth).forEach(([cat, mm]) => {
    const completed = Object.entries(mm).filter(([k]) => k !== curKey);
    if (!completed.length) return;
    const usual = completed.reduce((s, [, v]) => s + v, 0) / completed.length;
    const excess = (mm[curKey] || 0) - usual;
    if (excess > (driver?.excess ?? 0)) driver = { cat, now: mm[curKey] || 0, usual, excess };
  });

  const filteredTransactions = activeFilter
    ? periodTxns.filter((t) => t.category === activeFilter)
    : periodTxns;

  return (
    <div className="min-h-full bg-white px-8 py-7">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-[#6b7280] mb-1">{dateLabel}</p>
          <p className="text-[40px] font-bold text-[#111827] leading-none tracking-tight">{fmt(totalSpent)}</p>
          <p className="text-sm text-[#6b7280] mt-2">{caption}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            label=""
            align="right"
            leading={<Calendar size={15} className="text-[#9ca3af]" />}
            value={PERIOD_LABEL[period]}
            options={[
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
              { label: 'Last Month', value: 'lastmonth' },
              { label: 'Last 3 Months', value: '3m' },
              { label: 'All Time', value: 'all' },
            ]}
            onChange={setPeriod}
          />
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            <Plus size={16} />
            Add Expense
          </button>
        </div>
      </div>

      {/* Untracked cash */}
      {atmRemaining > 0 && !manualMode && (
        <div className="flex items-center justify-between gap-4 bg-[#FBF7EF] border border-[#F3EAD8] rounded-xl px-5 py-4 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-[#111827]">{fmt(atmRemaining)}</p>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Untracked Cash</p>
              <p className="text-xs text-[#9ca3af]">From your ATM withdrawal on 8 Jun.</p>
            </div>
          </div>
          <button
            onClick={onAtmSplit}
            className="px-4 py-2 bg-white border border-[#e5e7eb] text-sm font-medium text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Split Amount
          </button>
        </div>
      )}

      {/* Month-end leftover → move it to a goal */}
      {showLeftover && (
        <div className="flex items-center justify-between gap-4 bg-[#F0F7F3] border border-[#0E3F2E]/15 rounded-xl px-5 py-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-[#111827]">
              You finished {lmName} {fmt(leftover)} under budget
            </p>
            <p className="text-xs text-[#9ca3af] mt-0.5">Move it to a goal so it doesn't quietly get spent.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {leftoverGoals.slice(0, 2).map((g) => (
              <button
                key={g.id}
                onClick={() =>
                  onMoveLeftover?.(g.id, leftover, lmKey, {
                    id: crypto.randomUUID(),
                    type: 'auto',
                    label: `From ${lmName} leftover budget`,
                    amount: leftover,
                    date: new Date().toISOString().slice(0, 10),
                  })
                }
                className="px-4 py-2 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
              >
                {g.name}
              </button>
            ))}
            <button
              onClick={() => onDismissLeftover?.(lmKey)}
              className="px-3 py-2 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Prompt to set income/budget when they weren't entered during onboarding */}
      {!budgetSet && (
        <div className="flex items-center justify-between gap-4 bg-[#F0F7F3] border border-[#0E3F2E]/15 rounded-xl px-5 py-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-[#111827]">Add your monthly income &amp; budget</p>
            <p className="text-xs text-[#9ca3af]">Set them once to unlock budget tracking and clearer insights.</p>
          </div>
          <button
            onClick={onSetupBudget}
            className="px-4 py-2 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors flex-shrink-0"
          >
            Add now
          </button>
        </div>
      )}

      {/* Stat cards — the total itself is the headline above, so it's not repeated here */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Budget Left"
          value={budgetSet ? budgetLeft.toLocaleString('en-IN') : '—'}
          sub={budgetSet ? `${daysLeft} days to go` : 'Add a budget'}
          subColor={budgetSet ? 'text-red-500' : 'text-[#9ca3af]'}
        />
        <StatCard
          label="Daily Average"
          value={Math.round(dailyAvg).toLocaleString('en-IN')}
          sub={`over ${avgDays} day${avgDays === 1 ? '' : 's'}`}
        />
        <StatCard
          label="Top Categories"
          value={topCat ? catName(topCat.category) : '—'}
          sub={topCat ? `${fmt(topCat.amount)} this period` : ''}
        />
        <StatCard
          label="Goals"
          value={goals.length > 0 ? goals.length : '—'}
          sub={goals.length > 0 ? `${goalProgress}% funded` : 'No goals yet'}
          subColor={goals.length > 0 ? 'text-[#15803D]' : 'text-[#9ca3af]'}
        />
      </div>

      {/* This Month + Goals */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* This month */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">This Month</p>
          {budgetSet ? (
            <div className="bg-[#f9fafb] rounded-xl p-4 mb-5">
              <p className="text-lg font-bold text-[#111827] mb-3">
                {fmt(totalSpent)} <span className="text-[#9ca3af] font-medium text-base">/ {fmt(budget)}</span>
              </p>
              <div className="w-full bg-[#e5e7eb] rounded-full h-2 overflow-hidden mb-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(budgetUsed, 100)}%`,
                    backgroundColor: budgetUsed > 100 ? '#DC2626' : budgetUsed >= 80 ? '#D97706' : '#0E3F2E',
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={budgetUsed > 100 ? 'text-red-500 font-medium' : 'text-[#9ca3af]'}>
                  {budgetUsed > 100 ? `${budgetUsed - 100}% over budget` : `${budgetUsed}% used`}
                </span>
                <span className="text-[#9ca3af]">{daysLeft} days left</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#f9fafb] rounded-xl p-4 mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-[#111827]">{fmt(totalSpent)} spent</p>
                <p className="text-xs text-[#9ca3af] mt-0.5">No budget set yet.</p>
              </div>
              <button
                onClick={onSetupBudget}
                className="text-sm font-medium text-[#0E3F2E] hover:underline flex-shrink-0"
              >
                Set budget
              </button>
            </div>
          )}

          {/* Budget pacing — the category breakdown lives in "Where It Went" below */}
          {!budgetSet ? (
            <p className="text-sm text-[#6b7280]">
              Set a budget to see your spending pace and a month-end projection.
            </p>
          ) : period === 'month' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#374151]">Spending pace</span>
                <span className="text-sm font-semibold text-[#111827]">{fmt(dailyPace)}/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#374151]">{overNow > 0 ? 'Over budget' : 'Daily allowance'}</span>
                <span className={`text-sm font-semibold ${overNow > 0 ? 'text-red-500' : 'text-[#111827]'}`}>
                  {overNow > 0 ? `${fmt(overNow)} over` : `${fmt(allowance)}/day`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#374151]">Projected month-end</span>
                <span className={`text-sm font-semibold ${projectedMonthEnd > budget ? 'text-red-500' : 'text-[#15803D]'}`}>
                  {fmt(projectedMonthEnd)}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af]">
                {overNow > 0
                  ? `You've used your budget — every rupee now adds to the overage.`
                  : `Keep to ${fmt(allowance)}/day for the ${daysLeft} day${daysLeft === 1 ? '' : 's'} left to finish on budget.`}
              </p>
              {overNow > 0 && driver && (
                <p className="text-xs rounded-lg bg-[#FEF6F1] border border-[#F08A5D]/25 px-3 py-2 text-[#B45309]">
                  Biggest jump: <span className="font-semibold">{catName(driver.cat)}</span> — {fmt(driver.now)} vs ~
                  {fmt(driver.usual)} usual.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#6b7280]">
              {fmt(totalSpent)} spent <span className="text-[#9ca3af]">· {PERIOD_LABEL[period]}</span>. Switch to
              This Month for budget pacing.
            </p>
          )}
        </div>

        {/* Goals */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">Goals</p>
          {goals.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F0F7F3] to-[#E3F0E9] ring-1 ring-[#0E3F2E]/10 flex items-center justify-center mb-3">
                <Target size={22} strokeWidth={1.75} className="text-[#0E3F2E]" />
              </div>
              <p className="text-sm font-semibold text-[#111827] mb-1">No goals yet</p>
              <p className="text-xs text-[#9ca3af] mb-4 max-w-[220px]">
                Set a target and watch every linked rupee work toward it.
              </p>
              <button
                onClick={onAddGoal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
              >
                <Plus size={15} />
                Set a goal
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {goals.slice(0, 3).map((goal) => {
                const saved = goal.saved || 0;
                const pct = goal.target > 0 ? Math.min(Math.round((saved / goal.target) * 100), 100) : 0;
                const proj = goalProjection(goal);
                const atRisk = proj.status === 'overdue';
                const badge =
                  proj.status === 'done'
                    ? { text: 'Reached', cls: 'bg-green-50 text-green-700' }
                    : proj.status === 'overdue'
                      ? { text: 'Overdue', cls: 'bg-orange-50 text-orange-600' }
                      : proj.status === 'planning'
                        ? { text: 'No deadline', cls: 'bg-[#f3f4f6] text-[#6b7280]' }
                        : { text: 'On Track', cls: 'bg-green-50 text-green-700' };
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[#111827]">{goal.name}</p>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${atRisk ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#9ca3af]">
                      {fmt(saved)} saved of {fmt(goal.target)}
                      {proj.requiredMonthly ? ` · ${fmt(proj.requiredMonthly)}/mo to stay on track` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Where it went + Weekly spend */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">Where It Went</p>
          {segments.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <p className="text-sm font-medium text-[#111827]">No spending yet</p>
              <p className="text-xs text-[#9ca3af] mt-1">Your category breakdown will appear here.</p>
            </div>
          ) : (
          <div className="flex items-start gap-6">
            <Donut
              segments={segments}
              total={donutTotal}
              active={activeSeg}
              onHover={setActiveSeg}
              onSelect={selectSegment}
            />
            <div className="flex-1 space-y-0.5">
              {segments.map((s, i) => (
                <button
                  key={s.id}
                  onMouseEnter={() => setActiveSeg(i)}
                  onMouseLeave={() => setActiveSeg(null)}
                  onClick={() => selectSegment(s)}
                  className={`w-full flex items-center justify-between py-2 px-2 rounded-lg transition-colors ${
                    activeSeg === i ? 'bg-[#f9fafb]' : 'hover:bg-[#f9fafb]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-[#374151] truncate">{s.label}</span>
                  </span>
                  <span className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-semibold text-[#111827]">{fmt(s.value)}</span>
                    <span className="text-xs text-[#9ca3af] w-8 text-right">
                      {donutTotal ? Math.round((s.value / donutTotal) * 100) : 0}%
                    </span>
                    <ChevronRight size={15} className="text-[#d1d5db]" />
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>

        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6 flex flex-col">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">Weekly Spend</p>
          <WeeklyChart transactions={periodTxns} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium">Recent Transactions</p>
          <button onClick={() => onViewAll?.(period)} className="text-sm font-medium text-[#0E3F2E] hover:underline">
            See All
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 text-[11px] uppercase tracking-wide text-[#9ca3af] font-medium px-2 pb-2 border-b border-[#f3f4f6]">
          <span>Transaction</span>
          <span className="text-right pr-4">Categories</span>
          <span className="text-right">Amount</span>
        </div>
        <div className="divide-y divide-[#f6f7f8]">
          {filteredTransactions.slice(0, 5).map((txn) => {
            const chip = getCategoryChip(txn.category);
            return (
              <div key={txn.id} className="grid grid-cols-[1fr_auto_auto] gap-x-8 items-center px-2 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <MerchantLogo name={txn.merchant} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{txn.merchant}</p>
                    <p className="text-xs text-[#9ca3af]">{formatTxnDate(txn.date)}</p>
                  </div>
                </div>
                <div className="text-right pr-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                    style={{ backgroundColor: chip.bg, color: chip.text }}
                  >
                    <CategoryIcon id={txn.category} size={13} />
                    {catName(txn.category)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#111827] text-right whitespace-nowrap">
                  −₹{txn.amount.toLocaleString('en-IN')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
