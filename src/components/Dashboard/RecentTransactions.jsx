import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function RecentTransactions({ transactions, onAddExpense }) {
  return (
    <div className="bg-bg-secondary border border-neutral-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-6 py-4 border-b border-neutral-700 flex justify-between items-center bg-bg-tertiary">
        <h3 className="font-semibold text-text-primary">Recent Transactions</h3>
        <button className="text-emerald text-sm font-semibold hover:text-emerald-light transition-colors flex items-center gap-1">
          View all <ChevronRight size={16} />
        </button>
      </div>

      <div className="divide-y divide-neutral-700">
        {transactions.map(txn => {
          const cat = CATEGORIES.find(c => c.id === txn.category);
          return (
            <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-bg-tertiary transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-bg-tertiary rounded-lg flex items-center justify-center text-2xl">
                  {cat?.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-semibold text-sm">{txn.merchant}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-bg-tertiary px-2 py-1 rounded text-text-tertiary font-medium">
                      {txn.source === 'bank' ? 'HDFC' : 'Manual'}
                    </span>
                    <span className="text-xs text-text-tertiary">{txn.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-primary font-semibold">−₹{txn.amount.toLocaleString('en-IN')}</p>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-text-secondary text-sm mb-4">No transactions yet</p>
          <button
            onClick={onAddExpense}
            className="text-emerald font-semibold text-sm hover:text-emerald-light transition-colors"
          >
            Add your first expense
          </button>
        </div>
      )}
    </div>
  );
}
