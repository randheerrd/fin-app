import { useState } from 'react';
import { X } from 'lucide-react';

export default function AtmSplitModal({ atmRemaining, onClose, onAddSplit }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleAddSplit = () => {
    if (amount && parseFloat(amount) > 0) {
      const success = onAddSplit(parseFloat(amount), description);
      if (success) {
        setAmount('');
        setDescription('');
      }
    }
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-line rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line">
          <div>
            <h2 className="font-serif text-2xl text-text-primary">Split your ATM cash</h2>
            <p className="text-text-dim text-sm mt-1">₹{atmRemaining.toLocaleString('en-IN')} still unaccounted</p>
          </div>
          <button
            onClick={handleDone}
            className="p-2 hover:bg-bg-raise rounded-lg transition-colors"
          >
            <X size={20} className="text-text-dim" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm text-text-dim mb-2">Amount</label>
            <div className="flex items-center bg-bg border border-line rounded-lg px-4 py-3">
              <span className="text-2xl text-text-dim">₹</span>
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={atmRemaining}
                className="flex-1 ml-2 bg-transparent text-xl text-text-primary outline-none"
              />
            </div>
            {amount && parseFloat(amount) > atmRemaining && (
              <p className="text-xs text-rose mt-2">Only ₹{atmRemaining.toLocaleString('en-IN')} left</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-dim mb-2">What was it?</label>
            <input
              type="text"
              placeholder="e.g., Groceries, Dinner, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-text-primary outline-none focus:border-sage placeholder-text-faint"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line p-6 flex gap-3">
          <button
            onClick={handleDone}
            className="flex-1 border border-line text-text-primary py-2 rounded-lg font-medium hover:bg-bg-raise transition-colors"
          >
            Done for now
          </button>
          <button
            onClick={handleAddSplit}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > atmRemaining}
            className="flex-1 bg-sage text-bg py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add & continue
          </button>
        </div>
      </div>
    </div>
  );
}
