import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';

const MOCK_ACCOUNTS = [
  { bank: 'HDFC Bank', type: 'Salary account', mask: '··4521' },
  { bank: 'Axis Bank', type: 'Saving account', mask: '··8834' },
];

export default function StepDiscovery({ mobile, onComplete }) {
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState(0); // 0=verifying, 1=searching, 2=found/not found

  useEffect(() => {
    const timings = [
      { delay: 0, msg: 'Verifying OTP…' },
      { delay: 1100, msg: 'Searching AA network… Asking banks which accounts match your number' },
      { delay: 2300, msg: null }, // Transition
      { delay: 2900, action: 'complete' },
    ];

    timings.forEach(t => {
      const timeout = setTimeout(() => {
        if (t.msg !== undefined) {
          setMessage(t.msg);
          if (t.msg !== null) setPhase(t.msg.includes('Searching') ? 1 : 0);
        }
        if (t.action === 'complete') {
          // Check if mobile ends in 0000 for no-accounts state
          const hasAccounts = !mobile.endsWith('0000');
          onComplete(hasAccounts ? MOCK_ACCOUNTS : []);
        }
      }, t.delay);

      return () => clearTimeout(timeout);
    });
  }, [mobile, onComplete]);

  return (
    <div className="max-w-md w-full px-4 text-center">
      <div className="mb-12 flex justify-center">
        <Loader className="animate-spin text-sage" size={40} />
      </div>

      {message && (
        <div>
          <h2 className="font-serif text-2xl text-text-primary mb-3">{message}</h2>
          <p className="text-text-dim text-sm">
            {phase === 1 ? 'This usually takes 10-15 seconds' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
