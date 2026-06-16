import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
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
    const progress = g.saved / g.target * 100;
    return progress >= (g.detected ? 20 : 55);
  }).length;

  const totalSaved = goals.reduce((sum, g) => sum + (g.saved || 0), 0);

  // SIP suggestion
  const shouldShowSip = !sipDismissed && transactions.length > 0;

  if (goals.length === 0 && !shouldShowSip) {
    return (
      <div className="p-8 bg-bg min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl text-text-primary mb-8">Goals</h1>
          <div className="bg-bg-card border border-line rounded-lg p-12 text-center">
            <p className="text-text-dim mb-6">
              Goals are yours to declare — the app can't guess a Goa trip from a bank statement. Name one, and every linked rupee starts meaning something.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              <Plus size={18} />
              Add your first goal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-4xl text-text-primary">Goals</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
          >
            <Plus size={18} />
            Add goal
          </button>
        </div>

        {/* Summary stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-card border border-line rounded-lg p-4">
              <p className="text-text-faint text-xs mb-1">Active goals</p>
              <p className="font-serif text-2xl text-text-primary">{goals.length}</p>
            </div>
            <div className="bg-bg-card border border-line rounded-lg p-4">
              <p className="text-text-faint text-xs mb-1">On track</p>
              <p className="font-serif text-2xl text-text-primary">{onTrackCount} of {goals.length}</p>
            </div>
            <div className="bg-bg-card border border-line rounded-lg p-4">
              <p className="text-text-faint text-xs mb-1">Total saved</p>
              <p className="font-serif text-2xl text-text-primary">₹{totalSaved.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}

        {/* SIP suggestion */}
        {shouldShowSip && (
          <div className="bg-bg-card border border-sage rounded-lg p-6 mb-8">
            <p className="text-text-primary mb-4">
              From your bank history: <strong>₹10,000</strong> goes to your index fund SIP every month — <strong>₹30,000 over 3 months</strong>. Track it as a goal?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onAcceptSip({
                    name: 'SIP Index fund',
                    target: 120000,
                    saved: 30000,
                    monthly: 10000,
                    linked: [],
                    detected: true,
                  });
                  onDismissSip();
                }}
                className="flex-1 bg-sage text-bg py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={onDismissSip}
                className="flex-1 border border-line text-text-primary py-2 rounded-lg font-medium hover:bg-bg-raise transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Goals list */}
        <div className="space-y-4">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>

      {/* Add goal modal */}
      {showAddModal && (
        <AddGoalModal
          onClose={() => setShowAddModal(false)}
          onSave={(data) => {
            onAddGoal(data);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
