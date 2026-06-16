import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';

const BANK_COLORS = { hdfc: '#ED232A', axis: '#97144D', icici: '#F58220' };
function bankColor(name = '') {
  const key = Object.keys(BANK_COLORS).find((k) => name.toLowerCase().includes(k));
  return key ? BANK_COLORS[key] : '#0E3F2E';
}

export default function StepAccountSelect({ accounts, selected, onToggle, onContinue, onBack }) {
  const selectedCount = selected.filter(Boolean).length;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#111827] mb-2">We found these</h1>
        <p className="text-sm text-[#6b7280]">
          Discovered on the AA network. Pick what you want FinApp to read.
        </p>
      </div>

      <p className="text-sm font-medium text-[#374151] mb-3">Bank account</p>

      <div className="space-y-3 mb-5">
        {accounts.map((acc, i) => (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
              selected[i] ? 'border-[#0E3F2E]' : 'border-[#e5e7eb] hover:border-[#9ca3af]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                selected[i] ? 'bg-[#0E3F2E]' : 'border border-[#d1d5db]'
              }`}
            >
              {selected[i] && <Check size={13} className="text-white" strokeWidth={3} />}
            </span>
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white"
              style={{ backgroundColor: bankColor(acc.bank) }}
            >
              {(acc.bank || '?').charAt(0)}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#111827]">
                {acc.bank} · {acc.type}
              </span>
              <span className="block text-xs text-[#9ca3af] truncate">
                Sample description of the app and its capabilities will appear here.
              </span>
            </span>
          </button>
        ))}
      </div>

      <button className="flex items-center gap-1.5 text-sm text-[#374151] hover:text-[#111827] mb-10">
        <Plus size={15} className="text-[#9ca3af]" />
        Add another
      </button>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onContinue}
            className="px-5 py-2.5 bg-white border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onContinue}
            disabled={selectedCount === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
