import { useState } from 'react';
import { Trash2, Link } from 'lucide-react';

export default function Settings({
  income,
  setIncome,
  budget,
  setBudget,
  banks,
  setBanks,
  transactions,
  setTransactions,
  manualMode,
  onLinkBank,
}) {
  const [incomeInput, setIncomeInput] = useState(income.toString());
  const [budgetInput, setBudgetInput] = useState(budget.toString());
  const [removeConfirm, setRemoveConfirm] = useState(null);

  const handleSaveNumbers = () => {
    setIncome(parseFloat(incomeInput) || income);
    setBudget(parseFloat(budgetInput) || budget);
  };

  const handleRemoveBank = (idx) => {
    setBanks(prev => prev.filter((_, i) => i !== idx));
    setRemoveConfirm(null);
  };

  return (
    <div className="p-8 bg-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl text-text-primary mb-8">Settings</h1>

        {/* Linked accounts */}
        <div className="bg-bg-card border border-line rounded-lg p-6 mb-8">
          <h3 className="font-medium text-text-primary mb-4">Linked accounts</h3>
          {banks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-dim mb-4">No bank connected</p>
              <button
                onClick={onLinkBank}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage text-bg rounded-lg font-medium hover:bg-sage/90 transition-colors"
              >
                <Link size={18} />
                Link a bank
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {banks.map((bank, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-bg rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">{bank.name}</p>
                    <p className="text-text-faint text-sm">{bank.type} {bank.mask}</p>
                  </div>
                  <button
                    onClick={() => setRemoveConfirm(idx)}
                    className="p-2 hover:bg-bg-raise rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-rose" />
                  </button>
                </div>
              ))}
              <button
                onClick={onLinkBank}
                className="w-full mt-4 px-4 py-2 border border-line text-text-primary rounded-lg font-medium hover:bg-bg-raise transition-colors"
              >
                + Link another bank
              </button>
            </div>
          )}
        </div>

        {/* Monthly numbers */}
        <div className="bg-bg-card border border-line rounded-lg p-6 mb-8">
          <h3 className="font-medium text-text-primary mb-4">Monthly numbers</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-dim mb-2">Monthly income</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-bg border border-line rounded-lg px-4 py-2 flex-1">
                  <span className="text-text-dim">₹</span>
                  <input
                    type="number"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    className="flex-1 ml-2 bg-transparent text-text-primary outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-dim mb-2">Spending budget</label>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-bg border border-line rounded-lg px-4 py-2 flex-1">
                  <span className="text-text-dim">₹</span>
                  <input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="flex-1 ml-2 bg-transparent text-text-primary outline-none"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveNumbers}
              className="w-full bg-sage text-bg py-2 rounded-lg font-medium hover:bg-sage/90 transition-colors"
            >
              Save & recalculate
            </button>
          </div>
        </div>

        {/* Data & privacy */}
        <div className="bg-bg-card border border-line rounded-lg p-6">
          <h3 className="font-medium text-text-primary mb-4">Data & privacy</h3>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-bg rounded-lg hover:bg-bg-raise transition-colors">
              <p className="font-medium text-text-primary">Export my data</p>
              <p className="text-text-faint text-sm mt-1">A full CSV of every transaction, yours to keep.</p>
            </button>
            <button
              onClick={() => {
                if (confirm('Delete all transactions? This cannot be undone.')) {
                  setTransactions([]);
                }
              }}
              className="w-full text-left p-4 bg-bg rounded-lg hover:bg-bg-raise transition-colors"
            >
              <p className="font-medium text-rose">Delete all transactions</p>
              <p className="text-text-faint text-sm mt-1">Separate from bank management, destructive actions never sit beside frequent ones.</p>
            </button>
          </div>
        </div>

        {/* Remove bank confirmation */}
        {removeConfirm !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card border border-line rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="font-medium text-text-primary mb-4">Remove bank?</h3>
                <p className="text-text-dim text-sm mb-6">
                  No new transactions will be imported. Your {transactions.length} existing transactions stay intact.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setRemoveConfirm(null)}
                    className="w-full border border-line text-text-primary py-2 rounded-lg font-medium hover:bg-bg-raise transition-colors"
                  >
                    Keep & don't remove
                  </button>
                  <button
                    onClick={() => handleRemoveBank(removeConfirm)}
                    className="w-full bg-rose text-bg py-2 rounded-lg font-medium hover:bg-rose/90 transition-colors"
                  >
                    Remove bank
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
