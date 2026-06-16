import { ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function RecentTransactions({ transactions, onAddExpense }) {
  return (
    <div className="bg-bg-card border border-line rounded-lg">
      <div className="px-6 py-4 border-b border-line flex justify-between items-center">
        <h3 className="font-medium text-text-primary">Recent transactions</h3>
        <button className="text-sage text-sm font-medium hover:text-sage/80 transition-colors flex items-center gap-1">
          View all <ChevronRight size={16} />
        </button>
      </div>

      <div className="divide-y divide-line">
        {transactions.map(txn => {
          const cat = CATEGORIES.find(c => c.id === txn.category);
          return (
            <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-bg-raise transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-bg rounded-lg flex items-center justify-center text-lg">
                  {cat?.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium text-sm">{txn.merchant}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-bg px-2 py-1 rounded text-text-faint">
                      {txn.source === 'bank' ? 'HDFC' : 'Manual'}
                    </span>
                    <span className="text-xs text-text-faint">{txn.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-primary font-medium">−₹{txn.amount.toLocaleString('en-IN')}</p>
            </div>
          );
        })}
      </div>

      {transactions.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-text-dim text-sm mb-4">No transactions yet</p>
          <button
            onClick={onAddExpense}
            className="text-sage font-medium text-sm hover:text-sage/80 transition-colors"
          >
            Add your first expense
          </button>
        </div>
      )}
    </div>
  );
}
