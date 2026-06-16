import { Link, ArrowUp } from 'lucide-react';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

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

function PatternBars({ transactions }) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const totals = labels.map((_, i) => {
    const d = new Date(now);
    const diff = now.getDay() === 0 ? i - 6 : i - (now.getDay() - 1);
    d.setDate(now.getDate() + diff);
    const s = d.toISOString().split('T')[0];
    return transactions.filter((t) => t.date === s && !t.atm).reduce((a, t) => a + t.amount, 0);
  });
  const max = Math.max(...totals, 1);
  return (
    <div className="flex items-end justify-between gap-3 h-28">
      {labels.map((day, i) => {
        const isWeekend = i >= 5;
        const h = Math.max((totals[i] / max) * 80, 10);
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-2">
            <div
              className={`w-full rounded-md ${isWeekend ? 'bg-[#F08A5D]' : 'bg-[#0E3F2E]'}`}
              style={{ height: `${h}px` }}
            />
            <span className="text-xs text-[#9ca3af]">{day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Insights({ transactions, manualMode, onLinkBank }) {
  const hasEnoughData = transactions.length >= 7;
  const nonAtm = transactions.filter((t) => !t.atm);
  const totalSpent = nonAtm.reduce((s, t) => s + t.amount, 0);

  if (!hasEnoughData) {
    return (
      <div className="min-h-full bg-white px-8 py-7">
        <p className="font-display text-4xl text-[#111827] mb-6">Insights</p>
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-12 text-center">
          <p className="text-[#6b7280] text-sm mb-5">
            Insights need a little history. Log expenses for about a week and patterns appear here.
          </p>
          {manualMode && (
            <button
              onClick={onLinkBank}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              <Link size={16} />
              Connect your bank — 6 months of history from day one
            </button>
          )}
        </div>
      </div>
    );
  }

  // Month-over-month (synthetic prior month ~12% lower)
  const momPct = 12;
  const lastMonth = Math.round(totalSpent / (1 + momPct / 100));
  const diff = totalSpent - lastMonth;

  // Food & Dining
  const foodTxns = nonAtm.filter((t) => t.category === 'food');
  const foodTotal = foodTxns.reduce((s, t) => s + t.amount, 0);
  const foodOrders = foodTxns.length;
  const foodAvg = foodOrders ? Math.round(foodTotal / foodOrders) : 0;
  const foodPct = totalSpent ? Math.round((foodTotal / totalSpent) * 100) : 0;

  // Subscriptions
  const subTxns = nonAtm.filter((t) => t.category === 'subscriptions');
  const subTotal = subTxns.reduce((s, t) => s + t.amount, 0);
  const subNames = [...new Set(subTxns.map((t) => t.merchant))];

  return (
    <div className="min-h-full bg-white px-8 py-7">
      <p className="font-display text-4xl text-[#111827] mb-6">Insights</p>

      <div className="space-y-5 max-w-4xl">
        {/* Month over month */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag bg="#E7F5EE" text="#15803D">Month over month</Tag>
            <Tag bg="#FEECEC" text="#DC2626">
              <ArrowUp size={12} /> {momPct}% vs May
            </Tag>
          </div>
          <p className="text-base text-[#111827] mb-5">
            You've spent <span className="font-semibold">{fmt(diff)}</span> more than May at this point in the
            month. Worth a look.
          </p>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-[#9ca3af] uppercase tracking-wide mb-1.5">
                <span>This Month</span>
                <span className="text-sm font-semibold text-[#111827]">{fmt(totalSpent)}</span>
              </div>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                <div className="h-full bg-[#0E3F2E] rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#9ca3af] uppercase tracking-wide mb-1.5">
                <span>May 2025</span>
                <span className="text-sm font-semibold text-[#111827]">{fmt(lastMonth)}</span>
              </div>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-[#0E3F2E] rounded-full"
                  style={{ width: `${Math.round((lastMonth / totalSpent) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Food & Dining */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag bg="#FBF1E5" text="#B45309">🍴 Food &amp; Dinning</Tag>
            <Tag bg="#FEECEC" text="#DC2626">
              <ArrowUp size={12} /> {foodPct}% vs May
            </Tag>
          </div>
          <p className="text-base text-[#111827] mb-5">
            Food delivery took <span className="font-semibold">{fmt(foodTotal)}</span> this month
            {subNames.length ? '- Swiggy and Zomato together.' : '.'}
          </p>
          <div className="grid grid-cols-3 bg-[#f9fafb] rounded-xl overflow-hidden">
            {[
              { value: foodOrders, label: 'Orders' },
              { value: fmt(foodAvg), label: 'Avg Order' },
              { value: `${foodPct}%`, label: 'Total Spend' },
            ].map((s, i) => (
              <div key={s.label} className={`px-6 py-4 ${i > 0 ? 'border-l border-[#eef0f2]' : ''}`}>
                <p className="text-lg font-bold text-[#111827]">{s.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Spending pattern */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <div className="mb-4">
            <Tag bg="#EEF1FB" text="#4F5BD5">Spending Pattern</Tag>
          </div>
          <p className="text-base text-[#111827] mb-5">
            48% of your spending happens on weekends. Weekdays, you barely spend.
          </p>
          <PatternBars transactions={transactions} />
        </div>

        {/* Subscriptions */}
        <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] p-6">
          <div className="mb-4">
            <Tag bg="#F3E8FF" text="#7C3AED">🎟 Subscription</Tag>
          </div>
          <p className="text-base text-[#111827] mb-1">
            You're paying <span className="font-semibold">{fmt(subTotal)}</span> in subscriptions this month
            across {subNames.length} services.
          </p>
          <p className="text-sm text-[#9ca3af]">
            {subNames.slice(0, 2).join(' · ')} · These repeat every month — check Recurring for the full picture.
          </p>
        </div>
      </div>
    </div>
  );
}
