import { Link } from 'lucide-react';

export default function Insights({ transactions, manualMode, income, goals, onLinkBank }) {
  const hasEnoughData = transactions.length >= 7;

  if (!hasEnoughData) {
    return (
      <div className="p-8 bg-bg min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl text-text-primary mb-8">Insights</h1>
          <div className="bg-bg-card border border-line rounded-lg p-12 text-center">
            <p className="text-text-dim mb-6">Insights need a little history. Log expenses for about a week and patterns appear here.</p>
            {manualMode && (
              <button
                onClick={onLinkBank}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
              >
                <Link size={18} />
                Or connect your bank — six months of history means insights from day one.
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = transactions
    .filter(t => !t.atm)
    .reduce((sum, t) => sum + t.amount, 0);

  const avgDaily = totalSpent / transactions.length;

  return (
    <div className="p-8 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-text-primary mb-8">Insights</h1>

        <div className="space-y-4">
          <div className="bg-bg-card border border-line rounded-lg p-6">
            <p className="font-serif text-lg text-text-primary mb-2">
              You're averaging <span className="text-sage">₹{avgDaily.toLocaleString('en-IN')}</span> per day so far.
            </p>
            <p className="text-text-faint text-sm">Based on {transactions.length} recent transactions</p>
          </div>

          {goals.length > 0 && (
            <div className="bg-bg-card border border-line rounded-lg p-6">
              <p className="font-serif text-lg text-text-primary mb-2">
                You have <span className="text-sage">{goals.length} goal{goals.length !== 1 ? 's' : ''}</span> tracking how your spending maps to what matters.
              </p>
              <p className="text-text-faint text-sm">
                {goals.filter(g => {
                  if (g.isNew) return true;
                  const progress = g.saved / g.target * 100;
                  return progress >= 55;
                }).length} on track
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
