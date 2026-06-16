import { useState } from 'react';
import { Trash2, Link, Bell, Lock } from 'lucide-react';

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
    <div className="min-h-screen bg-white px-8 py-7">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#1B3A2F] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">RK</span>
        </div>
        <div>
          <p className="font-bold text-[#111827]">Randheer Kumar</p>
          <p className="text-sm text-[#9ca3af]">Member since June 2026</p>
        </div>
      </div>

      <div className="max-w-xl space-y-5">
        {/* Notifications */}
        <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f3f4f6] flex items-center gap-2">
            <Bell size={15} className="text-[#6b7280]" />
            <p className="text-sm font-semibold text-[#111827]">Notifications</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-[#6b7280]">Push notification settings coming soon.</p>
          </div>
        </div>

        {/* Linked accounts */}
        <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f3f4f6] flex items-center gap-2">
            <Link size={15} className="text-[#6b7280]" />
            <p className="text-sm font-semibold text-[#111827]">Linked Accounts</p>
          </div>
          <div className="px-5 py-4">
            {banks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-[#9ca3af] text-sm mb-4">No bank connected</p>
                <button
                  onClick={onLinkBank}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
                >
                  Link a bank
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {banks.map((bank, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#f9fafb] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-[#111827]">{bank.name}</p>
                      <p className="text-xs text-[#9ca3af]">{bank.type} {bank.mask}</p>
                    </div>
                    <button
                      onClick={() => setRemoveConfirm(idx)}
                      className="p-1.5 hover:bg-[#fee2e2] rounded-lg transition-colors"
                    >
                      <Trash2 size={15} className="text-red-400" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={onLinkBank}
                  className="w-full mt-2 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
                >
                  + Link another bank
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Monthly numbers */}
        <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f3f4f6]">
            <p className="text-sm font-semibold text-[#111827]">Monthly numbers</p>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Monthly income</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F]">
                <span className="pl-4 text-[#9ca3af] text-sm">₹</span>
                <input
                  type="number"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Spending budget</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1B3A2F]">
                <span className="pl-4 text-[#9ca3af] text-sm">₹</span>
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="flex-1 px-2 py-2.5 text-sm text-[#111827] outline-none bg-white"
                />
              </div>
            </div>
            <button
              onClick={handleSaveNumbers}
              className="w-full py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
            >
              Save & recalculate
            </button>
          </div>
        </div>

        {/* Data & privacy */}
        <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#f3f4f6] flex items-center gap-2">
            <Lock size={15} className="text-[#6b7280]" />
            <p className="text-sm font-semibold text-[#111827]">Data & privacy</p>
          </div>
          <div className="divide-y divide-[#f9fafb]">
            <button className="w-full text-left px-5 py-4 hover:bg-[#f9fafb] transition-colors">
              <p className="text-sm font-medium text-[#111827]">Export my data</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">A full CSV of every transaction, yours to keep.</p>
            </button>
            <button
              onClick={() => { if (confirm('Delete all transactions? This cannot be undone.')) setTransactions([]); }}
              className="w-full text-left px-5 py-4 hover:bg-[#f9fafb] transition-colors"
            >
              <p className="text-sm font-medium text-red-500">Delete all transactions</p>
              <p className="text-xs text-[#9ca3af] mt-0.5">Destructive actions never sit beside frequent ones.</p>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="border border-[#f3f4f6] rounded-xl px-5 py-4">
          <p className="text-xs text-[#9ca3af] leading-relaxed">
            Connections run through RBI's regulated Account Aggregator network with 256-bit encryption. Access is read-only — we can see transactions, never move money. Your bank credentials never touch our servers, and you can revoke any connection in one tap.
          </p>
        </div>
      </div>

      {removeConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#e5e7eb] rounded-xl max-w-sm w-full p-6 shadow-lg">
            <h3 className="font-semibold text-[#111827] mb-2">Remove bank?</h3>
            <p className="text-sm text-[#6b7280] mb-6">
              No new transactions will be imported. Your {transactions.length} existing transactions stay intact.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setRemoveConfirm(null)}
                className="w-full py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                Keep & don't remove
              </button>
              <button
                onClick={() => handleRemoveBank(removeConfirm)}
                className="w-full py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
