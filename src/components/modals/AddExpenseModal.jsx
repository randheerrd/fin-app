import { useState, useEffect } from 'react';
import { X, Trash2, Check } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { getToday } from '../../lib/utils';
import CategoryIcon from '../CategoryIcon';

export default function AddExpenseModal({ onClose, onSave, onDelete, initial }) {
  const isEdit = Boolean(initial);
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState(initial?.category || 'food');
  const [date, setDate] = useState(initial?.date || getToday());
  const [note, setNote] = useState(initial?.merchant || '');

  const handleSave = () => {
    if (amount && parseFloat(amount) > 0) {
      onSave({
        ...(initial || {}),
        amount: parseFloat(amount),
        category,
        date,
        merchant: note || `${CATEGORIES.find((c) => c.id === category)?.name} expense`,
        atm: false,
      });
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]';

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-2">
          <h2 className="font-display text-3xl text-[#111827]">{isEdit ? 'Edit expense' : 'Add expense'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Amount</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
                <span className="pl-4 pr-1 text-[#9ca3af] text-sm">₹</span>
                <input
                  autoFocus
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-2 py-3 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                max={getToday()}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Merchant / note</label>
            <input
              type="text"
              placeholder="e.g. Swiggy dinner"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2.5">Category</label>
            <div className="flex flex-wrap gap-2.5">
              {CATEGORIES.map((cat) => {
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-colors ${
                      active
                        ? 'bg-[#0E3F2E] border-[#0E3F2E] text-white'
                        : 'bg-white border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {active ? <Check size={14} /> : <CategoryIcon id={cat.id} size={14} />}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-8 py-5 flex items-center gap-3">
          {isEdit && onDelete && (
            <button
              onClick={() => onDelete(initial.id)}
              className="p-2.5 border border-[#fee2e2] text-red-500 rounded-lg hover:bg-[#fef2f2] transition-colors"
              aria-label="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0}
            className="px-6 py-2.5 bg-[#15803D] text-white text-sm font-medium rounded-lg hover:bg-[#136a34] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save changes' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
