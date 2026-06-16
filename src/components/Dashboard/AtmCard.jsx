import { Zap } from 'lucide-react';

export default function AtmCard({ remaining, onSplit }) {
  return (
    <div className="bg-amber/10 border border-amber rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-dim text-sm mb-2">Untracked cash</p>
          <p className="font-serif text-3xl text-text-primary mb-2">
            ₹{remaining.toLocaleString('en-IN')}
          </p>
          <p className="text-text-faint text-xs">From ATM withdrawal. Split it so your month adds up.</p>
        </div>
      </div>
      <button
        onClick={onSplit}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber text-bg rounded-lg font-medium hover:bg-amber/90 transition-colors"
      >
        <Zap size={16} />
        Split it
      </button>
    </div>
  );
}
