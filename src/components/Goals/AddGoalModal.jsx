import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export default function AddGoalModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [monthly, setMonthly] = useState('');
  const [deadline, setDeadline] = useState('');
  const [linked, setLinked] = useState([]);

  const handleToggleCategory = (catId) => {
    setLinked(prev =>
      prev.includes(catId)
        ? prev.filter(c => c !== catId)
        : [...prev, catId]
    );
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card border border-line rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-line sticky top-0 bg-bg-card">
          <h2 className="font-serif text-2xl text-text-primary">Declare a goal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-raise rounded-lg transition-colors"
          >
            <X size={20} className="text-text-dim" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Goal name */}
          <div>
            <label className="block text-sm text-text-dim mb-2">Goal name</label>
            <input
              autoFocus
              type="text"
              placeholder="Vietnam trip, new laptop, etc."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-text-primary outline-none focus:border-sage placeholder-text-faint"
            />
          </div>

          {/* Target and monthly */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-dim mb-2">Target amount</label>
              <div className="flex items-center bg-bg border border-line rounded-lg px-4 py-3">
                <span className="text-text-dim">₹</span>
                <input
                  type="number"
                  placeholder="100000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="flex-1 ml-2 bg-transparent text-text-primary outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-2">Monthly amount</label>
              <div className="flex items-center bg-bg border border-line rounded-lg px-4 py-3">
                <span className="text-text-dim">₹</span>
                <input
                  type="number"
                  placeholder="10000"
                  value={monthly}
                  onChange={(e) => setMonthly(e.target.value)}
                  className="flex-1 ml-2 bg-transparent text-text-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm text-text-dim mb-2">Deadline (optional)</label>
            <input
              type="text"
              placeholder="December 2026"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-bg border border-line rounded-lg px-4 py-3 text-text-primary outline-none focus:border-sage placeholder-text-faint"
            />
          </div>

          {/* Link categories */}
          <div>
            <label className="block text-sm text-text-dim mb-3">Link spending categories (optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.filter(c => c.id !== 'cash').map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`p-3 rounded-lg border transition-colors text-sm ${
                    linked.includes(cat.id)
                      ? 'bg-sage/20 border-sage text-text-primary'
                      : 'border-line bg-bg hover:bg-bg-raise text-text-faint'
                  }`}
                >
                  {cat.emoji} {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line p-6 flex gap-3 sticky bottom-0 bg-bg-card">
          <button
            onClick={onClose}
            className="flex-1 border border-line text-text-primary py-2 rounded-lg font-medium hover:bg-bg-raise transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name || !target}
            className="flex-1 bg-sage text-bg py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create goal
          </button>
        </div>
      </div>
    </div>
  );
}
