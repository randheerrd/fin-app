import { Plus } from 'lucide-react';
import { getTotalSpent, getTopCategories, getCurrentMonthYear, getDayOfMonth, getDaysInMonth } from '../../lib/utils';
import { CATEGORIES } from '../../data/categories';

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

  const filteredTransactions = activeFilter
    ? transactions.filter(t => t.category === activeFilter)
    : transactions;

  const budgetUsed = (totalSpent / budget) * 100;

  return (
    <div className="w-full bg-bg-primary">
      {/* Hero Section */}
      <div className="bg-white border-b border-bg-border p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-text-secondary text-sm font-medium mb-4">
            {getCurrentMonthYear()} • Day {dayOfMonth} of {daysInMonth}
          </p>
          <h1 className="font-serif text-6xl font-bold text-text-primary mb-4">
            ₹{totalSpent.toLocaleString('en-IN')}
          </h1>
          <p className="text-text-secondary">
            spent so far this month, {Math.round(budgetUsed)}% of budget used.{' '}
            {topCategories.length > 0 && `Biggest spend: ${CATEGORIES.find(c => c.id === topCategories[0]?.category)?.name}.`}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-secondary mb-6">No expenses yet</p>
            <button
              onClick={onAddExpense}
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors"
            >
              <Plus size={20} />
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {/* Left - Budget */}
            <div className="col-span-2 space-y-6">
              {/* Budget Card */}
              <div className="bg-white border border-bg-border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text-primary mb-6">This Month</h3>
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-text-secondary text-sm">₹{totalSpent.toLocaleString('en-IN')} / ₹{budget.toLocaleString('en-IN')}</span>
                    <span className="font-serif text-2xl font-bold text-text-primary">{Math.round(budgetUsed)}%</span>
                  </div>
                  <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budgetUsed > 80 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-baseline mt-3">
                    <span className="text-text-tertiary text-xs">{daysInMonth - dayOfMonth} days left</span>
                    <span className={`text-xs font-medium ${budgetUsed > 100 ? 'text-danger' : 'text-text-secondary'}`}>
                      {Math.max(0, budget - totalSpent) > 0
                        ? `₹${(budget - totalSpent).toLocaleString('en-IN')} remaining`
                        : `₹${(totalSpent - budget).toLocaleString('en-IN')} over budget`}
                    </span>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-3 pt-6 border-t border-bg-border">
                  {topCategories.slice(0, 4).map((item, idx) => {
                    const cat = CATEGORIES.find(c => c.id === item.category);
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat?.emoji}</span>
                          <div>
                            <p className="font-medium text-text-primary text-sm">{cat?.name}</p>
                            <p className="text-text-tertiary text-xs">{Math.round((item.amount / totalSpent) * 100)}%</p>
                          </div>
                        </div>
                        <p className="font-semibold text-text-primary">₹{item.amount.toLocaleString('en-IN')}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ATM Card */}
              {atmRemaining > 0 && !manualMode && (
                <div className="bg-white border border-bg-border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-text-secondary text-sm font-medium">Untracked Cash</p>
                      <p className="font-serif text-3xl font-bold text-warning mt-2">₹{atmRemaining.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <button
                    onClick={onAtmSplit}
                    className="w-full px-4 py-2 bg-warning text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Split Amount
                  </button>
                </div>
              )}
            </div>

            {/* Right - Goals */}
            <div className="bg-white border border-bg-border rounded-lg p-6 shadow-sm h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Goals</h3>
              {goals.length === 0 ? (
                <p className="text-text-secondary text-sm">No goals yet</p>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 3).map(goal => {
                    const progress = (goal.saved / goal.target) * 100;
                    return (
                      <div key={goal.id} className="pb-4 border-b border-bg-border last:border-0">
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-medium text-text-primary text-sm">{goal.name}</p>
                          <span className={`px-2 py-1 text-xs rounded font-semibold ${
                            progress >= 55 ? 'bg-green-50 text-success' : 'bg-orange-50 text-warning'
                          }`}>
                            {progress >= 55 ? 'On Track' : 'Needs Attention'}
                          </span>
                        </div>
                        <div className="w-full bg-bg-tertiary rounded-full h-2 overflow-hidden mb-2">
                          <div
                            className={`h-full transition-all ${progress >= 55 ? 'bg-success' : 'bg-warning'}`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <p className="text-text-tertiary text-xs">
                          ₹{goal.saved.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-white border border-bg-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-bg-border flex justify-between items-center">
              <h3 className="font-semibold text-text-primary">Recent Transactions</h3>
              <button className="text-accent text-sm font-semibold hover:text-accent-dark transition-colors">
                See All →
              </button>
            </div>
            <div className="divide-y divide-bg-border">
              {filteredTransactions.slice(0, 5).map(txn => {
                const cat = CATEGORIES.find(c => c.id === txn.category);
                return (
                  <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-bg-secondary transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{cat?.emoji}</span>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{txn.merchant}</p>
                        <p className="text-text-tertiary text-xs">{txn.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-text-primary">−₹{txn.amount.toLocaleString('en-IN')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
