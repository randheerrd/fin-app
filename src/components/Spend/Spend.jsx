import { useState } from 'react';
import { Plus, ChevronDown, Calendar, ArrowDown } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import DuplicateBanner from './DuplicateBanner';

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.toLocaleString('en-IN', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
}

const BANKS = ['HDFC Bank', 'Axis Bank', 'ICICI Bank'];
function sourceLabel(txn) {
  if (txn.source !== 'bank') return 'Added by you';
  // Deterministic bank assignment so the column reads with variety but stays stable.
  let h = 0;
  for (const ch of txn.merchant) h = (h + ch.charCodeAt(0)) % BANKS.length;
  return BANKS[h];
}

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
      >
        <span className="font-medium">
          {label}: {value}
        </span>
        <ChevronDown size={15} className="text-[#9ca3af]" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 min-w-[160px] max-h-64 overflow-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-sm hover:bg-[#f9fafb] ${
                  value === opt.label ? 'text-[#0E3F2E] font-medium' : 'text-[#374151]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Spend({ transactions, onMergeDuplicate, onKeepDuplicate, onAddExpense }) {
  const [category, setCategory] = useState('all');
  const [source, setSource] = useState('all');

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const usedCats = [...new Set(sorted.map((t) => t.category))];
  const dup = sorted.find((t) => t.dup);

  const filtered = sorted.filter((t) => {
    if (category !== 'all' && t.category !== category) return false;
    if (source === 'manual' && t.source !== 'manual') return false;
    if (source === 'bank' && t.source !== 'bank') return false;
    return true;
  });

  if (sorted.length === 0) {
    return (
      <div className="min-h-full bg-white px-8 py-7">
        <p className="font-display text-4xl text-[#111827] mb-6">Transactions</p>
        <div className="border border-[#f3f4f6] rounded-xl p-12 text-center">
          <p className="text-[#9ca3af] text-sm mb-5">No expenses yet</p>
          <button
            onClick={onAddExpense}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            <Plus size={16} />
            Add your first expense
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <p className="font-display text-4xl text-[#111827]">Transactions</p>
        <button
          onClick={onAddExpense}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      {dup && (
        <DuplicateBanner
          transaction={dup}
          onMerge={() => onMergeDuplicate(dup.id)}
          onKeepBoth={() => onKeepDuplicate(dup.id)}
        />
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Dropdown
            label="Category"
            value={category === 'all' ? 'All' : catName(category)}
            options={[
              { label: 'All', value: 'all' },
              ...usedCats.map((c) => ({ label: catName(c), value: c })),
            ]}
            onChange={setCategory}
          />
          <Dropdown
            label="Source"
            value={source === 'all' ? 'All' : source === 'bank' ? 'Bank' : 'Added by you'}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Bank', value: 'bank' },
              { label: 'Added by you', value: 'manual' },
            ]}
            onChange={setSource}
          />
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">
            Range: All
            <ChevronDown size={15} className="text-[#9ca3af]" />
          </button>
        </div>
        <button className="flex items-center gap-2 px-3.5 py-2 border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors">
          <Calendar size={15} className="text-[#9ca3af]" />
          This Month
          <ChevronDown size={15} className="text-[#9ca3af]" />
        </button>
      </div>

      {/* Table */}
      <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              <th className="px-6 py-4 text-left text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">
                <span className="inline-flex items-center gap-1">
                  Date <ArrowDown size={12} />
                </span>
              </th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">Merchant</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">Category</th>
              <th className="px-6 py-4 text-left text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">Source</th>
              <th className="px-6 py-4 text-right text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">Amount</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f6f7f8]">
            {filtered.map((txn) => {
              const chip = getCategoryChip(txn.category);
              return (
                <tr key={txn.id} className={`hover:bg-[#f9fafb] transition-colors ${txn.dup ? 'bg-[#FBF7EF]' : ''}`}>
                  <td className="px-6 py-4 text-sm text-[#9ca3af] whitespace-nowrap">{formatDate(txn.date)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{txn.merchant}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ backgroundColor: chip.bg, color: chip.text }}
                    >
                      {catName(txn.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b7280]">{sourceLabel(txn)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#111827] text-right whitespace-nowrap">
                    −₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-[#6b7280] hover:text-[#111827]">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
