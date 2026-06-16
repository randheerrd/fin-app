import { Zap } from 'lucide-react';

export default function AtmCard({ remaining, onSplit }) {
  return (
    <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/50 rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-text-tertiary text-sm font-medium mb-2">Untracked Cash</p>
          <p className="font-serif text-3xl text-amber-400 font-bold mb-2">
            ₹{remaining.toLocaleString('en-IN')}
          </p>
          <p className="text-text-secondary text-sm">From ATM withdrawal. Split it so your month adds up.</p>
        </div>
      </div>
      <button
        onClick={onSplit}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-bg rounded-lg font-semibold transition-all duration-200 shadow-md"
      >
        <Zap size={18} />
        Split Cash
      </button>
    </div>
  );
}
