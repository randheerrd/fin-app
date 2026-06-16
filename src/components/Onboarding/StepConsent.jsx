import { ArrowLeft, Lock } from 'lucide-react';

const ROWS = [
  { label: "What's shared", value: 'Transaction history', tone: 'amber' },
  { label: 'Time period', value: 'Last 6 months', tone: 'amber' },
  { label: 'Refreshed', value: 'Daily', tone: 'amber' },
  { label: 'Valid until', value: 'You revoke it', tone: 'amber' },
  { label: 'We can see', value: 'Transactions only (no balance or credentials)', tone: 'green' },
];

const TONES = {
  amber: { bg: '#FBF1E5', text: '#B45309' },
  green: { bg: '#E7F5EE', text: '#15803D' },
};

export default function StepConsent({ onAccept, onBack }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl text-[#111827] mb-2">Here's exactly what you're sharing</h2>
          <p className="text-sm text-[#6b7280]">Plain language, no fine print. This is the whole consent.</p>
        </div>

        <div className="border border-[#e5e7eb] rounded-xl overflow-hidden mb-4">
          {ROWS.map((r, i) => {
            const tone = TONES[r.tone];
            return (
              <div
                key={r.label}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i > 0 ? 'border-t border-[#f3f4f6]' : ''
                }`}
              >
                <span className="text-sm font-medium text-[#111827]">{r.label}</span>
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: tone.bg, color: tone.text }}
                >
                  {r.value}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-[#9ca3af] flex items-center gap-1.5 mb-8">
          <Lock size={12} />
          This is encrypted · Read-only · Revoke anytime in Settings
        </p>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={onAccept}
            className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            Allow &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
}
