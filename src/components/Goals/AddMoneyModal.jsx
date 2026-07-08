import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { groupINR, digitsOnly, getToday } from '../../lib/utils';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// Dedicated "add a manual contribution" flow — kept separate from Edit goal so
// editing the goal's target/deadline never mixes with depositing money.
// Doubles as the EDIT flow when an existing `entry` is passed: fields are
// prefilled and a Delete action is shown.
export default function AddMoneyModal({
  goal,
  entry,
  onContribute,
  onEditContribution,
  onRemoveContribution,
  onClose,
}) {
  const isEdit = Boolean(entry);
  const [amount, setAmount] = useState(isEdit ? String(entry.amount) : '');
  const [note, setNote] = useState(isEdit && entry.label !== 'Manual save' ? entry.label : '');

  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const amountNum = parseFloat(amount) || 0;
  // When editing, exclude this entry's own amount from "remaining" so the shortcut stays accurate.
  const remaining = Math.max((goal.target || 0) - (goal.saved || 0) + (isEdit ? entry.amount : 0), 0);

  const handleSave = () => {
    if (amountNum <= 0) return;
    if (isEdit) {
      onEditContribution?.(goal.id, entry.id, { amount: amountNum, label: note.trim() || 'Manual save' });
    } else {
      onContribute(goal.id, amountNum, {
        id: crypto.randomUUID(),
        type: 'manual',
        label: note.trim() || 'Manual save',
        amount: amountNum,
        date: getToday(),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    onRemoveContribution?.(goal.id, entry.id);
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]';

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-1">
          <div>
            <h2 className="font-display text-2xl text-[#111827]">{isEdit ? 'Edit contribution' : 'Add contribution'}</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">to {goal.name}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Amount</label>
            <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
              <span className="pl-4 pr-1 text-[#9ca3af] text-sm">₹</span>
              <input
                autoFocus
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={groupINR(amount)}
                onChange={(e) => setAmount(digitsOnly(e.target.value))}
                className="flex-1 px-2 py-3 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
            </div>
            {!isEdit && remaining > 0 && (
              <button
                onClick={() => setAmount(String(remaining))}
                className="text-xs text-[#0E3F2E] font-medium mt-1.5 hover:underline"
              >
                Add the full {fmt(remaining)} remaining
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Bonus, month-end transfer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="px-8 py-5 flex items-center gap-3">
          {isEdit && (
            <button
              onClick={handleDelete}
              className="p-2.5 border border-[#fee2e2] text-red-500 rounded-lg hover:bg-[#fef2f2] transition-colors"
              aria-label="Delete contribution"
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
            disabled={amountNum <= 0}
            className="px-6 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isEdit ? 'Save changes' : `Add ${amountNum > 0 ? fmt(amountNum) : 'money'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
