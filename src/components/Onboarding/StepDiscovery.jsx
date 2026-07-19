import { useState, useEffect } from 'react';
import accountAggregatorAPI from '../../lib/api';
import { isDemoPhone } from '../../data/demoSeed';
import { createConsent, aaEnabled } from '../../lib/setu';

const MOCK_ACCOUNTS = [
  { bank: 'HDFC Bank', type: 'Salary account', mask: '··4521' },
  { bank: 'Axis Bank', type: 'Saving account', mask: '··8834' },
  { bank: 'ICICI Bank', type: 'Saving account', mask: '··2291' },
];

// Demo phones get an instant mock discovery. On a local dev server with AA
// configured (`aaEnabled`), any real number kicks off the actual Setu AA
// consent flow and redirects to the approval page — App.jsx picks the import
// back up when the user returns (looks for `aa_pending`). On production
// builds, real bank-connect is disabled — a real number falls straight
// through to manual entry instead, same as a failed/declined AA attempt.
export default function StepDiscovery({ mobile, token, income, budget, goal, onComplete }) {
  const [message, setMessage] = useState(() =>
    isDemoPhone(mobile) ? 'Connecting to HDFC Bank…' : 'Redirecting to your bank via the Account Aggregator…'
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isDemoPhone(mobile) && !aaEnabled) {
      onComplete([]);
      return;
    }
    if (!isDemoPhone(mobile)) {
      (async () => {
        try {
          const result = await createConsent(mobile, window.location.origin + window.location.pathname);
          if (!result?.id || !result?.url) {
            throw new Error(result?.errorMsg || result?.error || 'Could not start the bank connection');
          }
          localStorage.setItem('aa_pending', JSON.stringify({ consentId: result.id, income, budget, goal, phone: mobile }));
          window.location.href = result.url;
        } catch (e) {
          console.error(e);
          setError(e?.message || 'Could not connect to your bank right now.');
        }
      })();
      return;
    }

    const discoverAccounts = async () => {
      const steps = [
        { delay: 0, msg: 'Connecting to HDFC Bank…' },
        { delay: 1200, msg: 'Searching AA network…' },
        { delay: 2400, msg: 'Almost there…' },
      ];

      for (const s of steps) {
        await new Promise((r) => setTimeout(r, s.delay));
        setMessage(s.msg);
      }

      await new Promise((r) => setTimeout(r, 800));

      try {
        const response = await accountAggregatorAPI.fetchAccounts(mobile, token);
        const accounts = response.accounts || [];
        if (accounts.length === 0) {
          const fallback = mobile.endsWith('0000') ? [] : MOCK_ACCOUNTS;
          onComplete(fallback);
        } else {
          const formatted = accounts.map((acc) => ({
            bank: acc.bank_name || acc.bank,
            type: acc.account_type || 'Unknown',
            mask: acc.account_number ? `··${acc.account_number.slice(-4)}` : '····',
            accountId: acc.id,
          }));
          onComplete(formatted);
        }
      } catch {
        const fallback = mobile.endsWith('0000') ? [] : MOCK_ACCOUNTS;
        onComplete(fallback);
      }
    };

    discoverAccounts();
  }, [mobile, token, income, budget, goal, onComplete]);

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="font-display text-2xl text-[#111827] mb-2">Couldn’t connect</p>
        <p className="text-sm text-[#6b7280] mb-6">{error}</p>
        <button
          onClick={() => onComplete([])}
          className="px-5 py-2.5 bg-[#0E3F2E] text-white text-sm font-medium rounded-lg hover:bg-[#0a3122] transition-colors"
        >
          Continue manually
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 text-center">
      <div className="w-10 h-10 border-2 border-[#e5e7eb] border-t-[#0E3F2E] rounded-full animate-spin mx-auto mb-6" />
      <p className="text-[#6b7280] text-sm">{message}</p>
    </div>
  );
}
