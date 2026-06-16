import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function AddGoalModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');
  const [deadline, setDeadline] = useState('');
  const [linked, setLinked] = useState([]);

  const toggleCategory = (catId) => {
    setLinked(prev => prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]);
  };

  const handleSave = () => {
    if (name && target) {
      onSave({
        name,
        target: parseFloat(target),
        saved: 0,
        monthly: monthly ? parseFloat(monthly) : 0,
        deadline,
        linked,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6] sticky top-0 bg-white">
          <p className="font-semibold text-[#111827]">Declare a goal</p>
          <button onClick={onClose} className="p-1.5 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={18} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Goal name</label>
            <input
              autoFocus
              type="text"
              placeholder="Vietnam trip, new laptop…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#1B3A2F] placeholder-[#9ca3af]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Target amount</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F]">
                <span className="pl-3 text-[#9ca3af] text-sm">₹</span>
                <input
                  type="number"
                  placeholder="100000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Monthly amount</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F]">
                <span className="pl-3 text-[#9ca3af] text-sm">₹</span>
                <input
                  type="number"
                  placeholder="10000"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Deadline (optional)</label>
            <input
              type="text"
              placeholder="December 2026"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#1B3A2F] placeholder-[#9ca3af]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#6b7280] mb-2">Link spending categories (optional)</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter(c => c.id !== 'cash').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-2 py-2 rounded-lg border text-xs transition-colors ${
                    linked.includes(cat.id)
                      ? 'bg-[#1B3A2F]/10 border-[#1B3A2F]/30 text-[#1B3A2F] font-medium'
                      : 'border-[#e5e7eb] text-[#6b7280] hover:bg-[#f9fafb]'
                  }`}
                >
                  {cat.emoji} {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#f3f4f6] flex gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !target}
            className="flex-1 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create goal
          </button>
        </div>
      </div>
    </div>
  );
}
