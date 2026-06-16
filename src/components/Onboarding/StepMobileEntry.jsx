import { useState } from 'react';
import { ChevronLeft, Lock } from 'lucide-react';

export default function StepMobileEntry({ onSubmit, onBack }) {
  const [mobile, setMobile] = useState('');

  const handleSubmit = () => {
    if (mobile.length === 10) {
      onSubmit(mobile);
    }
  };

  return (
    <div className="max-w-md w-full px-4">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-dim hover:text-text-primary mb-8 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back to setup</span>
        </button>
      )}

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Link your bank</h1>
        <p className="text-text-dim text-sm">Enter your phone number linked to your bank account</p>
        <p className="text-text-faint text-xs mt-2">💡 End with 0000 to see the no-accounts state</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm text-text-dim mb-2">Phone number</label>
          <div className="flex items-center gap-2 bg-bg-card border border-line rounded-lg px-4 py-3">
            <span className="text-lg text-text-dim">+91</span>
            <input
              autoFocus
              type="tel"
              maxLength="10"
              placeholder="9876543210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="flex-1 bg-transparent text-lg text-text-primary outline-none"
            />
          </div>
          <p className="text-xs text-text-faint mt-2">{mobile.length}/10 digits</p>
        </div>
      </div>

      <div className="bg-bg-card border border-line rounded-lg p-4 mb-8 space-y-2">
        <div className="flex items-start gap-3">
          <Lock size={16} className="text-sage mt-1 flex-shrink-0" />
          <div className="text-xs text-text-dim">
            <p className="font-medium text-text-primary mb-1">🔒 Read-only access</p>
            <p>RBI-regulated Account Aggregator network. Your credentials never touch our servers.</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={mobile.length !== 10}
        className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
