import { useState } from 'react';
import { X, Search, Building2, ArrowLeft, Lock } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { INDIAN_BANKS, ACCOUNT_TYPES } from '../../data/banks';

export default function AddBankModal({ onClose, onAdd }) {
  const [q, setQ] = useState('');
  const [bank, setBank] = useState(null);
  const [type, setType] = useState(ACCOUNT_TYPES[0]);
  const [acctNo, setAcctNo] = useState('');
  const [consent, setConsent] = useState(false);

  const list = INDIAN_BANKS.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()));
  const digits = acctNo.replace(/\D/g, '');
  const canAdd = bank && digits.length >= 4 && consent;

  const submit = () => {
    if (!canAdd) return;
    onAdd({ name: bank.name, type, mask: `··${digits.slice(-4)}` });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <div className="flex items-center gap-2">
            {bank && (
              <button onClick={() => setBank(null)} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
                <ArrowLeft size={18} className="text-[#6b7280]" />
              </button>
            )}
            <h2 className="font-display text-2xl text-[#111827]">{bank ? bank.name : 'Add a bank'}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        {!bank ? (
          /* Step 1 — pick a bank */
          <>
            <div className="px-6 pb-3">
              <div className="flex items-center gap-2.5 px-3.5 border border-[#e5e7eb] rounded-lg focus-within:border-[#0E3F2E]">
                <Search size={16} className="text-[#9ca3af]" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search 30+ Indian banks…"
                  className="flex-1 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              {list.length === 0 && (
                <p className="text-sm text-[#9ca3af] text-center py-8">No bank matches “{q}”.</p>
              )}
              {list.map((b) => (
                <button
                  key={b.name}
                  onClick={() => setBank(b)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                >
                  <BrandLogo domain={b.domain} label={b.name} size={36} fallbackIcon={Building2} />
                  <span className="text-sm font-medium text-[#111827]">{b.name}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Step 2 — required details */
          <>
            <div className="px-6 py-2 space-y-5 overflow-y-auto">
              <div className="flex items-center gap-3">
                <BrandLogo domain={bank.domain} label={bank.name} size={44} fallbackIcon={Building2} />
                <p className="text-sm text-[#6b7280]">
                  Enter the details FinApp needs to read this account’s transactions.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Account type</label>
                <div className="flex flex-wrap gap-2">
                  {ACCOUNT_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={`px-3.5 py-2 rounded-full border text-sm transition-colors ${
                        type === t
                          ? 'bg-[#0E3F2E] border-[#0E3F2E] text-white'
                          : 'bg-white border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">Account number</label>
                <input
                  value={acctNo}
                  onChange={(e) => setAcctNo(e.target.value.replace(/[^\d]/g, '').slice(0, 18))}
                  inputMode="numeric"
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]"
                />
                <p className="text-xs text-[#9ca3af] mt-1">Only the last 4 digits are stored.</p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0E3F2E]"
                />
                <span className="text-xs text-[#6b7280] leading-relaxed">
                  I authorize FinApp to fetch this account’s transactions through the RBI-regulated Account
                  Aggregator network — read-only access, revocable anytime.
                </span>
              </label>
            </div>

            <div className="px-6 py-5 flex items-center gap-3 border-t border-[#f3f4f6]">
              <p className="text-xs text-[#9ca3af] flex items-center gap-1.5 flex-1">
                <Lock size={12} /> Read-only
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 border border-[#e5e7eb] text-[#374151] text-sm font-medium rounded-lg hover:bg-[#f9fafb] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!canAdd}
                className="px-6 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add account
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
