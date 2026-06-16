import { useState } from 'react';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';

export default function StepMobileEntry({ onSubmit, onBack }) {
  const [mobile, setMobile] = useState('');

  const handleSubmit = () => {
    if (mobile.length === 10) {
      onSubmit(mobile);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Connect your bank</h1>
        <p className="text-[#6b7280] text-sm">
          The Account Aggregator finds your accounts by your registered mobile number,
          no hunting through a list of 50 banks.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#374151] mb-1.5">Mobile No.</label>
        <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F] focus-within:ring-1 focus-within:ring-[#1B3A2F]/20 transition-colors">
          <span className="pl-4 pr-2 py-2.5 text-[#6b7280] text-sm select-none">+91</span>
          <input
            autoFocus
            type="tel"
            maxLength="10"
            placeholder="9876543210"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 pr-4 py-2.5 text-[#111827] text-sm placeholder-[#9ca3af] outline-none bg-transparent"
          />
        </div>
        <p className="text-[#9ca3af] text-xs mt-2 flex items-center gap-1">
          <Lock size={11} />
          Read-only access · RBI-regulated AA network · Your credentials never touch our servers
        </p>
      </div>

      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        ) : <div />}
        <button
          onClick={handleSubmit}
          disabled={mobile.length !== 10}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Find my account
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
