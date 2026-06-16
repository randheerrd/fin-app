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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-md w-full shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6]">
          <div>
            <p className="font-semibold text-[#111827]">Split your ATM cash</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">₹{atmRemaining.toLocaleString('en-IN')} still unaccounted</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={18} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Amount</label>
            <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F]">
              <span className="pl-4 text-[#9ca3af] text-sm">₹</span>
              <input
                autoFocus
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={atmRemaining}
                className="flex-1 px-2 py-2.5 text-[#111827] text-sm outline-none"
              />
            </div>
            {amount && parseFloat(amount) > atmRemaining && (
              <p className="text-xs text-red-500 mt-1">Only ₹{atmRemaining.toLocaleString('en-IN')} left</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5">What was it?</label>
            <input
              type="text"
              placeholder="e.g., Groceries, Dinner…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#1B3A2F] placeholder-[#d1d5db]"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#f3f4f6] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Done for now
          </button>
          <button
            onClick={handleAddSplit}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > atmRemaining}
            className="flex-1 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add & continue
          </button>
        </div>
      </div>
    </div>
  );
}
