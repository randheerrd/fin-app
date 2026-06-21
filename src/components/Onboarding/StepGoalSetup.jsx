import { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, Check, AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import MonthYearPicker from '../MonthYearPicker';
import { parseMonthYear, fmtMonth, goalInsight } from '../../lib/goalMath';
import { groupINR, digitsOnly } from '../../lib/utils';

export default function StepGoalSetup({ onAction }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [linked, setLinked] = useState([]);

  const toggle = (id) => setLinked((p) => (p.includes(id) ? p.filter((c) => c !== id) : [...p, id]));

  const handleContinue = () => {
    if (!name || !target) return;
    onAction('continue', {
      goal: {
        name,
        target: parseFloat(target) || 0,
        saved: 0,
        deadline: parseMonthYear(deadline) ? fmtMonth(parseMonthYear(deadline)) : '',
        linked,
      },
    });
  };

  const inputClass =
    'w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]';

  // Reality-check: target + deadline → the monthly it'll take.
  const today = new Date();
  const insight = goalInsight(target, deadline);

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#111827] mb-2">What are you saving for?</h1>
        <p className="text-[#6b7280] text-sm">Name a goal — every linked rupee starts working toward it.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Goal Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vietnam Trip"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Target Amount</label>
          <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E]">
            <span className="pl-3.5 text-[#9ca3af] text-sm">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={groupINR(target)}
              onChange={(e) => setTarget(digitsOnly(e.target.value))}
              placeholder="60,000"
              className="flex-1 px-2 py-3 text-sm text-[#111827] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1.5">Deadline</label>
          <MonthYearPicker
            value={deadline}
            onChange={setDeadline}
            min={today}
            placeholder="Select month"
            className={`${inputClass} text-left`}
          />
          {insight && (
            <p
              className={`mt-2 text-xs flex items-start gap-1.5 ${
                insight.tone === 'ok' ? 'text-[#15803D]' : 'text-[#B45309]'
              }`}
            >
              {insight.tone === 'ok' ? (
                <Check size={13} className="mt-px flex-shrink-0" />
              ) : (
                <AlertTriangle size={13} className="mt-px flex-shrink-0" />
              )}
              {insight.text}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2.5">Link spending categories (optional)</label>
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.filter((c) => c.id !== 'cash').map((cat) => {
              const active = linked.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggle(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-colors ${
                    active
                      ? 'bg-[#0E3F2E] border-[#0E3F2E] text-white'
                      : 'bg-white border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
                  }`}
                >
                  {active ? <Check size={14} /> : <Plus size={14} className="text-[#9ca3af]" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => onAction('skip')}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!name || !target}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
