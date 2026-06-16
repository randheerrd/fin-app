import { CATEGORIES } from '../../data/categories';

export default function BudgetCard({
  spent,
  budget,
  income,
  topCategories,
  onSelectCategory,
  activeFilter,
}) {
  const percentage = (spent / budget) * 100;
  const isOverBudget = percentage > 100;
  const barColor = isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-emerald';

  return (
    <div className="bg-bg-secondary border border-neutral-700 rounded-xl p-6 shadow-lg">
      <h3 className="text-text-primary font-semibold mb-6 text-lg">Monthly Budget</h3>

      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-text-tertiary text-sm">Spending vs Budget</span>
          <span className="font-serif text-2xl text-text-primary font-bold">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-bg-tertiary rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300 rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-baseline mt-3">
          <span className="text-text-tertiary text-xs font-medium">₹{spent.toLocaleString('en-IN')}</span>
          <span className="text-text-tertiary text-xs font-medium">₹{budget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Top categories */}
      <div className="space-y-3">
        {topCategories.map((item, idx) => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          const isActive = activeFilter === item.category;
          return (
            <button
              key={idx}
              onClick={() => onSelectCategory(isActive ? null : item.category)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-emerald/10 border-emerald'
                  : 'bg-bg-tertiary border-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat?.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${isActive ? 'text-emerald' : 'text-text-primary'}`}>
                      {cat?.name}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary font-medium">₹{item.amount.toLocaleString('en-IN')}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-700">
        <p className="text-text-tertiary text-xs">
          {((budget / income) * 100).toFixed(0)}% of your income budgeted
        </p>
      </div>
    </div>
  );
}
