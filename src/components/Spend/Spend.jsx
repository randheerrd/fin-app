import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import DuplicateBanner from './DuplicateBanner';

export default function Spend({ transactions, onMergeDuplicate, onKeepDuplicate, onAddExpense }) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const cats = [...new Set(sorted.map(t => t.category))];

  if (sorted.length === 0) {
    return (
      <div className="min-h-screen bg-white px-8 py-7">
        <p className="text-2xl font-bold text-[#111827] mb-6">Transactions</p>
        <div className="border border-[#f3f4f6] rounded-xl p-12 text-center">
          <p className="text-[#9ca3af] text-sm mb-5">No expenses yet</p>
          <button
            onClick={onAddExpense}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
          >
            <Plus size={16} />
            Add your first expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl font-bold text-[#111827]">Transactions</p>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
        >
          <Plus size={16} />
          Add expense
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button className="px-3 py-1.5 bg-[#1B3A2F] text-white rounded-full text-xs font-medium whitespace-nowrap">All</button>
        {cats.map(catId => {
          const cat = CATEGORIES.find(c => c.id === catId);
          return (
            <button
              key={catId}
              className="px-3 py-1.5 border border-[#e5e7eb] rounded-full text-xs font-medium text-[#6b7280] hover:bg-[#f9fafb] transition-colors whitespace-nowrap"
            >
              {cat?.emoji} {cat?.name}
            </button>
          );
        })}
      </div>

      {/* Transaction table */}
      <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Date</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Merchant</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Source</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f9fafb]">
            {sorted.map((txn) => {
              const cat = CATEGORIES.find(c => c.id === txn.category);
              return (
                <>
                  <tr key={txn.id} className={`hover:bg-[#f9fafb] transition-colors ${txn.dup ? 'bg-amber-50/60' : ''}`}>
                    <td className="px-5 py-3 text-xs text-[#9ca3af]">{txn.date}</td>
                    <td className="px-5 py-3 text-sm text-[#111827] font-medium">{txn.merchant}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f3f4f6] rounded-lg text-xs text-[#6b7280]">
                        {cat?.emoji} {cat?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#9ca3af]">
                      {txn.source === 'bank' ? 'HDFC' : 'Manual'}
                    </td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#111827] text-right">−₹{txn.amount.toLocaleString('en-IN')}</td>
                  </tr>
                  {txn.dup && (
                    <DuplicateBanner
                      transaction={txn}
                      onMerge={() => onMergeDuplicate(txn.id)}
                      onKeepBoth={() => onKeepDuplicate(txn.id)}
                    />
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
