import { AlertCircle } from 'lucide-react';

export default function StepNoAccounts({ onTryAgain, onManual }) {
  return (
    <div className="max-w-md w-full px-4">
      <div className="mb-8 flex justify-center">
        <div className="p-4 bg-amber/20 rounded-lg">
          <AlertCircle className="text-amber" size={32} />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">No accounts found</h1>
        <p className="text-text-dim">We didn't find any accounts linked to this phone number. Try a different number or add expenses manually.</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onTryAgain}
          className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors"
        >
          Try another number
        </button>
        <button
          onClick={onManual}
          className="w-full border border-line text-text-primary py-3 rounded-lg font-medium hover:bg-bg-card transition-colors"
        >
          Start manually instead
        </button>
      </div>
    </div>
  );
}
