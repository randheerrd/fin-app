import { Link } from 'lucide-react';

export default function Recurring({ recurring, income, manualMode, onLinkBank }) {
  if (manualMode && recurring.length === 0) {
    return (
      <div className="p-8 bg-bg min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl text-text-primary mb-8">Recurring</h1>
          <div className="bg-bg-card border border-line rounded-lg p-12 text-center">
            <p className="text-text-dim mb-6">Nothing recurring yet. Connect a bank to auto-detect repeating payments.</p>
            <button
              onClick={onLinkBank}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              <Link size={18} />
              Link a bank
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalRecurring = recurring.reduce((sum, r) => sum + r.amount, 0);
  const percentOfIncome = (totalRecurring / income) * 100;

  return (
    <div className="p-8 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-text-primary mb-8">Recurring</h1>

        {/* Summary */}
        <div className="bg-bg-card border border-line rounded-lg p-6 mb-8">
          <p className="text-text-dim">
            <strong className="text-text-primary">₹{totalRecurring.toLocaleString('en-IN')}</strong> is committed every month — <strong>{Math.round(percentOfIncome)}%</strong> of your income. The rest is yours to decide.
          </p>
        </div>

        {/* Recurring payments */}
        {recurring.length > 0 && (
          <div className="bg-bg-card border border-line rounded-lg overflow-hidden">
            <div className="divide-y divide-line">
              {recurring.map((item, idx) => (
                <div key={idx} className="p-6 flex justify-between items-center hover:bg-bg-raise transition-colors">
                  <div>
                    <p className="font-medium text-text-primary">{item.name}</p>
                    <p className="text-text-faint text-sm mt-1">Every month on the {item.day}</p>
                  </div>
                  <p className="font-medium text-text-primary">₹{item.amount.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
