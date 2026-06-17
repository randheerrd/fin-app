import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import AddGoalModal from './AddGoalModal';
import GoalCard from './GoalCard';
import EmptyState from '../EmptyState';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export default function Goals({
  goals,
  transactions,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  sipDismissed,
  onDismissSip,
  onAcceptSip,
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const onTrackCount = goals.filter((g) => {
    if (g.isNew) return true;
    return (g.saved / g.target) * 100 >= (g.detected ? 20 : 55);
  }).length;

  const totalSaved = goals.reduce((s, g) => s + (g.saved || 0), 0);
  const shouldShowSip = !sipDismissed && transactions.length > 0;

  if (goals.length === 0 && !shouldShowSip) {
    return (
      <div className="min-h-full bg-white px-8 py-7">
        <p className="font-display text-4xl text-[#111827] mb-6">Goals</p>
        <EmptyState
          icon={Target}
          title="No goals yet"
          subtitle="Declare a goal — name one, set a target, and every linked rupee starts meaning something."
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            <Plus size={16} />
            Add your first goal
          </button>
        </EmptyState>
        {showAddModal && (
          <AddGoalModal onClose={() => setShowAddModal(false)} onSave={(d) => { onAddGoal(d); setShowAddModal(false); }} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <p className="font-display text-4xl text-[#111827]">Goals</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-5 mb-6">
          {[
            { label: 'Active Goal', value: goals.length },
            { label: 'On Track', value: `${onTrackCount}/${goals.length}` },
            { label: 'Total Saved', value: fmt(totalSaved) },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[#ECEEF0] rounded-2xl shadow-[0_1px_2px_rgba(16,24,40,0.04)] px-6 py-5">
              <p className="text-[11px] uppercase tracking-wide text-[#9ca3af] font-medium mb-2">{label}</p>
              <p className="text-2xl font-bold text-[#111827]">{value}</p>
            </div>
          ))}
        </div>
      )}

      {shouldShowSip && (
        <div className="border border-dashed border-[#0E3F2E]/40 bg-[#F0F7F3] rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#111827]">₹10,000 goes to your index fund SIP every month</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">₹30,000 over 3 months. Track it as a goal?</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onDismissSip}
              className="px-4 py-2 bg-white border border-[#e5e7eb] text-sm font-medium text-[#374151] rounded-lg hover:bg-[#f9fafb] transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={() => {
                onAcceptSip({ name: 'SIP Index fund', target: 120000, saved: 30000, monthly: 10000, linked: [], detected: true });
                onDismissSip();
              }}
              className="px-4 py-2 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
            >
              Make it a goal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onEdit={() => setEditingGoal(goal)} />
        ))}
      </div>

      {showAddModal && (
        <AddGoalModal onClose={() => setShowAddModal(false)} onSave={(d) => { onAddGoal(d); setShowAddModal(false); }} />
      )}

      {editingGoal && (
        <AddGoalModal
          initial={editingGoal}
          onClose={() => setEditingGoal(null)}
          onSave={(d) => { onUpdateGoal(d); setEditingGoal(null); }}
          onDelete={(id) => { onDeleteGoal(id); setEditingGoal(null); }}
        />
      )}
    </div>
  );
}
