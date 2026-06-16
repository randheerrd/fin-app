import { Link } from 'lucide-react';

export default function Recurring({ recurring, income, manualMode, onLinkBank }) {
  if (manualMode && recurring.length === 0) {
    return (
      <div className="min-h-screen bg-white px-8 py-7">
        <p className="text-2xl font-bold text-[#111827] mb-6">Recurring</p>
        <div className="border border-[#f3f4f6] rounded-xl p-12 text-center">
          <p className="text-[#9ca3af] text-sm mb-5">
            Nothing recurring yet. Connect a bank to auto-detect repeating payments.
          </p>
          <button
            onClick={onLinkBank}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors"
          >
            <Link size={16} />
            Link a bank
          </button>
        </div>
      </div>
    );
  }

  const totalRecurring = recurring.reduce((s, r) => s + r.amount, 0);
  const pct = Math.round((totalRecurring / income) * 100);

  return (
    <div className="min-h-screen bg-white px-8 py-7">
      <p className="text-2xl font-bold text-[#111827] mb-6">Recurring</p>

      <div className="border border-[#f3f4f6] rounded-xl p-5 mb-5">
        <p className="text-sm text-[#374151]">
          <span className="text-xl font-bold text-[#111827]">₹{totalRecurring.toLocaleString('en-IN')}</span>{' '}
          is committed every month — <strong>{pct}%</strong> of your income. The rest is yours to decide.
        </p>
      </div>

      {recurring.length > 0 && (
        <div className="border border-[#f3f4f6] rounded-xl overflow-hidden">
          <div className="divide-y divide-[#f9fafb]">
            {recurring.map((item, idx) => (
              <div key={idx} className="px-5 py-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#111827]">{item.name}</p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">Every month on the {item.day}</p>
                </div>
                <p className="text-sm font-semibold text-[#111827]">₹{item.amount.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
