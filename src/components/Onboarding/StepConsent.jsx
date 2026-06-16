import { ChevronLeft, Lock } from 'lucide-react';

const CONSENT_ROWS = [
  { label: "What's shared", value: 'Transactions only' },
  { label: 'Time period', value: 'Last 6 months' },
  { label: 'Refreshed', value: 'Daily' },
  { label: 'Valid until', value: 'You revoke' },
  { label: 'We can see', value: 'Transactions only' },
];

export default function StepConsent({ onAccept, onBack }) {
  return (
    <div className="max-w-md w-full px-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-text-dim hover:text-text-primary mb-8 transition-colors"
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </button>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Allow access</h1>
        <p className="text-text-dim">Your bank will ask you to confirm this access</p>
      </div>

      <div className="bg-bg-card border border-line rounded-lg overflow-hidden mb-8">
        <div className="divide-y divide-line">
          {CONSENT_ROWS.map((row, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <span className="text-sm text-text-dim">{row.label}</span>
              <span className="text-sm font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg-card border border-line rounded-lg p-4 mb-8 space-y-2">
        <div className="flex items-start gap-3">
          <Lock size={16} className="text-sage mt-1 flex-shrink-0" />
          <div className="text-xs text-text-dim">
            <p className="font-medium text-text-primary mb-1">🔒 Encrypted & read-only</p>
            <p>256-bit encryption. We can see transactions, never move money. Revoke anytime.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onAccept}
        className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors"
      >
        Allow & connect
      </button>
    </div>
  );
}
