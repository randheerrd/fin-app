import { useState } from 'react';

export default function StepGoalSetup({ onAction }) {
  const [goalName, setGoalName] = useState('');
  const [target, setTarget] = useState('');
  const [income, setIncome] = useState('75000');

  const handleContinue = () => {
    if (goalName && target) {
      onAction('continue');
    }
  };

  const handleSkip = () => {
    onAction('skip');
  };

  return (
    <div className="max-w-md w-full px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">What are you saving for?</h1>
        <p className="text-text-dim">Name your goal. We'll track progress when you connect your bank.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm text-text-dim mb-2">Goal name</label>
          <input
            autoFocus
            type="text"
            placeholder="Goa trip, new laptop, etc."
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full bg-bg-card border border-line rounded-lg px-4 py-3 text-text-primary placeholder-text-faint outline-none focus:border-sage"
          />
        </div>

        <div>
          <label className="block text-sm text-text-dim mb-2">Target amount</label>
          <div className="flex items-center bg-bg-card border border-line rounded-lg px-4 py-3">
            <span className="text-2xl text-text-dim">₹</span>
            <input
              type="number"
              placeholder="100000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1 ml-2 bg-transparent text-xl text-text-primary outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text-dim mb-2">Monthly income</label>
          <div className="flex items-center bg-bg-card border border-line rounded-lg px-4 py-3">
            <span className="text-2xl text-text-dim">₹</span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="flex-1 ml-2 bg-transparent text-xl text-text-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleContinue}
          disabled={!goalName || !target}
          className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Connect bank to import expenses
        </button>
        <button
          onClick={handleSkip}
          className="w-full border border-line text-text-primary py-3 rounded-lg font-medium hover:bg-bg-card transition-colors"
        >
          Track goal manually instead
        </button>
      </div>
    </div>
  );
}
