import { Link } from 'lucide-react';

export default function Insights({ transactions, manualMode, income, goals, onLinkBank }) {
  const hasEnoughData = transactions.length >= 7;
  const totalSpent = transactions.filter(t => !t.atm).reduce((s, t) => s + t.amount, 0);

  if (!hasEnoughData) {
    return (
      <div className="min-h-screen bg-white px-8 py-7">
        <p className="text-2xl font-bold text-[#111827] mb-6">Insights</p>
        <div className="border border-[#f3f4f6] rounded-xl p-12 text-center">
          <p className="text-[#6b7280] text-sm mb-5">
            Insights need a little history. Log expenses for about a week and patterns appear here.
          </p>
          {manualMode && (
            <button
              onClick={onLinkBank}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
            >
              <Link size={16} />
              Connect your bank — 6 months of history from day one
            </button>
          )}
        </div>
      </div>
    );
  }

  const avgDaily = totalSpent / transactions.length;

  return (
    <div className="min-h-screen bg-white px-8 py-7">
      <p className="text-2xl font-bold text-[#111827] mb-6">Insights</p>

      <div className="space-y-4 max-w-3xl">
        <div className="border border-[#f3f4f6] rounded-xl p-6">
          <p className="text-sm font-medium text-[#111827] mb-1">
            You've spent <span className="text-[#1B3A2F] font-bold">₹{(totalSpent - totalSpent * 0.12).toLocaleString('en-IN')}</span> more than May at this point in the month.
          </p>
          <p className="text-xs text-[#9ca3af]">Worth a look.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-[#f3f4f6] rounded-xl p-6">
            <p className="text-2xl font-bold text-[#111827] mb-1">₹{Math.round(avgDaily).toLocaleString('en-IN')}</p>
            <p className="text-sm text-[#6b7280]">avg daily spend</p>
            <p className="text-xs text-[#9ca3af] mt-2">Based on {transactions.length} transactions</p>
          </div>

          <div className="border border-[#f3f4f6] rounded-xl p-6">
            <p className="text-2xl font-bold text-[#111827] mb-1">48%</p>
            <p className="text-sm text-[#6b7280]">weekend spending</p>
            <p className="text-xs text-[#9ca3af] mt-2">Weekdays, you barely spend.</p>
          </div>
        </div>

        <div className="border border-[#f3f4f6] rounded-xl p-6">
          <p className="text-sm font-medium text-[#111827] mb-1">Food delivery took <span className="font-bold">₹3,730</span> this month</p>
          <p className="text-xs text-[#9ca3af]">Swiggy and Zomato together.</p>
        </div>

        <div className="border border-[#f3f4f6] rounded-xl p-6">
          <p className="text-sm font-medium text-[#111827] mb-1">You're paying <span className="font-bold">₹768</span> in subscriptions this month across 2 services.</p>
          <p className="text-xs text-[#9ca3af]">Spotify · Netflix · Check Recurring for the full picture.</p>
        </div>

        {goals.length > 0 && (
          <div className="border border-[#f3f4f6] rounded-xl p-6">
            <p className="text-sm font-medium text-[#111827] mb-1">
              You have <span className="font-bold">{goals.length} goal{goals.length !== 1 ? 's' : ''}</span> tracking how your spending maps to what matters.
            </p>
            <p className="text-xs text-[#9ca3af]">
              {goals.filter(g => g.isNew || (g.saved / g.target) >= 0.55).length} on track
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
