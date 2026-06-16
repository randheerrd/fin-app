import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function StepTrackSetup({ onAction }) {
  const [income, setIncome] = useState('75000');
  const [budget, setBudget] = useState('45000');

  const handleContinue = () => {
    onAction('continue');
  };

  const handleSkip = () => {
    onAction('skip');
  };

  return (
    <div className="max-w-md w-full px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Set income & budget</h1>
        <p className="text-text-dim">Connect your bank to import real spending. Or we'll help you get started.</p>
      </div>

      <div className="space-y-6 mb-8">
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

        <div>
          <label className="block text-sm text-text-dim mb-2">Spending budget</label>
          <div className="flex items-center bg-bg-card border border-line rounded-lg px-4 py-3">
            <span className="text-2xl text-text-dim">₹</span>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1 ml-2 bg-transparent text-xl text-text-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors"
        >
          Connect bank to auto-import
        </button>
        <button
          onClick={handleSkip}
          className="w-full border border-line text-text-primary py-3 rounded-lg font-medium hover:bg-bg-card transition-colors"
        >
          Start manually instead
        </button>
      </div>
    </div>
  );
}
