import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { groupINR, digitsOnly } from '../../lib/utils';

export default function StepTrackSetup({ onAction }) {
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState('');

  const incomeNum = parseInt(income.replace(/,/g, ''), 10) || 0;
  const budgetNum = parseInt(budget.replace(/,/g, ''), 10) || 0;
  const canContinue = incomeNum > 0 && budgetNum > 0; // both required to proceed

  const handleContinue = () => {
    if (!canContinue) return;
    onAction('continue', { income: incomeNum, budget: budgetNum });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#111827] mb-2">Two numbers to Start</h1>
        <p className="text-[#6b7280] text-sm">These anchor your dashboard , you can change them anytime in settings</p>
      </div>

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Income</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1,00,000"
            value={groupINR(income)}
            onChange={(e) => setIncome(digitsOnly(e.target.value))}
            className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[#111827] text-sm placeholder-[#9ca3af] focus:border-[#0E3F2E] focus:ring-1 focus:ring-[#0E3F2E]/20 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Monthly Budget</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="50,000"
            value={groupINR(budget)}
            onChange={(e) => setBudget(digitsOnly(e.target.value))}
            className="w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[#111827] text-sm placeholder-[#9ca3af] focus:border-[#0E3F2E] focus:ring-1 focus:ring-[#0E3F2E]/20 transition-colors"
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
          disabled={!canContinue}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
