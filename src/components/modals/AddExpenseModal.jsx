import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { getToday } from '../../lib/utils';

export default function AddExpenseModal({ onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(getToday());
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (amount && parseFloat(amount) > 0) {
      onSave({
        amount: parseFloat(amount),
        category,
        date,
        merchant: note || `${CATEGORIES.find(c => c.id === category)?.name} expense`,
        atm: false,
      });
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#e5e7eb] rounded-xl shadow-lg max-w-md w-full z-50">
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6]">
            <Dialog.Title className="font-semibold text-[#111827]">Add Expense</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors">
                <X size={18} className="text-[#6b7280]" />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-6 py-5 space-y-5">
            <div>
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-4xl font-bold text-[#1B3A2F] outline-none placeholder-[#d1d5db]"
              />
              <p className="text-[#9ca3af] text-xs mt-1">Amount in rupees</p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#6b7280] mb-3">Category</p>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-lg border transition-all text-center ${
                      category === cat.id
                        ? 'border-[#1B3A2F] bg-[#1B3A2F]/5'
                        : 'border-[#f3f4f6] hover:border-[#e5e7eb] bg-[#f9fafb]'
                    }`}
                  >
                    <div className="text-xl mb-0.5">{cat.emoji}</div>
                    <div className={`text-[10px] font-medium leading-tight ${category === cat.id ? 'text-[#1B3A2F]' : 'text-[#9ca3af]'}`}>
                      {cat.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getToday()}
                  className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-sm outline-none focus:border-[#1B3A2F]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Note (optional)</label>
                <input
                  type="text"
                  placeholder="Details"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-[#111827] text-sm outline-none focus:border-[#1B3A2F] placeholder-[#d1d5db]"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#f3f4f6] flex gap-3">
            <Dialog.Close asChild>
              <button className="flex-1 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 py-2.5 bg-[#1B3A2F] text-white text-sm font-semibold rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
