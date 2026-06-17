import { useState } from 'react';
import { ChevronRight, Plus, Calendar } from 'lucide-react';
import {
  getTotalSpent,
  getTopCategories,
  getCategoryTotals,
  getDayOfMonth,
  getDaysInMonth,
} from '../../lib/utils';
import { CATEGORIES, CHART_PALETTE, getCategoryChip } from '../../data/categories';
import MerchantLogo from '../MerchantLogo';
import CategoryIcon from '../CategoryIcon';
import Dropdown from '../Dropdown';

// Keep transactions within the selected period (mirrors the Spend tab).
const inPeriod = (dateStr, period) => {
  if (period === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
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
const PERIOD_LABEL = { month: 'This Month', lastmonth: 'Last Month', '3m': 'Last 3 Months', all: 'All Time' };

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

function formatTxnDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getDate()} ${d.toLocaleString('en-IN', { month: 'short' })}`;
}

/* ---------- Donut (interactive) ---------- */
function Donut({ segments, total, active, onHover, onSelect }) {
  const r = 70;
  const stroke = 26;
  const C = 2 * Math.PI * r;
  const arcs = segments.map((s, i) => {
    const len = (s.value / total) * C;
    const start = segments.slice(0, i).reduce((a, x) => a + (x.value / total) * C, 0);
    return { ...s, len, start };
  });
  const act = active != null ? segments[active] : null;
  return (
    <div className="relative" style={{ width: 180, height: 180 }}>
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90" onMouseLeave={() => onHover?.(null)}>
        {arcs.map((s, i) => (
          <circle
            key={i}
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={active === i ? stroke + 6 : stroke}
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={-s.start}
            opacity={active == null || active === i ? 1 : 0.35}
            onMouseEnter={() => onHover?.(i)}
            onClick={() => onSelect?.(s)}
            style={{ cursor: 'pointer', transition: 'opacity .15s, stroke-width .15s' }}
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
  const now = new Date();
  const totals = labels.map((_, i) => {
    const d = new Date(now);
    const diff = now.getDay() === 0 ? i - 6 : i - (now.getDay() - 1);
    d.setDate(now.getDate() + diff);
    const dateStr = d.toISOString().split('T')[0];
    return transactions.filter((t) => t.date === dateStr && !t.atm).reduce((s, t) => s + t.amount, 0);
  });
  const max = Math.max(...totals, 1);
  const weekdaySum = totals.slice(0, 5).reduce((a, b) => a + b, 0);
  const weekendSum = totals[5] + totals[6];
  const grand = weekdaySum + weekendSum || 1;
  const weekendPct = Math.round((weekendSum / grand) * 100);
  const weekdayPct = 100 - weekendPct;

  return (
    <div>
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
      <div className="flex items-end justify-between gap-3 h-44">
        {labels.map((day, i) => {
          const isWeekend = i >= 5;
          const h = Math.max((totals[i] / max) * 130, totals[i] > 0 ? 8 : 4);
          return (
            <div
              key={day}
              className="flex-1 flex flex-col items-center gap-2 cursor-default"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <span className={`text-[11px] font-medium ${hover === i ? 'text-[#111827]' : 'text-[#9ca3af]'}`}>
                {totals[i] > 0 ? fmt(totals[i]) : ''}
              </span>
              <div
                className={`w-full rounded-md transition-opacity ${isWeekend ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
                style={{ height: `${h}px`, opacity: hover == null || hover === i ? 1 : 0.4 }}
              />
              <span className={`text-xs ${hover === i ? 'text-[#111827] font-medium' : 'text-[#9ca3af]'}`}>{day}</span>
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

  // Week-over-week delta (rough): this week vs prior week
  const dayTotal = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    const s = d.toISOString().split('T')[0];
    return transactions.filter((t) => t.date === s && !t.atm).reduce((a, t) => a + t.amount, 0);
  };
  const thisWeek = Array.from({ length: 7 }, (_, i) => dayTotal(i)).reduce((a, b) => a + b, 0);
  const lastWeek = Array.from({ length: 7 }, (_, i) => dayTotal(i + 7)).reduce((a, b) => a + b, 0);
  const weekDelta = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  const topCat = topCategories[0];

  // Goals summary (shown to everyone — friendly empty state when none).
  const totalSaved = goals.reduce((a, g) => a + (g.saved || 0), 0);
  const totalTarget = goals.reduce((a, g) => a + (g.target || 0), 0);
  const goalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // Donut data: top 4 categories + Others
  const catTotals = getCategoryTotals(periodTxns);
  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const donutTop = sorted.slice(0, 4);
  const othersValue = sorted.slice(4).reduce((a, [, v]) => a + v, 0);
  const segments = [
    ...donutTop.map(([id, value], i) => ({ id, label: catName(id), value, color: CHART_PALETTE[i] })),
    ...(othersValue > 0 ? [{ id: 'others', label: 'Others', value: othersValue, color: '#F59E0B' }] : []),
  ];
  const donutTotal = segments.reduce((a, s) => a + s.value, 0) || 1;

  const thisMonthMax = Math.max(...topCategories.map((c) => c.amount), 1);

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
          <p className="text-sm text-[#6b7280] mt-2">
            {period === 'month' ? 'spent so far this month' : `spent · ${PERIOD_LABEL[period]}`}
            {topCat && <span> · Biggest spend: {catName(topCat.category)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            label=""
            align="right"
            leading={<Calendar size={15} className="text-[#9ca3af]" />}
            value={PERIOD_LABEL[period]}
            options={[
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

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        <StatCard
          label="Total Spent"
          value={Math.round(totalSpent).toLocaleString('en-IN')}
          sub={`${Math.abs(weekDelta)}% from last week`}
          subColor={weekDelta >= 0 ? 'text-[#15803D]' : 'text-red-500'}
        />
        <StatCard
          label="Budget Left"
          value={budgetSet ? budgetLeft.toLocaleString('en-IN') : '—'}
          sub={budgetSet ? `${daysLeft} days to go` : 'Add a budget'}
          subColor={budgetSet ? 'text-red-500' : 'text-[#9ca3af]'}
        />
        <StatCard
          label="Top Categories"
          value={topCat ? catName(topCat.category) : '—'}
          sub={topCat ? `${fmt(topCat.amount)} this month` : ''}
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
                <div className="h-full bg-[#0E3F2E] rounded-full" style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-[#9ca3af]">
                <span>{budgetUsed}% used</span>
                <span>{daysLeft} days left</span>
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
          <div className="space-y-4">
            {topCategories.map((c) => (
              <div key={c.category}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-[#374151]">{catName(c.category)}</span>
                  <span className="text-sm font-semibold text-[#111827]">{fmt(c.amount)}</span>
                </div>
                <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#0E3F2E] rounded-full"
                    style={{ width: `${(c.amount / thisMonthMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">Goals</p>
          {goals.length === 0 ? (
            <p className="text-sm text-[#9ca3af]">No goals yet.</p>
          ) : (
            <div className="space-y-5">
              {goals.slice(0, 3).map((goal) => {
                const pct = Math.min(Math.round((goal.saved / goal.target) * 100), 100);
                const onTrack = goal.isNew || pct >= (goal.detected ? 20 : 55);
                return (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-[#111827]">{goal.name}</p>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          onTrack ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {onTrack ? 'On Track' : 'Needs Attention'}
                      </span>
                    </div>
                    <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${onTrack ? 'bg-[#0E3F2E]' : 'bg-[#F08A5D]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#9ca3af]">
                      {fmt(goal.saved)} saved of {fmt(goal.target)}
                      {goal.monthly ? ` · adding ${fmt(goal.monthly)}/month` : ''}
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
          <div className="flex items-center gap-6">
            <Donut
              segments={segments}
              total={donutTotal}
              active={activeSeg}
              onHover={setActiveSeg}
              onSelect={() => onViewAll?.()}
            />
            <div className="flex-1 space-y-0.5">
              {segments.map((s, i) => (
                <button
                  key={s.id}
                  onMouseEnter={() => setActiveSeg(i)}
                  onMouseLeave={() => setActiveSeg(null)}
                  onClick={() => onViewAll?.()}
                  className={`w-full flex items-center justify-between py-2 px-2 rounded-lg transition-colors ${
                    activeSeg === i ? 'bg-[#f9fafb]' : ''
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-[#374151]">{s.label}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#111827]">{fmt(s.value)}</span>
                    <ChevronRight size={15} className="text-[#d1d5db]" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium mb-4">Weekly Spend</p>
          <WeeklyChart transactions={transactions} />
        </div>
      </div>

      {/* Recent transactions */}
      <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-wide text-[#9ca3af] font-medium">Recent Transactions</p>
          <button onClick={() => onViewAll?.()} className="text-sm font-medium text-[#0E3F2E] hover:underline">
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
