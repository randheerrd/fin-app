import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { bankBrand } from '../../lib/logos';
import AddBankModal from '../modals/AddBankModal';

export default function StepAccountSelect({ accounts, selected, onToggle, onContinue, onSkip, onBack, onAddAnother }) {
  const [showAdd, setShowAdd] = useState(false);
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
            <BrandLogo domain={bankBrand(acc.bank).domain} label={acc.bank} bg={bankBrand(acc.bank).bg} size={40} />

            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#111827]">
                {acc.bank} · {acc.type}
              </span>
              <span className="block text-xs text-[#9ca3af] tabular-nums">
                A/C No. ···· {(acc.mask || '').replace(/\D/g, '') || '••••'}
              </span>
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="flex items-center gap-1.5 text-sm text-[#374151] hover:text-[#111827] mb-10"
      >
        <Plus size={15} className="text-[#9ca3af]" />
        Add another
      </button>

      {showAdd && (
        <AddBankModal
          onClose={() => setShowAdd(false)}
          onAdd={(data) => {
            onAddAnother(data);
            setShowAdd(false);
          }}
        />
      )}

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
            onClick={onSkip}
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
