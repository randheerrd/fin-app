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
    <div className="max-w-md w-full px-4">
      <div className="mb-12">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Importing your data</h1>
        <p className="text-text-dim">This usually takes 30 seconds</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <div className="w-full bg-bg-card rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-sage transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-faint mt-2">{progress}%</p>
        </div>

        <p className="text-sm text-text-dim">{message}</p>
      </div>
    </div>
  );
}
