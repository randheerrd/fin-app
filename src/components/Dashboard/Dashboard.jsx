import { Plus } from 'lucide-react';
import { getTotalSpent, getTopCategories, getCurrentMonthYear, getDayOfMonth, getDaysInMonth } from '../../lib/utils';
import { CATEGORIES } from '../../data/categories';

function WeeklyChart({ transactions }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const dayTotals = days.map((_, i) => {
    const d = new Date(now);
    const diff = now.getDay() === 0 ? i - 6 : i - (now.getDay() - 1);
    d.setDate(now.getDate() + diff);
    const dateStr = d.toISOString().split('T')[0];
    return transactions
      .filter(t => t.date === dateStr && !t.atm)
      .reduce((s, t) => s + t.amount, 0);
  });

  const max = Math.max(...dayTotals, 1);
  const today = now.getDay() === 0 ? 6 : now.getDay() - 1;

  return (
    <div className="flex items-end gap-1.5 h-20">
      {days.map((day, i) => {
        const barHeight = Math.max((dayTotals[i] / max) * 60, dayTotals[i] > 0 ? 4 : 2);
        const isToday = i === today;
        return (
          <div key={day} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '60px' }}>
              <div
                className={`w-full rounded-sm transition-all ${
                  isToday ? 'bg-[#1B3A2F]' : dayTotals[i] > 0 ? 'bg-[#1B3A2F]/60' : 'bg-[#f3f4f6]'
                }`}
                style={{ height: `${barHeight}px` }}
              />
            </div>
            <span className={`text-[10px] ${isToday ? 'text-[#1B3A2F] font-semibold' : 'text-[#9ca3af]'}`}>{day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({
  income,
  budget,
  transactions,
  goals,
  atmRemaining,
  manualMode,
  activeFilter,
  setActiveFilter,
  onAddExpense,
  onAtmSplit,
}) {
  const totalSpent = getTotalSpent(transactions, atmRemaining);
  const topCategories = getTopCategories(transactions, 5);
  const dayOfMonth = getDayOfMonth();
  const daysInMonth = getDaysInMonth();
  const budgetUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;
  const remaining = budget - totalSpent;

  const filteredTransactions = activeFilter
    ? transactions.filter(t => t.category === activeFilter)
    : transactions;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-[#f3f4f6] px-8 py-7">
        <p className="text-[#9ca3af] text-xs mb-2 uppercase tracking-wider font-medium">
          {getCurrentMonthYear()} · Day {dayOfMonth} of {daysInMonth}
        </p>
        <p className="text-[42px] font-bold text-[#111827] mb-1 tracking-tight leading-none">
          ₹{totalSpent.toLocaleString('en-IN')}
        </p>
        <p className="text-[#6b7280] text-sm mt-2">
          spent this month
          {topCategories.length > 0 && (
            <span className="text-[#9ca3af]">
              {' '}· Biggest spend: {CATEGORIES.find(c => c.id === topCategories[0]?.category)?.name}
            </span>
          )}
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-8">
          <div className="w-12 h-12 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-4">
            <Plus size={20} className="text-[#9ca3af]" />
          </div>
          <p className="text-[#374151] font-medium mb-1">No expenses yet</p>
          <p className="text-[#9ca3af] text-sm mb-6">Add your first expense to see insights</p>
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1B3A2F] text-white text-sm font-semibold rounded-xl hover:bg-[#142D24] active:scale-[0.98] transition-all"
          >
            <Plus size={15} />
            Add expense
          </button>
        </div>
      ) : (
        <div className="px-8 py-6 grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-5">
            {/* Budget card */}
            <div className="border border-[#f3f4f6] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-[#111827]">Monthly Budget</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  budgetUsed > 90 ? 'bg-red-50 text-red-600' :
                  budgetUsed > 70 ? 'bg-orange-50 text-orange-600' :
                  'bg-green-50 text-green-700'
                }`}>
                  {Math.round(budgetUsed)}% used
                </span>
              </div>
              <div className="w-full bg-[#f3f4f6] rounded-full h-2 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetUsed > 90 ? 'bg-red-400' :
                    budgetUsed > 70 ? 'bg-orange-400' :
                    'bg-[#1B3A2F]'
                  }`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#9ca3af]">Spent</p>
                  <p className="text-base font-bold text-[#111827]">₹{totalSpent.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9ca3af]">Remaining</p>
                  <p className={`text-base font-bold ${remaining < 0 ? 'text-red-500' : 'text-[#1B3A2F]'}`}>
                    ₹{Math.abs(remaining).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#9ca3af]">Budget</p>
                  <p className="text-base font-bold text-[#111827]">₹{budget.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Weekly chart */}
            <div className="border border-[#f3f4f6] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#111827]">This Week</p>
              </div>
              <WeeklyChart transactions={transactions} />
            </div>

            {/* ATM untracked cash */}
            {atmRemaining > 0 && !manualMode && (
              <div className="border border-orange-100 bg-orange-50 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#111827] mb-0.5">Untracked Cash</p>
                    <p className="text-xs text-[#6b7280]">From your ATM withdrawal — where did it go?</p>
                  </div>
                  <p className="text-xl font-bold text-orange-600">₹{atmRemaining.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={onAtmSplit}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
                >
                  Split amount
                </button>
              </div>
            )}

            {/* Category breakdown */}
            {topCategories.length > 0 && (
              <div className="border border-[#f3f4f6] rounded-2xl p-5">
                <p className="text-sm font-semibold text-[#111827] mb-4">Spending by Category</p>
                <div className="space-y-0.5">
                  {topCategories.map((item, idx) => {
                    const cat = CATEGORIES.find(c => c.id === item.category);
                    const pct = Math.round((item.amount / totalSpent) * 100);
                    const isSelected = activeFilter === item.category;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveFilter(isSelected ? null : item.category)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isSelected ? 'bg-[#1B3A2F] text-white' : 'hover:bg-[#f9fafb]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg leading-none">{cat?.emoji}</span>
                          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-[#374151]'}`}>
                            {cat?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs ${isSelected ? 'text-white/70' : 'text-[#9ca3af]'}`}>{pct}%</span>
                          <span className={`text-sm font-semibold w-20 text-right ${isSelected ? 'text-white' : 'text-[#111827]'}`}>
                            ₹{item.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Goals summary */}
            <div className="border border-[#f3f4f6] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-[#111827]">Goals</p>
                {goals.length > 0 && (
                  <span className="text-xs text-[#9ca3af]">{goals.length} active</span>
                )}
              </div>
              {goals.length === 0 ? (
                <p className="text-xs text-[#9ca3af]">No goals set yet</p>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 3).map(goal => {
                    const pct = Math.round((goal.saved / goal.target) * 100);
                    return (
                      <div key={goal.id}>
                        <div className="flex justify-between items-center mb-1.5">
                          <p className="text-sm text-[#374151] font-medium">{goal.name}</p>
                          <span className="text-xs text-[#9ca3af]">{pct}%</span>
                        </div>
                        <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 overflow-hidden mb-1">
                          <div
                            className="h-full bg-[#1B3A2F] rounded-full transition-all"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#9ca3af]">
                          ₹{goal.saved.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="border border-[#f3f4f6] rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
                <p className="text-sm font-semibold text-[#111827]">Recent</p>
              </div>
              <div className="divide-y divide-[#f9fafb]">
                {filteredTransactions.slice(0, 6).map(txn => {
                  const cat = CATEGORIES.find(c => c.id === txn.category);
                  return (
                    <div key={txn.id} className="px-5 py-3 flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-base flex-shrink-0">{cat?.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-[#111827] font-medium truncate">{txn.merchant}</p>
                          <p className="text-xs text-[#9ca3af]">{txn.date}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-[#111827] ml-2 flex-shrink-0">
                        −₹{txn.amount.toLocaleString('en-IN')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
