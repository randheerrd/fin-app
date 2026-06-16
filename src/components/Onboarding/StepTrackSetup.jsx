import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function StepTrackSetup({ onAction }) {
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState('');

  const handleContinue = () => {
    onAction('continue', {
      income: parseInt(income.replace(/,/g, '')) || 100000,
      budget: parseInt(budget.replace(/,/g, '')) || 50000,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Two numbers to Start</h1>
        <p className="text-[#6b7280] text-sm">These anchor your dashboard , you can change them anytime in settings</p>
      </div>

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Income</label>
          <input
            type="text"
            placeholder="1,00,000"
            value={income}
            onChange={(e) => setIncome(e.target.value.replace(/[^\d,]/g, ''))}
            className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[#111827] text-sm placeholder-[#9ca3af] focus:border-[#1B3A2F] focus:ring-1 focus:ring-[#1B3A2F]/20 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Budget</label>
          <input
            type="text"
            placeholder="50,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^\d,]/g, ''))}
            className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[#111827] text-sm placeholder-[#9ca3af] focus:border-[#1B3A2F] focus:ring-1 focus:ring-[#1B3A2F]/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => onAction('skip')}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleContinue}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
