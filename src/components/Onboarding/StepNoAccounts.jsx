import { AlertCircle } from 'lucide-react';

export default function StepNoAccounts({ onTryAgain, onManual }) {
  return (
    <div className="text-center py-4">
      <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="text-amber-500" size={22} />
      </div>

      <h1 className="font-display text-4xl text-[#111827] mb-2">No accounts found</h1>
      <p className="text-[#6b7280] text-sm mb-8">
        We didn't find any accounts linked to this number. Try a different number or add expenses manually.
      </p>

      <div className="space-y-3">
        <button
          onClick={onTryAgain}
          className="w-full py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
        >
          Try another number
        </button>
        <button
          onClick={onManual}
          className="w-full py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
        >
          Start manually instead
        </button>
      </div>
    </div>
  );
}
