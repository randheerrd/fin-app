import { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import AddGoalModal from './AddGoalModal';
import GoalCard from './GoalCard';
import EmptyState from '../EmptyState';
import InfoTip from '../InfoTip';
import { goalProjection, effectiveSaved } from '../../lib/goalMath';

const fmt = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// One-tap starter goals — open the form prefilled so the empty state is actionable.
const GOAL_TEMPLATES = [
  { emoji: '🛟', name: 'Emergency Fund', target: 200000, monthly: 16000 },
  { emoji: '✈️', name: 'Vacation', target: 80000, monthly: 8000 },
  { emoji: '💻', name: 'New Laptop', target: 90000, monthly: 7500 },
  { emoji: '📱', name: 'New Phone', target: 70000, monthly: 7000 },
];

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
  const [prefill, setPrefill] = useState(null);

  const openTemplate = (tpl) => {
    setPrefill(tpl);
    setShowAddModal(true);
  };
  const closeAdd = () => {
    setShowAddModal(false);
    setPrefill(null);
  };

  const onTrackCount = goals.filter(
    (g) => goalProjection({ ...g, saved: effectiveSaved(g, transactions) }).status !== 'at-risk'
  ).length;

  const totalSaved = goals.reduce((s, g) => s + effectiveSaved(g, transactions), 0);
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
            onClick={() => { setPrefill(null); setShowAddModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            <Plus size={16} />
            Add your first goal
          </button>

          <p className="text-xs text-[#9ca3af] mt-7 mb-3">Or start from a template</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {GOAL_TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => openTemplate(tpl)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#e5e7eb] bg-white text-sm text-[#374151] hover:border-[#0E3F2E] hover:bg-[#F0F7F3] transition-colors"
              >
                <span>{tpl.emoji}</span>
                {tpl.name}
                <span className="text-xs text-[#9ca3af]">{fmt(tpl.target)}</span>
              </button>
            ))}
          </div>
        </EmptyState>
        {showAddModal && (
          <AddGoalModal
            initial={prefill}
            forceCreate={!!prefill}
            onClose={closeAdd}
            onSave={(d) => { onAddGoal(d); closeAdd(); }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white px-8 py-7">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <p className="font-display text-4xl text-[#111827]">Goals</p>
          <InfoTip size={18}>
            <p className="text-sm font-semibold text-[#111827] mb-2">How a goal is tracked</p>
            <p className="mb-2">
              <span className="font-medium text-[#374151]">Saved</span> = your starting balance plus auto-savings from the
              categories linked to the goal.
            </p>
            <p className="mb-2">
              <span className="font-medium text-[#374151]">Auto-savings</span> — for each linked category we take your usual
              monthly spend (its historical average). Any month you spend below that, the difference is credited toward the goal.
            </p>
            <p>
              <span className="font-medium text-[#374151]">On pace / At risk</span> — we divide what's left by your monthly
              amount and compare the finish date to your deadline.
            </p>
          </InfoTip>
        </div>
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
          <GoalCard key={goal.id} goal={goal} transactions={transactions} onEdit={() => setEditingGoal(goal)} />
        ))}
      </div>

      {showAddModal && (
        <AddGoalModal
          initial={prefill}
          forceCreate={!!prefill}
          onClose={closeAdd}
          onSave={(d) => { onAddGoal(d); closeAdd(); }}
        />
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
