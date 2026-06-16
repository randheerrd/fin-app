import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, getCategoryChip } from '../data/categories';
import MerchantLogo from './MerchantLogo';
import CategoryIcon from './CategoryIcon';

const catName = (id) => CATEGORIES.find((c) => c.id === id)?.name || 'Other';

export default function SearchModal({ transactions, onClose, onNavigate }) {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const results = query
    ? transactions
        .filter(
          (t) =>
            t.merchant.toLowerCase().includes(query) ||
            catName(t.category).toLowerCase().includes(query)
        )
        .slice(0, 8)
    : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 pt-28" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-[#f3f4f6]">
          <Search size={18} className="text-[#9ca3af]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search transactions or categories…"
            className="flex-1 py-4 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
          />
          <button onClick={onClose} className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={16} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {!query && <p className="px-4 py-6 text-sm text-[#9ca3af] text-center">Start typing to search.</p>}
          {query && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-[#9ca3af] text-center">No matches for “{q}”.</p>
          )}
          {results.map((t) => {
            const chip = getCategoryChip(t.category);
            return (
              <button
                key={t.id}
                onClick={() => {
                  onNavigate('spend');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f9fafb] transition-colors text-left"
              >
                <MerchantLogo name={t.merchant} size={34} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111827] truncate">{t.merchant}</p>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium mt-0.5"
                    style={{ backgroundColor: chip.bg, color: chip.text }}
                  >
                    <CategoryIcon id={t.category} size={11} />
                    {catName(t.category)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[#111827]">−₹{t.amount.toLocaleString('en-IN')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
