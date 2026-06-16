import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

export default function StepAccountSelect({
  accounts,
  selected,
  onToggle,
  onContinue,
  onBack,
}) {
  const selectedCount = selected.filter(Boolean).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">We found these</h1>
        <p className="text-[#6b7280] text-sm">
          Discovered on the AA network for +91{accounts[0]?.mobile || ''}. Pick what you want FinApp to read.
        </p>
      </div>

      <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wide mb-3">Bank account</p>

      <div className="space-y-2 mb-8">
        {accounts.map((acc, i) => (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className={`w-full p-4 rounded-lg border text-left flex items-center justify-between transition-all ${
              selected[i]
                ? 'border-[#1B3A2F] bg-[#1B3A2F]/5'
                : 'border-[#e5e7eb] bg-white hover:border-[#9ca3af]'
            }`}
          >
            <div>
              <p className="font-medium text-[#111827] text-sm">{acc.bank}</p>
              <p className="text-[#6b7280] text-xs mt-0.5">{acc.type}</p>
              <p className="text-[#9ca3af] text-xs mt-0.5">{acc.mask}</p>
            </div>
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                selected[i]
                  ? 'bg-[#1B3A2F] border-[#1B3A2F]'
                  : 'border-[#d1d5db]'
              }`}
            >
              {selected[i] && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-[#6b7280] mb-6">Completed</p>

      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={onContinue}
          disabled={selectedCount === 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
