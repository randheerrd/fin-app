import { useState } from 'react';
import { Plus, ChevronDown, Calendar, ArrowDown, X } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import DuplicateBanner from './DuplicateBanner';
import MerchantLogo from '../MerchantLogo';
import CategoryIcon from '../CategoryIcon';
import AddExpenseModal from '../modals/AddExpenseModal';

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

function Dropdown({ label, value, options, onChange, leading }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3.5 py-2 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f9fafb] transition-colors"
      >
        {leading}
        <span className="font-medium">
          {label ? `${label}: ` : ''}
          {value}
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

export default function Spend({
  transactions,
  onMergeDuplicate,
  onKeepDuplicate,
  onAddExpense,
  onUpdateTransaction,
  onDeleteTransaction,
  searchQuery = '',
  onClearSearch,
}) {
  const [category, setCategory] = useState('all');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState('all');
  const [period, setPeriod] = useState('month');
  const [editing, setEditing] = useState(null);

  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const usedCats = [...new Set(sorted.map((t) => t.category))];
  const dup = sorted.find((t) => t.dup);

  const inPeriod = (dateStr) => {
    if (period === 'all') return true;
    const d = new Date(dateStr);
    const now = new Date();
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (period === 'lastmonth') {
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
    }
    if (period === '3m') {
      const cut = new Date(now);
      cut.setMonth(cut.getMonth() - 3);
      return d >= cut;
    }
    return true;
  };

  const inRange = (amt) => {
    if (range === 'lt500') return amt < 500;
    if (range === 'mid') return amt >= 500 && amt <= 2000;
    if (range === 'gt2000') return amt > 2000;
    return true;
  };

  const search = searchQuery.trim().toLowerCase();
  const filtered = sorted.filter((t) => {
    if (search && !t.merchant.toLowerCase().includes(search) && !catName(t.category).toLowerCase().includes(search))
      return false;
    if (category !== 'all' && t.category !== category) return false;
    if (source === 'manual' && t.source !== 'manual') return false;
    if (source === 'bank' && t.source !== 'bank') return false;
    if (!inRange(t.amount)) return false;
    if (!inPeriod(t.date)) return false;
    return true;
  });

  const rangeLabel = { all: 'All', lt500: 'Under ₹500', mid: '₹500 – ₹2,000', gt2000: 'Over ₹2,000' }[range];
  const periodLabel = { month: 'This Month', lastmonth: 'Last Month', '3m': 'Last 3 Months', all: 'All Time' }[period];

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

      {search && (
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F0F7F3] border border-[#0E3F2E]/15 rounded-lg text-sm text-[#0E3F2E] font-medium">
            Search: “{searchQuery}”
            <button onClick={onClearSearch} className="hover:text-[#0a3122]" aria-label="Clear search">
              <X size={14} />
            </button>
          </span>
          <span className="text-xs text-[#9ca3af]">{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
        </div>
      )}

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
          <Dropdown
            label="Range"
            leading={<span className="text-[#9ca3af]">₹</span>}
            value={rangeLabel}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Under ₹500', value: 'lt500' },
              { label: '₹500 – ₹2,000', value: 'mid' },
              { label: 'Over ₹2,000', value: 'gt2000' },
            ]}
            onChange={setRange}
          />
        </div>
        <Dropdown
          label=""
          leading={<Calendar size={15} className="text-[#9ca3af]" />}
          value={periodLabel}
          options={[
            { label: 'This Month', value: 'month' },
            { label: 'Last Month', value: 'lastmonth' },
            { label: 'Last 3 Months', value: '3m' },
            { label: 'All Time', value: 'all' },
          ]}
          onChange={setPeriod}
        />
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MerchantLogo name={txn.merchant} size={32} />
                      <span className="text-sm font-medium text-[#111827]">{txn.merchant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ backgroundColor: chip.bg, color: chip.text }}
                    >
                      <CategoryIcon id={txn.category} size={13} />
                      {catName(txn.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6b7280]">{sourceLabel(txn)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#111827] text-right whitespace-nowrap">
                    −₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditing(txn)}
                      className="text-sm font-medium text-[#6b7280] hover:text-[#111827]"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <AddExpenseModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            onUpdateTransaction(data);
            setEditing(null);
          }}
          onDelete={(id) => {
            onDeleteTransaction(id);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
