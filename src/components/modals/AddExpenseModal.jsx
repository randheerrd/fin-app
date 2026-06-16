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
        <Dialog.Overlay className="fixed inset-0 bg-black/60 data-[state=open]:animate-fade-in z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-secondary border border-neutral-700 rounded-xl shadow-xl max-w-md w-full p-0 data-[state=open]:animate-fade-in z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-neutral-700">
            <div>
              <Dialog.Title className="font-serif text-2xl font-bold text-text-primary">
                Add Expense
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors text-text-secondary">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Amount */}
            <div>
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-5xl font-serif text-emerald font-bold bg-transparent outline-none placeholder-text-tertiary"
              />
              <p className="text-text-tertiary text-sm mt-2">Amount in rupees</p>
            </div>

            {/* Category grid */}
            <div>
              <p className="text-sm text-text-secondary font-medium mb-4">Category</p>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                      category === cat.id
                        ? 'bg-emerald/20 border-emerald text-emerald'
                        : 'bg-bg-tertiary border-neutral-700 hover:border-neutral-600 text-text-secondary'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className="text-xs font-medium truncate">{cat.name.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and note */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getToday()}
                  className="w-full bg-bg-tertiary border border-neutral-700 rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary font-medium mb-2">Note (optional)</label>
                <input
                  type="text"
                  placeholder="Details"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-bg-tertiary border border-neutral-700 rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-emerald focus:ring-2 focus:ring-emerald/20 placeholder-text-tertiary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-700 p-6 flex gap-3 bg-bg-tertiary rounded-b-xl">
            <Dialog.Close asChild>
              <button className="flex-1 border border-neutral-700 text-text-secondary py-2.5 rounded-lg font-medium hover:bg-bg-secondary transition-all duration-200">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 bg-emerald text-bg py-2.5 rounded-lg font-semibold hover:bg-emerald-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
