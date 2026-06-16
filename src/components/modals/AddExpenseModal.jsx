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
        <Dialog.Overlay className="fixed inset-0 bg-black/20 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-bg-border rounded-lg shadow-md max-w-md w-full p-0 z-50">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-bg-border">
            <Dialog.Title className="font-serif text-2xl font-bold text-text-primary">
              Add Expense
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                <X size={20} className="text-text-secondary" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Amount */}
            <div>
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-5xl font-serif font-bold text-accent bg-transparent outline-none placeholder-text-tertiary"
              />
              <p className="text-text-secondary text-sm mt-2">Amount in rupees</p>
            </div>

            {/* Category */}
            <div>
              <p className="text-text-secondary text-sm font-medium mb-4">Category</p>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      category === cat.id
                        ? 'border-accent bg-blue-50'
                        : 'border-bg-border hover:border-bg-border bg-bg-secondary'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.emoji}</div>
                    <div className={`text-xs font-medium ${category === cat.id ? 'text-accent' : 'text-text-tertiary'}`}>
                      {cat.name.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Note */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary font-medium mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={getToday()}
                  className="w-full border border-bg-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary font-medium mb-2">Note (optional)</label>
                <input
                  type="text"
                  placeholder="Details"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-bg-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 placeholder-text-tertiary"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-bg-border p-6 flex gap-3 bg-bg-secondary rounded-b-lg">
            <Dialog.Close asChild>
              <button className="flex-1 border border-bg-border text-text-primary py-2.5 rounded-lg font-medium hover:bg-bg-primary transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 bg-accent text-white py-2.5 rounded-lg font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
