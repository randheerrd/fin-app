import { useState } from 'react';
import { Plus } from 'lucide-react';
import AddGoalModal from './AddGoalModal';
import GoalCard from './GoalCard';

export default function Goals({
  goals,
  transactions,
  onAddGoal,
  sipDismissed,
  onDismissSip,
  onAcceptSip,
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const onTrackCount = goals.filter(g => {
    if (g.isNew) return true;
    return (g.saved / g.target * 100) >= (g.detected ? 20 : 55);
  }).length;

  const totalSaved = goals.reduce((s, g) => s + (g.saved || 0), 0);
  const shouldShowSip = !sipDismissed && transactions.length > 0;

  if (goals.length === 0 && !shouldShowSip) {
    return (
      <div className="min-h-screen bg-white px-8 py-7">
        <p className="text-2xl font-bold text-[#111827] mb-6">Goals</p>
        <div className="border border-[#f3f4f6] rounded-xl p-12 text-center">
          <p className="text-[#6b7280] text-sm mb-5">
            Goals are yours to declare — name one, and every linked rupee starts meaning something.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
          >
            <Plus size={16} />
            Add your first goal
          </button>
        </div>
        {showAddModal && (
          <AddGoalModal
            onClose={() => setShowAddModal(false)}
            onSave={(data) => { onAddGoal(data); setShowAddModal(false); }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl font-bold text-[#111827]">Goals</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
        >
          <Plus size={16} />
          Add goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Active goals', value: goals.length },
            { label: 'On track', value: `${onTrackCount} of ${goals.length}` },
            { label: 'Total saved', value: `₹${totalSaved.toLocaleString('en-IN')}` },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#f3f4f6] rounded-xl p-4">
              <p className="text-xs text-[#9ca3af] mb-1">{label}</p>
              <p className="text-xl font-bold text-[#111827]">{value}</p>
            </div>
          ))}
        </div>
      )}

      {shouldShowSip && (
        <div className="border border-[#1B3A2F]/20 bg-[#1B3A2F]/5 rounded-xl p-5 mb-6">
          <p className="text-sm text-[#111827] mb-4">
            From your bank history: <strong>₹10,000</strong> goes to your index fund SIP every month —{' '}
            <strong>₹30,000 over 3 months</strong>. Track it as a goal?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                onAcceptSip({ name: 'SIP Index fund', target: 120000, saved: 30000, monthly: 10000, linked: [], detected: true });
                onDismissSip();
              }}
              className="flex-1 py-2 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
            >
              Accept
            </button>
            <button
              onClick={onDismissSip}
              className="flex-1 py-2 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => { onAddGoal(data); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}
