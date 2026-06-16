import { useState, useEffect } from 'react';

const IMPORT_STEPS = [
  { delay: 0, message: 'Connecting to HDFC Bank…', progress: 15 },
  { delay: 1200, message: 'Fetching transactions…', progress: 45 },
  { delay: 2300, message: 'Categorising… Zomato → Food · Uber → Transport · Netflix → Subscriptions', progress: 75 },
  { delay: 3300, message: 'Detecting recurring payments…', progress: 92 },
  { delay: 4200, message: 'Done! Your data is ready.', progress: 100 },
];

export default function StepImport({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    IMPORT_STEPS.forEach(step => {
      const timeout = setTimeout(() => {
        setMessage(step.message);
        setProgress(step.progress);
        if (step.progress === 100) {
          setTimeout(onComplete, 800);
        }
      }, step.delay);
      return () => clearTimeout(timeout);
    });
  }, [onComplete]);

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Importing your data</h1>
        <p className="text-[#6b7280] text-sm">This usually takes 30 seconds</p>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#1B3A2F] transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-[#6b7280]">{message}</p>
      </div>
    </div>
  );
}
