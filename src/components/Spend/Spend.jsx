import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import DuplicateBanner from './DuplicateBanner';

export default function Spend({ transactions, onMergeDuplicate, onKeepDuplicate, onAddExpense }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const cats = [...new Set(sorted.map(t => t.category))];

  if (sorted.length === 0) {
    return (
      <div className="p-8 bg-bg min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl text-text-primary mb-8">Spend</h1>
          <div className="bg-bg-card border border-line rounded-lg p-12 text-center">
            <p className="text-text-dim mb-6">No expenses yet</p>
            <button
              onClick={onAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              <Plus size={18} />
              Add your first expense
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-text-primary">Spend</h1>
          <button
            onClick={onAddExpense}
            className="flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
          >
            <Plus size={18} />
            Add expense
          </button>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4">
          <button className="px-4 py-2 bg-sage text-bg rounded-full text-sm font-medium">All</button>
          {cats.map(catId => {
            const cat = CATEGORIES.find(c => c.id === catId);
            return (
              <button
                key={catId}
                className="px-4 py-2 bg-bg-card border border-line rounded-full text-sm font-medium text-text-dim hover:bg-bg-raise transition-colors whitespace-nowrap"
              >
                {cat?.emoji} {cat?.name}
              </button>
            );
          })}
        </div>

        {/* Transaction table */}
        <div className="bg-bg-card border border-line rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-bg-raise">
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dim">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dim">Merchant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dim">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-dim">Source</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-dim">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sorted.map((txn, idx) => {
                const cat = CATEGORIES.find(c => c.id === txn.category);
                return (
                  <div key={txn.id}>
                    <tr className={txn.dup ? 'bg-amber/5' : ''}>
                      <td className="px-6 py-3 text-sm text-text-faint">{txn.date}</td>
                      <td className="px-6 py-3 text-sm text-text-primary font-medium">{txn.merchant}</td>
                      <td className="px-6 py-3 text-sm">
                        <span className="inline-flex items-center gap-2 px-2 py-1 bg-bg rounded text-text-faint">
                          {cat?.emoji} {cat?.name}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-text-faint">
                        {txn.source === 'bank' ? 'HDFC' : 'Manual'}
                      </td>
                      <td className="px-6 py-3 text-sm text-text-primary font-medium text-right">−₹{txn.amount.toLocaleString('en-IN')}</td>
                    </tr>
                    {txn.dup && (
                      <DuplicateBanner
                        transaction={txn}
                        onMerge={() => onMergeDuplicate(txn.id)}
                        onKeepBoth={() => onKeepDuplicate(txn.id)}
                      />
                    )}
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
