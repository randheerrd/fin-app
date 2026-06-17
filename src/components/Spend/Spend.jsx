import { useState } from 'react';
import { Plus, Calendar, ArrowDown, ArrowUp, ChevronsUpDown, X, RotateCcw, CreditCard, SearchX } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../../data/categories';
import DuplicateBanner from './DuplicateBanner';
import MerchantLogo from '../MerchantLogo';
import CategoryIcon from '../CategoryIcon';
import Dropdown from '../Dropdown';
import EmptyState from '../EmptyState';
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

// Clickable, sortable table-header cell.
function SortHeader({ label, col, activeKey, dir, onSort, align = 'left' }) {
  const active = activeKey === col;
  return (
    <th
      className={`px-6 py-4 text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      <button
        onClick={() => onSort(col)}
        className={`inline-flex items-center gap-1 uppercase tracking-wide hover:text-[#374151] transition-colors ${
          active ? 'text-[#374151]' : ''
        } ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        {label}
        {active ? (
          dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
        ) : (
          <ChevronsUpDown size={12} className="opacity-40" />
        )}
      </button>
    </th>
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
  onConnectBank,
}) {
  const [category, setCategory] = useState('all');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState('all');
  const [period, setPeriod] = useState('month');
  const [merchant, setMerchant] = useState('all');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [editing, setEditing] = useState(null);

  const usedCats = [...new Set(transactions.map((t) => t.category))];
  const usedMerchants = [...new Set(transactions.map((t) => t.merchant))].sort((a, b) => a.localeCompare(b));
  const dup = transactions.find((t) => t.dup);

  // Click a header to sort by it; click again to flip direction.
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'date' || key === 'amount' ? 'desc' : 'asc');
    }
  };

  const compare = (a, b) => {
    let r = 0;
    if (sortKey === 'date') r = new Date(a.date) - new Date(b.date);
    else if (sortKey === 'amount') r = a.amount - b.amount;
    else if (sortKey === 'merchant') r = a.merchant.localeCompare(b.merchant);
    else if (sortKey === 'category') r = catName(a.category).localeCompare(catName(b.category));
    else if (sortKey === 'source') r = sourceLabel(a).localeCompare(sourceLabel(b));
    return sortDir === 'asc' ? r : -r;
  };

  const filtersActive =
    category !== 'all' || source !== 'all' || range !== 'all' || period !== 'month' || merchant !== 'all' || !!searchQuery;

  const resetFilters = () => {
    setCategory('all');
    setSource('all');
    setRange('all');
    setPeriod('month');
    setMerchant('all');
    onClearSearch?.();
  };

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
  const filtered = transactions
    .filter((t) => {
      if (search && !t.merchant.toLowerCase().includes(search) && !catName(t.category).toLowerCase().includes(search))
        return false;
      if (merchant !== 'all' && t.merchant !== merchant) return false;
      if (category !== 'all' && t.category !== category) return false;
      if (source === 'manual' && t.source !== 'manual') return false;
      if (source === 'bank' && t.source !== 'bank') return false;
      if (!inRange(t.amount)) return false;
      if (!inPeriod(t.date)) return false;
      return true;
    })
    .sort(compare);

  const rangeLabel = { all: 'All', lt500: 'Under ₹500', mid: '₹500 – ₹2,000', gt2000: 'Over ₹2,000' }[range];
  const periodLabel = { month: 'This Month', lastmonth: 'Last Month', '3m': 'Last 3 Months', all: 'All Time' }[period];

  if (transactions.length === 0) {
    return (
      <div className="min-h-full bg-white px-8 py-7">
        <p className="font-display text-4xl text-[#111827] mb-6">Spend</p>
        <EmptyState
          icon={CreditCard}
          title="No expenses yet"
          subtitle="Add an expense or link a bank — they'll show up here, auto-categorised and ready to track."
          benefits={['Auto-categorised', 'Duplicate detection', 'Bank sync']}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              <Plus size={16} />
              Add your first expense
            </button>
            {onConnectBank && (
              <button
                onClick={onConnectBank}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                Link a bank
              </button>
            )}
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <p className="font-display text-4xl text-[#111827]">Spend</p>
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
            active={category !== 'all'}
            onClear={() => setCategory('all')}
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
            active={source !== 'all'}
            onClear={() => setSource('all')}
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
            active={range !== 'all'}
            onClear={() => setRange('all')}
          />
          <Dropdown
            label="Merchant"
            value={merchant === 'all' ? 'All' : merchant}
            options={[
              { label: 'All', value: 'all' },
              ...usedMerchants.map((m) => ({ label: m, value: m })),
            ]}
            onChange={setMerchant}
            active={merchant !== 'all'}
            onClear={() => setMerchant('all')}
          />
        </div>
        <div className="flex items-center gap-3">
          <Dropdown
            label=""
            align="right"
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
      </div>

      {/* Table — or a no-results state when filters/search hide everything */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No transactions match"
          subtitle="Nothing fits the current filters, period, or search. Try widening them."
        >
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              <RotateCcw size={16} />
              Reset filters
            </button>
          )}
        </EmptyState>
      ) : (
      <div className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              <SortHeader label="Date" col="date" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Merchant" col="merchant" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Category" col="category" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Source" col="source" activeKey={sortKey} dir={sortDir} onSort={toggleSort} />
              <SortHeader label="Amount" col="amount" activeKey={sortKey} dir={sortDir} onSort={toggleSort} align="right" />
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
      )}

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
