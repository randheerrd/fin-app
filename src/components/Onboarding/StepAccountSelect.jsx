import { ChevronLeft } from 'lucide-react';

export default function StepAccountSelect({
  accounts,
  selected,
  onToggle,
  onContinue,
  onBack,
}) {
  const selectedCount = selected.filter(Boolean).length;

  return (
    <div className="max-w-md w-full px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-dim hover:text-text-primary mb-8 transition-colors"
      >
        <ChevronLeft size={18} />
        <span>Use a different number</span>
      </button>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Select accounts</h1>
        <p className="text-text-dim">We found {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-3 mb-8">
        {accounts.map((acc, i) => (
          <button
            key={i}
            onClick={() => onToggle(i)}
            className="w-full p-4 bg-bg-card border-2 rounded-lg transition-colors text-left"
            style={{
              borderColor: selected[i] ? '#9db89a' : '#2a2b30',
              backgroundColor: selected[i] ? '#46604a20' : '#1c1d21',
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-text-primary">{acc.bank}</p>
                <p className="text-sm text-text-dim">{acc.type}</p>
                <p className="text-xs text-text-faint mt-1">{acc.mask}</p>
              </div>
              <div
                className="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: selected[i] ? '#9db89a' : '#2a2b30',
                  backgroundColor: selected[i] ? '#9db89a' : 'transparent',
                }}
              >
                {selected[i] && <span className="text-bg text-sm font-bold">✓</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onContinue}
        disabled={selectedCount === 0}
        className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue with {selectedCount} account{selectedCount !== 1 ? 's' : ''}
      </button>
    </div>
  );
}
