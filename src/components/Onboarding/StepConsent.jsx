import { ArrowLeft, Lock, Eye, RefreshCw, Clock, Shield } from 'lucide-react';

export default function StepConsent({ onAccept, onBack }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Here's exactly what you're sharing</h1>
        <p className="text-[#6b7280] text-sm">Plain language, no fine print. This is the whole consent.</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { icon: Eye, label: "What's shared", value: 'Transactions only' },
          { icon: Clock, label: 'Time period', value: 'Last 6 months' },
          { icon: RefreshCw, label: 'Refreshed', value: 'Daily' },
          { icon: Shield, label: 'We can see', value: 'Transactions only' },
        ].map(({ icon: Icon, label, value }, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[#f3f4f6] last:border-0">
            <div className="flex items-center gap-3">
              <Icon size={15} className="text-[#9ca3af]" />
              <span className="text-sm text-[#6b7280]">{label}</span>
            </div>
            <span className="text-sm font-medium text-[#111827]">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#9ca3af] text-center mb-8 flex items-center justify-center gap-1.5">
        <Lock size={11} />
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
          className="px-5 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
        >
          Allow & connect
        </button>
      </div>
    </div>
  );
}
