import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import accountAggregatorAPI from '../../lib/api';

const MOCK_ACCOUNTS = [
  { bank: 'HDFC Bank', type: 'Salary account', mask: '··4521' },
  { bank: 'Axis Bank', type: 'Saving account', mask: '··8834' },
];

export default function StepDiscovery({ mobile, onComplete }) {
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const discoverAccounts = async () => {
      const timings = [
        { delay: 0, msg: 'Verifying OTP…', phase: 0 },
        { delay: 1100, msg: 'Searching AA network… Asking banks which accounts match your number', phase: 1 },
        { delay: 2300, msg: null, phase: 2 },
        { delay: 2900, action: 'complete' },
      ];

      for (const t of timings) {
        await new Promise(resolve => setTimeout(resolve, t.delay));

        if (t.msg !== undefined) {
          setMessage(t.msg);
          if (t.msg !== null) setPhase(t.phase);
        }

        if (t.action === 'complete') {
          try {
            // Call real API to fetch accounts
            const response = await accountAggregatorAPI.fetchAccounts(mobile);
            const accounts = response.accounts || [];

            if (accounts.length === 0) {
              // No accounts found - use mock or show no-accounts state
              const noAccounts = mobile.endsWith('0000') ? [] : MOCK_ACCOUNTS;
              onComplete(noAccounts);
            } else {
              // Format accounts for display
              const formattedAccounts = accounts.map(acc => ({
                bank: acc.bank_name || acc.bank,
                type: acc.account_type || 'Unknown',
                mask: acc.account_number ? `··${acc.account_number.slice(-4)}` : '····',
                accountId: acc.id,
              }));
              onComplete(formattedAccounts);
            }
          } catch (error) {
            console.error('Error fetching accounts:', error);
            // Fallback to mock data
            const fallbackAccounts = mobile.endsWith('0000') ? [] : MOCK_ACCOUNTS;
            onComplete(fallbackAccounts);
          }
        }
      }
    };

    discoverAccounts();
  }, [mobile, onComplete]);

  return (
    <div className="max-w-2xl w-full px-8 text-center">
      <div className="flex justify-center gap-2 mb-12">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-accent' : 'bg-bg-border'}`} />
        ))}
      </div>

      <div className="mb-12 flex flex-col items-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-bg-border border-t-accent rounded-full animate-spin mx-auto" />
        </div>

        {message && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-text-primary mb-3">{message}</h2>
            <p className="text-text-secondary text-sm">
              {phase === 1 ? 'This usually takes 10-15 seconds' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
