import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function StepTrackSetup({ onAction }) {
  const [income, setIncome] = useState('100,000');
  const [budget, setBudget] = useState('50,000');

  const handleContinue = () => {
    onAction('continue');
  };

  const handleSkip = () => {
    onAction('skip');
  };

  return (
    <div className="max-w-2xl w-full px-8">
      <div className="flex justify-center gap-2 mb-12">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-accent' : 'bg-bg-border'}`} />
        ))}
      </div>

      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">Two numbers to start</h1>
        <p className="text-text-secondary">These anchor your dashboard. You can change them anytime in settings.</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm text-text-secondary font-medium mb-3">Monthly Income</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="w-full px-4 py-3 border-2 border-bg-border rounded-lg text-text-primary outline-none focus:border-accent bg-white"
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary font-medium mb-3">Monthly Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 border-2 border-bg-border rounded-lg text-text-primary outline-none focus:border-accent bg-white"
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleContinue}
          className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
        >
          Connect → Continue
        </button>
        <button
          onClick={handleSkip}
          className="w-full border-2 border-bg-border text-text-primary py-3 rounded-lg font-semibold hover:bg-bg-secondary transition-colors"
        >
          Start manually instead
        </button>
      </div>
    </div>
  );
}
