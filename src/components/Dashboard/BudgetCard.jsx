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
  const barColor = percentage > 92 ? 'bg-rose' : percentage > 70 ? 'bg-amber' : 'bg-sage';

  return (
    <div className="bg-bg-card border border-line rounded-lg p-6">
      <h3 className="text-text-primary font-medium mb-4">Monthly budget</h3>

      <div className="mb-6">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-text-dim text-sm">Spending vs Budget</span>
          <span className="font-serif text-lg text-text-primary">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-bg-raise rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-baseline mt-2">
          <span className="text-text-faint text-xs">₹{spent.toLocaleString('en-IN')}</span>
          <span className="text-text-faint text-xs">₹{budget.toLocaleString('en-IN')}</span>
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
              className={`w-full p-3 rounded-lg border border-line text-left transition-colors ${
                isActive ? 'bg-sage/20 border-sage' : 'hover:bg-bg-raise'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cat?.emoji}</span>
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-sage' : 'text-text-primary'}`}>
                      {cat?.name}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-text-dim">₹{item.amount.toLocaleString('en-IN')}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-line">
        <p className="text-text-faint text-xs">
          {((budget / income) * 100).toFixed(0)}% of your income budgeted
        </p>
      </div>
    </div>
  );
}
