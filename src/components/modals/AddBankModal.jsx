import { useState, useEffect } from 'react';
import { X, Search, Building2, Lock, ChevronDown, Check, AlertCircle } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { INDIAN_BANKS, ACCOUNT_TYPES } from '../../data/banks';

// Demo AA name-verification: does this account number belong to the signed-in
// user? Deterministic so the same number always gives the same result. We never
// surface anyone else's name — just whether it matches.
function isOwnAccount(digits) {
  const sum = [...digits].reduce((a, c) => a + Number(c), 0);
  return sum % 2 === 0;
}

export default function AddBankModal({ onClose, onAdd, holderName = 'Randheer Kumar' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if (e.key !== 'Escape') return;
      if (open) setOpen(false);
      else onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  const [bank, setBank] = useState(null);
  const [type, setType] = useState(ACCOUNT_TYPES[0]);
  const [acctNo, setAcctNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [consent, setConsent] = useState(false);

  const list = INDIAN_BANKS.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase()));
  const digits = acctNo.replace(/\D/g, '');
  const verified = digits.length >= 9; // enough digits to "look up" the holder
  const matched = verified && isOwnAccount(digits);
  const ifscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc); // 11 chars: BANK + 0 + branch
  const canAdd = bank && verified && matched && ifscValid && consent;

  const submit = () => {
    if (!canAdd) return;
    onAdd({ name: bank.name, type, mask: `··${digits.slice(-4)}`, ifsc });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-3">
          <h2 className="font-display text-2xl text-[#111827]">Add a bank</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-6 py-2 space-y-5">
          {/* Searchable bank picker */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Bank</label>
            <div className="relative">
              {bank ? (
                <button
                  onClick={() => {
                    setBank(null);
                    setQuery('');
                    setOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors text-left"
                >
                  <BrandLogo domain={bank.domain} label={bank.name} size={28} fallbackIcon={Building2} />
                  <span className="flex-1 text-sm font-medium text-[#111827]">{bank.name}</span>
                  <ChevronDown size={16} className="text-[#9ca3af]" />
                </button>
              ) : (
                <div className="flex items-center gap-2.5 px-3.5 border border-[#e5e7eb] rounded-lg focus-within:border-[#0E3F2E]">
                  <Search size={16} className="text-[#9ca3af]" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search your bank…"
                    className="flex-1 py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                  />
                </div>
              )}

              {open && !bank && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1 z-20 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                    {list.length === 0 && (
                      <p className="px-4 py-3 text-sm text-[#9ca3af]">No bank matches “{query}”.</p>
                    )}
                    {list.map((b) => (
                      <button
                        key={b.name}
                        onClick={() => {
                          setBank(b);
                          setOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#f9fafb] transition-colors text-left"
                      >
                        <BrandLogo domain={b.domain} label={b.name} size={28} fallbackIcon={Building2} />
                        <span className="text-sm font-medium text-[#111827]">{b.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Account type */}
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

          {/* Account number */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">Account number</label>
            <input
              value={acctNo.replace(/(.{4})(?=.)/g, '$1 ')}
              onChange={(e) => setAcctNo(e.target.value.replace(/\D/g, '').slice(0, 18))}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg text-sm text-[#111827] tracking-wide tabular-nums outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af]"
            />
            {!verified ? (
              <p className="text-xs text-[#9ca3af] mt-1">Only the last 4 digits are stored.</p>
            ) : matched ? (
              <div className="flex items-center gap-2 mt-2.5 px-3 py-2 bg-[#F0F7F3] border border-[#0E3F2E]/15 rounded-lg">
                <span className="w-5 h-5 rounded-full bg-[#15803D] flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-[#111827]">{holderName}</p>
                  <p className="text-[11px] text-[#15803D]">Account holder verified</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2.5 px-3 py-2 bg-[#FEF2F2] border border-red-200 rounded-lg">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-500">
                  This account isn’t registered under {holderName}. You can only link your own accounts.
                </p>
              </div>
            )}
          </div>

          {/* IFSC */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">IFSC code</label>
            <input
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
              placeholder="HDFC0001234"
              className={`w-full px-4 py-3 border rounded-lg text-sm text-[#111827] tracking-wide uppercase outline-none focus:border-[#0E3F2E] placeholder:text-[#9ca3af] placeholder:normal-case ${
                ifsc.length > 0 && !ifscValid ? 'border-red-300' : 'border-[#e5e7eb]'
              }`}
            />
            {ifsc.length > 0 && !ifscValid ? (
              <p className="text-xs text-red-500 mt-1">Enter a valid 11-character IFSC (e.g. HDFC0001234).</p>
            ) : (
              <p className="text-xs text-[#9ca3af] mt-1">11 characters — on a cheque or in your bank app.</p>
            )}
          </div>

          {/* Consent */}
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

        <div className="px-6 py-5 flex items-center gap-3 border-t border-[#f3f4f6] mt-2">
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
            className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {canAdd && <Check size={15} />}
            Add account
          </button>
        </div>
      </div>
    </div>
  );
}
