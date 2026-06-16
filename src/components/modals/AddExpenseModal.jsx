import { useState } from 'react';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-line rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line">
          <h2 className="font-serif text-2xl text-text-primary">Add expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-raise rounded-lg transition-colors"
          >
            <X size={20} className="text-text-dim" />
          </button>
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
              className="w-full text-5xl font-serif text-text-primary bg-transparent outline-none placeholder-text-faint"
            />
            <p className="text-text-dim text-sm mt-2">Amount in rupees</p>
          </div>

          {/* Category grid */}
          <div>
            <p className="text-sm text-text-dim mb-4">Category</p>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-lg border transition-colors text-center ${
                    category === cat.id
                      ? 'bg-sage text-bg border-sage'
                      : 'bg-bg border-line hover:bg-bg-raise'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className={`text-xs font-medium ${category === cat.id ? 'text-bg' : 'text-text-faint'}`}>
                    {cat.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date and note */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-dim mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getToday()}
                className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-text-primary outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-2">Note (optional)</label>
              <input
                type="text"
                placeholder="Details"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-bg border border-line rounded-lg px-3 py-2 text-text-primary outline-none focus:border-sage placeholder-text-faint"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-line text-text-primary py-2 rounded-lg font-medium hover:bg-bg-raise transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1 bg-sage text-bg py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
