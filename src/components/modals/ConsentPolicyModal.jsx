import { useEffect } from 'react';
import { X, ShieldCheck, Landmark, Eye, RefreshCcw, Lock } from 'lucide-react';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-3">
      <span className="w-9 h-9 rounded-lg bg-[#F0F7F3] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-[#0E3F2E]" />
      </span>
      <div>
        <p className="text-sm font-semibold text-[#111827] mb-0.5">{title}</p>
        <p className="text-sm text-[#6b7280] leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default function ConsentPolicyModal({ onClose }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl max-w-[640px] w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-start px-8 pt-7 pb-2">
          <h2 className="font-display text-2xl text-[#111827]">Account Aggregator & your data</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#f3f4f6] rounded-lg transition-colors">
            <X size={20} className="text-[#6b7280]" />
          </button>
        </div>

        <div className="px-8 py-5 space-y-6">
          <Section icon={Landmark} title="What the Account Aggregator (AA) framework is">
            AA is a data-sharing system regulated by the{' '}
            <span className="font-medium text-[#374151]">Reserve Bank of India</span> under its{' '}
            <span className="font-medium text-[#374151]">Master Direction – Non-Banking Financial Company – Account
            Aggregator (Reserve Bank) Directions, 2016</span>. It lets you share financial data between institutions
            you trust — your bank and FinApp — without ever handing over your net-banking credentials to anyone.
            An RBI-licensed NBFC-AA (e.g. OneMoney, Finvu, CAMS AA) sits in the middle purely to relay data with your
            explicit, revocable consent; it cannot read or store the data itself.
          </Section>

          <Section icon={ShieldCheck} title="Consent is purpose-bound and time-bound">
            Every request states exactly what's being asked for: the{' '}
            <span className="font-medium text-[#374151]">purpose</span> (e.g. personal finance management), the{' '}
            <span className="font-medium text-[#374151]">data types</span> (profile, summary, transactions), the{' '}
            <span className="font-medium text-[#374151]">FI types</span> (e.g. deposit accounts), and the{' '}
            <span className="font-medium text-[#374151]">time range and duration</span> of access. FinApp cannot
            request anything outside what you approve on the AA's consent screen.
          </Section>

          <Section icon={Eye} title="Read-only, never your credentials">
            FinApp only ever receives statement-style transaction data — never your net-banking password, PIN, or
            OTP. Access is strictly read-only; nothing can be moved, withdrawn, or modified through this connection.
          </Section>

          <Section icon={RefreshCcw} title="You can revoke access anytime">
            Consent isn't a one-time switch — you can revoke it whenever you like, either from your AA app (OneMoney,
            Finvu, etc.) or by disconnecting the bank inside FinApp. Once revoked, no further data can be pulled
            under that consent.
          </Section>

          <Section icon={Lock} title="How FinApp handles the data">
            Data fetched via AA is used only to power your own dashboard — categorizing spend, tracking goals, and
            surfacing insights. It is not sold, shared with third parties, or used for anything beyond what you
            consented to. Manually-entered and demo data never leaves your device unless you're signed in, in which
            case it syncs only to your own account.
          </Section>
        </div>

        <div className="px-8 py-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
