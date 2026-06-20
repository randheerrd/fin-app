import { useState } from 'react';
import { Link, Sparkles, TrendingUp, Receipt, CalendarDays, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import EmptyState from '../EmptyState';
import CategoryIcon from '../CategoryIcon';
import MerchantLogo from '../MerchantLogo';
import Dropdown from '../Dropdown';
import { CATEGORIES, CHART_PALETTE, getCategoryChip } from '../../data/categories';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

function Tag({ children, bg, text }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}

// A green/red "↑/↓ X% vs <label>" delta tag.
function DeltaTag({ pct, label }) {
  if (pct === null || pct === undefined) return null;
  const up = pct >= 0;
  return (
    <Tag bg={up ? '#FEECEC' : '#E7F5EE'} text={up ? '#DC2626' : '#15803D'}>
      {up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {Math.abs(pct)}% vs {label}
    </Tag>
  );
}

const PERIOD_LABEL = { month: 'This Month', lastmonth: 'Last Month', '3m': 'Last 3 Months', all: 'All Time' };
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

const WD_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WD_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon → Sun

function Card({ children }) {
  return (
    <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">{children}</div>
  );
}

export default function Insights({ transactions, manualMode, onLinkBank, onConnectBank }) {
  const [period, setPeriod] = useState('all'); // show everything by default
  const [category, setCategory] = useState([]); // multi-select; empty = all
  const allCats = category.length === 0;

  const hasEnoughData = transactions.length >= 7;

  if (!hasEnoughData) {
    return (
      <div className="min-h-full bg-white px-8 py-7">
        <p className="font-display text-4xl text-[#111827] mb-6">Insights</p>
        <EmptyState
          icon={Sparkles}
          title="Insights are warming up"
          subtitle="Log expenses for about a week — or link a bank — and your spending patterns will start to appear here."
          benefits={['Spending trends', 'Category breakdown', 'Subscriptions tracker']}
        >
          {manualMode && (
            <button
              onClick={onConnectBank || onLinkBank}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              <Link size={16} />
              Connect your bank — 6 months of history from day one
            </button>
          )}
        </EmptyState>
      </div>
    );
  }

  const nonAtm = transactions.filter((t) => !t.atm);
  const usedCats = [...new Set(nonAtm.map((t) => t.category))];
  const scoped = nonAtm.filter((t) => inPeriod(t.date, period) && (allCats || category.includes(t.category)));

  const total = scoped.reduce((s, t) => s + t.amount, 0);
  const count = scoped.length;
  const days = new Set(scoped.map((t) => t.date)).size || 1;
  const dailyAvg = Math.round(total / days);

  // Category breakdown
  const catTotals = {};
  scoped.forEach((t) => (catTotals[t.category] = (catTotals[t.category] || 0) + t.amount));
  const topCategories = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Top merchants
  const merchTotals = {};
  const merchCount = {};
  scoped.forEach((t) => {
    merchTotals[t.merchant] = (merchTotals[t.merchant] || 0) + t.amount;
    merchCount[t.merchant] = (merchCount[t.merchant] || 0) + 1;
  });
  const topMerchants = Object.entries(merchTotals).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const mostFreq = Object.entries(merchCount).sort((a, b) => b[1] - a[1])[0]; // [name, count]
  const top3Pct = total ? Math.round((topCategories.slice(0, 3).reduce((s, [, v]) => s + v, 0) / total) * 100) : 0;

  // Biggest single expense
  const biggest = scoped.reduce((m, t) => (t.amount > (m?.amount || 0) ? t : m), null);
  const biggestX = biggest && dailyAvg ? (biggest.amount / dailyAvg).toFixed(1) : 0;

  // Weekday distribution
  const wd = [0, 0, 0, 0, 0, 0, 0];
  scoped.forEach((t) => (wd[new Date(t.date).getDay()] += t.amount));
  const wdMax = Math.max(...wd, 1);
  const busiestDay = WD_ORDER.reduce((b, i) => (wd[i] > wd[b] ? i : b), 1);
  const weekendShare = total ? Math.round(((wd[0] + wd[6]) / total) * 100) : 0;

  // Subscriptions in scope
  const subTxns = scoped.filter((t) => t.category === 'subscriptions');
  const subTotal = subTxns.reduce((s, t) => s + t.amount, 0);
  const subNames = [...new Set(subTxns.map((t) => t.merchant))];

  // Previous comparable period (for the "vs" comparison cards). Respects the filter.
  const now = new Date();
  const monthMatch = (dateStr, y, m) => {
    const d = new Date(dateStr);
    return d.getFullYear() === y && d.getMonth() === m;
  };
  let prevTxns = [];
  let prevLabel = '';
  if (period === 'lastmonth') {
    const p = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    prevTxns = nonAtm.filter((t) => monthMatch(t.date, p.getFullYear(), p.getMonth()));
    prevLabel = p.toLocaleDateString('en-IN', { month: 'short' });
  } else if (period === '3m') {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 6);
    const end = new Date(now);
    end.setMonth(end.getMonth() - 3);
    prevTxns = nonAtm.filter((t) => new Date(t.date) >= start && new Date(t.date) < end);
    prevLabel = 'prior 3 months';
  } else {
    // 'month' and 'all' → compare against last month.
    const p = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevTxns = nonAtm.filter((t) => monthMatch(t.date, p.getFullYear(), p.getMonth()));
    prevLabel = p.toLocaleDateString('en-IN', { month: 'short' });
  }
  const prevScoped = allCats ? prevTxns : prevTxns.filter((t) => category.includes(t.category));
  const prevTotal = prevScoped.reduce((s, t) => s + t.amount, 0);
  const sumCat = (txns, id) => txns.filter((t) => t.category === id).reduce((s, t) => s + t.amount, 0);
  const pctChange = (cur, prev) => (prev ? Math.round(((cur - prev) / prev) * 100) : null);
  const momPct = pctChange(total, prevTotal);
  const compMax = Math.max(total, prevTotal, 1);

  // Category deep-dives for the top categories in scope.
  const deepDives = topCategories.map(([id, amount]) => {
    const txns = scoped.filter((t) => t.category === id);
    return {
      id,
      amount,
      count: txns.length,
      avg: txns.length ? Math.round(amount / txns.length) : 0,
      pctOfTotal: total ? Math.round((amount / total) * 100) : 0,
      vsPrev: pctChange(amount, sumCat(prevTxns, id)),
    };
  });

  const filtersActive = period !== 'all' || category.length > 0;
  const clearAll = () => {
    setPeriod('all');
    setCategory([]);
  };

  const dayName = (i) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];

  return (
    <div className="min-h-full bg-white px-8 py-7">
      {/* Header + filters */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-display text-4xl text-[#111827]">Insights</p>
        <div className="flex items-center gap-3">
          {filtersActive && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-2.5 py-2 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
            >
              <RotateCcw size={14} />
              Clear filters
            </button>
          )}
          <Dropdown
            multi
            label="Category"
            value={category}
            options={usedCats.map((c) => ({ label: catName(c), value: c }))}
            onChange={setCategory}
          />
          <Dropdown
            label=""
            align="right"
            value={PERIOD_LABEL[period]}
            options={Object.entries(PERIOD_LABEL).map(([value, label]) => ({ label, value }))}
            onChange={setPeriod}
          />
        </div>
      </div>

      {scoped.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing in this view"
          subtitle="No spending matches these filters. Try a wider period or a different category."
        >
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            Reset filters
          </button>
        </EmptyState>
      ) : (
        <div className="space-y-5 max-w-4xl">
          {/* Overview */}
          <Card>
            <div className="flex items-center gap-2 mb-2 text-[#0E3F2E]">
              <TrendingUp size={16} />
              <span className="text-sm font-semibold">
                {allCats ? 'Overview' : category.length === 1 ? catName(category[0]) : `${category.length} categories`} ·{' '}
                {PERIOD_LABEL[period]}
              </span>
            </div>
            <p className="text-sm text-[#6b7280] mb-4">
              You've spent <span className="font-semibold text-[#111827]">{fmt(total)}</span> across {count} purchases —
              that's about <span className="font-semibold text-[#111827]">{fmt(dailyAvg)}</span> a day.
            </p>
            <div className="grid grid-cols-3 bg-[#f9fafb] rounded-xl overflow-hidden">
              {[
                { value: fmt(total), label: 'Total spent' },
                { value: count, label: 'Transactions' },
                { value: fmt(dailyAvg), label: 'Daily average' },
              ].map((s, i) => (
                <div key={s.label} className={`px-6 py-4 ${i > 0 ? 'border-l border-[#eef0f2]' : ''}`}>
                  <p className="text-lg font-bold text-[#111827]">{s.value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Period-over-period comparison */}
          {prevTotal > 0 && momPct !== null && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Tag bg="#E7F5EE" text="#15803D">Spending trend</Tag>
                <DeltaTag pct={momPct} label={prevLabel} />
              </div>
              <p className="text-base text-[#111827] mb-5">
                You've spent <span className="font-semibold">{fmt(Math.abs(total - prevTotal))}</span>{' '}
                {total >= prevTotal ? 'more' : 'less'} than {prevLabel}. {total >= prevTotal ? 'Worth a look.' : 'Nicely done.'}
              </p>
              <div className="space-y-4">
                {[
                  { label: PERIOD_LABEL[period], amount: total },
                  { label: prevLabel, amount: prevTotal },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs text-[#9ca3af] uppercase tracking-wide mb-1.5">
                      <span>{row.label}</span>
                      <span className="text-sm font-semibold text-[#111827]">{fmt(row.amount)}</span>
                    </div>
                    <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-[#0E3F2E] rounded-full" style={{ width: `${(row.amount / compMax) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Category breakdown — segmented bar + compact legend */}
          {allCats && topCategories.length > 1 && (
            <Card>
              <p className="text-sm font-semibold text-[#111827] mb-1.5">Where it goes</p>
              <p className="text-sm text-[#6b7280] mb-4">
                <span className="font-semibold text-[#111827]">{catName(topCategories[0][0])}</span> leads at{' '}
                {Math.round((topCategories[0][1] / total) * 100)}% — your top 3 categories are{' '}
                <span className="font-semibold text-[#111827]">{top3Pct}%</span> of all spending.
              </p>
              <div className="flex h-3 rounded-full overflow-hidden mb-4 bg-[#f3f4f6]">
                {topCategories.map(([id, amount], i) => (
                  <div
                    key={id}
                    title={`${catName(id)} · ${fmt(amount)}`}
                    style={{ width: `${(amount / total) * 100}%`, backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {topCategories.map(([id, amount], i) => (
                  <div key={id} className="flex items-center gap-2 text-sm">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CHART_PALETTE[i % CHART_PALETTE.length] }}
                    />
                    <span className="text-[#374151] flex-1 truncate">{catName(id)}</span>
                    <span className="text-[#9ca3af] text-xs">{Math.round((amount / total) * 100)}%</span>
                    <span className="font-semibold text-[#111827] w-20 text-right">{fmt(amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top merchants — compact 2-column grid */}
          <Card>
            <p className="text-sm font-semibold text-[#111827] mb-1.5">Top merchants</p>
            <p className="text-sm text-[#6b7280] mb-4">
              <span className="font-semibold text-[#111827]">{topMerchants[0][0]}</span> takes the most at{' '}
              {fmt(topMerchants[0][1])}
              {mostFreq && (
                <>
                  {' '}· <span className="font-semibold text-[#111827]">{mostFreq[0]}</span> appears most often,{' '}
                  {mostFreq[1]} times
                </>
              )}
              .
            </p>
            <div className="space-y-1">
              {topMerchants.map(([name, amount]) => (
                <div key={name} className="flex items-center gap-3 py-1.5 min-w-0">
                  <MerchantLogo name={name} size={30} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{name}</p>
                    <p className="text-[11px] text-[#9ca3af]">{merchCount[name]} {merchCount[name] === 1 ? 'txn' : 'txns'}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#111827] whitespace-nowrap">{fmt(amount)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Category deep-dives — one per top category */}
          {allCats &&
            deepDives.map((dd) => {
              const chip = getCategoryChip(dd.id);
              return (
                <Card key={dd.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag bg={chip.bg} text={chip.text}>
                      <CategoryIcon id={dd.id} size={12} /> {catName(dd.id)}
                    </Tag>
                    <DeltaTag pct={dd.vsPrev} label={prevLabel} />
                  </div>
                  <p className="text-base text-[#111827] mb-5">
                    {catName(dd.id)} took <span className="font-semibold">{fmt(dd.amount)}</span> — {dd.pctOfTotal}% of
                    your spending across {dd.count} {dd.count === 1 ? 'transaction' : 'transactions'}.
                  </p>
                  <div className="grid grid-cols-3 bg-[#f9fafb] rounded-xl overflow-hidden">
                    {[
                      { value: dd.count, label: 'Transactions' },
                      { value: fmt(dd.avg), label: 'Avg spend' },
                      { value: `${dd.pctOfTotal}%`, label: 'Total spend' },
                    ].map((s, i) => (
                      <div key={s.label} className={`px-6 py-4 ${i > 0 ? 'border-l border-[#eef0f2]' : ''}`}>
                        <p className="text-lg font-bold text-[#111827]">{s.value}</p>
                        <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}

          {/* Biggest expense */}
          {biggest && (
            <Card>
              <div className="flex items-center gap-2 mb-2 text-[#B45309]">
                <Receipt size={16} />
                <span className="text-sm font-semibold">Biggest single expense</span>
              </div>
              <p className="text-sm text-[#6b7280] mb-4">
                One charge of <span className="font-semibold text-[#111827]">{fmt(biggest.amount)}</span> — about{' '}
                <span className="font-semibold text-[#111827]">{biggestX}×</span> your daily average.
              </p>
              <div className="flex items-center gap-3">
                <MerchantLogo name={biggest.merchant} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] truncate">{biggest.merchant}</p>
                  <p className="text-xs text-[#9ca3af]">
                    {catName(biggest.category)} · {new Date(biggest.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <span className="text-lg font-bold text-[#111827]">{fmt(biggest.amount)}</span>
              </div>
            </Card>
          )}

          {/* Weekday pattern */}
          <Card>
            <div className="flex items-center gap-2 mb-2 text-[#4F5BD5]">
              <CalendarDays size={16} />
              <span className="text-sm font-semibold">Spending pattern</span>
            </div>
            <p className="text-base text-[#111827] mb-5">
              {weekendShare}% lands on weekends · busiest day is <span className="font-semibold">{dayName(busiestDay)}</span>.
            </p>
            <div className="flex items-end justify-between gap-3 h-28">
              {WD_ORDER.map((i) => {
                const h = Math.max((wd[i] / wdMax) * 80, 8);
                const weekend = i === 0 || i === 6;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className={`w-full rounded-md ${weekend ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
                      style={{ height: `${h}px` }}
                    />
                    <span className="text-xs text-[#9ca3af]">{WD_LABELS[WD_ORDER.indexOf(i)]}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Subscriptions */}
          {subNames.length > 0 && (
            <Card>
              <div className="mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#F3E8FF] text-[#7C3AED]">
                  <CategoryIcon id="subscriptions" size={12} /> Subscriptions
                </span>
              </div>
              <p className="text-base text-[#111827] mb-1">
                You're paying <span className="font-semibold">{fmt(subTotal)}</span> across {subNames.length}{' '}
                {subNames.length === 1 ? 'service' : 'services'}.
              </p>
              <p className="text-sm text-[#9ca3af]">{subNames.slice(0, 4).join(' · ')} — these repeat regularly.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
