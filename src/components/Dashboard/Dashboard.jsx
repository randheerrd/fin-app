import { Plus } from 'lucide-react';
import HeroNumber from './HeroNumber';
import FilterChips from './FilterChips';
import AtmCard from './AtmCard';
import BudgetCard from './BudgetCard';
import GoalsCard from './GoalsCard';
import RecentTransactions from './RecentTransactions';
import { getTotalSpent, getTopCategories, getToday, getCurrentMonthYear, getDayOfMonth, getDaysInMonth } from '../../lib/utils';
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

  const filteredGoals = activeFilter
    ? goals.filter(g => g.linked && g.linked.includes(activeFilter))
    : goals;

  return (
    <div className="flex-1 overflow-auto bg-bg">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="px-8 py-12 border-b border-neutral-700">
          <div className="mb-4">
            <p className="text-text-tertiary text-sm font-medium">{getCurrentMonthYear()} • Day {dayOfMonth} of {daysInMonth}</p>
          </div>
          <HeroNumber
            amount={activeFilter
              ? filteredTransactions.filter(t => !t.atm).reduce((sum, t) => sum + t.amount, 0)
              : totalSpent}
          />
          <p className="text-text-secondary mt-4 text-base leading-relaxed">
            {manualMode
              ? `across ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} logged.${transactions.length > 0 ? ` Biggest spend so far: ${CATEGORIES.find(c => c.id === topCategories[0]?.category)?.name}.` : ''}`
              : transactions.length === 0
              ? 'Nothing logged yet. Press N anywhere to add your first expense.'
              : `spent so far this month. Biggest spend: ${CATEGORIES.find(c => c.id === topCategories[0]?.category)?.name}.`}
          </p>
        </div>

        {/* Filter Context */}
        {activeFilter && (
          <div className="px-8 py-4 bg-bg-secondary border-b border-neutral-700 flex items-center justify-between">
            <p className="text-text-secondary text-sm">
              Showing {CATEGORIES.find(c => c.id === activeFilter)?.name} • ₹{filteredTransactions.filter(t => !t.atm).reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
            </p>
            <button
              onClick={() => setActiveFilter(null)}
              className="text-emerald hover:text-emerald-light text-sm font-semibold transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Filter Chips */}
        {topCategories.length > 0 && (
          <FilterChips
            categories={topCategories}
            activeFilter={activeFilter}
            onSelectCategory={setActiveFilter}
          />
        )}

        {/* Content Grid */}
        <div className="px-8 py-8">
          {transactions.length === 0 && !manualMode ? (
            <div className="text-center py-12">
              <p className="text-text-secondary mb-6">Your bank data will appear here once imported</p>
              <button
                onClick={onAddExpense}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald text-bg rounded-lg font-semibold hover:bg-emerald-dark transition-all shadow-md"
              >
                <Plus size={18} />
                Add first expense
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Budget Card */}
                <BudgetCard
                  spent={activeFilter
                    ? filteredTransactions.filter(t => !t.atm).reduce((sum, t) => sum + t.amount, 0)
                    : totalSpent}
                  budget={budget}
                  income={income}
                  topCategories={topCategories.slice(0, 4)}
                  onSelectCategory={setActiveFilter}
                  activeFilter={activeFilter}
                />

                {/* ATM Card */}
                {atmRemaining > 0 && !manualMode && (
                  <AtmCard
                    remaining={atmRemaining}
                    onSplit={onAtmSplit}
                  />
                )}
              </div>

              {/* Right Column */}
              <div>
                {/* Goals Card */}
                {filteredGoals.length > 0 && (
                  <GoalsCard goals={filteredGoals} />
                )}

                {/* Goals Stats */}
                {goals.length > 0 && (
                  <div className="bg-bg-secondary border border-neutral-700 rounded-lg p-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-neutral-700">
                        <span className="text-text-tertiary text-sm">{goals.length} active goal{goals.length !== 1 ? 's' : ''}</span>
                        <span className="text-emerald font-semibold">
                          {goals.filter(g => g.status === 'on-track').length} on track
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-text-tertiary text-xs mb-1">Total saved</p>
                        <p className="font-serif text-2xl text-text-primary font-bold">
                          ₹{goals.reduce((sum, g) => sum + (g.saved || 0), 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <RecentTransactions
              transactions={filteredTransactions.slice(0, 5)}
              onAddExpense={onAddExpense}
            />
          )}
        </div>
      </div>
    </div>
  );
}
