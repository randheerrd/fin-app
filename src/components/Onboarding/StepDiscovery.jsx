import { useState, useEffect } from 'react';
import accountAggregatorAPI from '../../lib/api';

const MOCK_ACCOUNTS = [
  { bank: 'HDFC Bank', type: 'Salary account', mask: '··4521' },
  { bank: 'Axis Bank', type: 'Saving account', mask: '··8834' },
  { bank: 'ICICI Bank', type: 'Saving account', mask: '··2291' },
];

export default function StepDiscovery({ mobile, token, onComplete }) {
  const [message, setMessage] = useState('Connecting to HDFC Bank…');

  useEffect(() => {
    const discoverAccounts = async () => {
      const steps = [
        { delay: 0, msg: 'Connecting to HDFC Bank…' },
        { delay: 1200, msg: 'Searching AA network…' },
        { delay: 2400, msg: 'Almost there…' },
      ];

      for (const s of steps) {
        await new Promise(r => setTimeout(r, s.delay));
        setMessage(s.msg);
      }

      await new Promise(r => setTimeout(r, 800));

      try {
        const response = await accountAggregatorAPI.fetchAccounts(mobile, token);
        const accounts = response.accounts || [];
        if (accounts.length === 0) {
          const fallback = mobile.endsWith('0000') ? [] : MOCK_ACCOUNTS;
          onComplete(fallback);
        } else {
          const formatted = accounts.map(acc => ({
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
  }, [mobile, token, onComplete]);

  return (
    <div className="py-8 text-center">
      <div className="w-10 h-10 border-2 border-[#e5e7eb] border-t-[#1B3A2F] rounded-full animate-spin mx-auto mb-6" />
      <p className="text-[#6b7280] text-sm">{message}</p>
    </div>
  );
}
