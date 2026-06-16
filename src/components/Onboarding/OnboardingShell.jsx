import { useState } from 'react';
import FinAppLogo from '../FinAppLogo';
import StepPathChoice from './StepPathChoice';
import StepTrackSetup from './StepTrackSetup';
import StepGoalSetup from './StepGoalSetup';
import StepVerify from './StepVerify';

const STEP_TO_DOT = { path: 1, 'track-setup': 2, 'goal-setup': 2, verify: 3 };

export default function OnboardingShell({ onComplete }) {
  const [step, setStep] = useState('path');
  const [path, setPath] = useState(null);
  const [income, setIncome] = useState(100000);
  const [budget, setBudget] = useState(50000);
  const [goal, setGoal] = useState(null);

  const activeDot = STEP_TO_DOT[step] || 1;

  const handlePathChoice = (chosen) => {
    setPath(chosen);
    setStep(chosen === 'track' ? 'track-setup' : 'goal-setup');
  };

  const handleNumbers = (action, data) => {
    if (action === 'continue') {
      if (data) {
        setIncome(data.income);
        setBudget(data.budget);
      }
      setStep('verify');
    } else {
      setStep('path'); // "Back"
    }
  };

  const handleGoal = (action, data) => {
    if (action === 'continue') {
      setGoal(data.goal);
      setStep('verify');
    } else {
      setStep('path'); // "Back"
    }
  };

  const handleVerified = () => onComplete({ income, budget, goal });
  const backToNumbers = () => setStep(path === 'goal' ? 'goal-setup' : 'track-setup');

  return (
    <div className="w-full h-screen flex flex-col bg-[#0E3F2E] p-2.5 relative">
      <header className="h-14 flex items-center px-5 flex-shrink-0">
        <FinAppLogo color="#ffffff" className="h-6 w-auto" />
      </header>

      <div className="flex-1 bg-white rounded-3xl overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          <div className="w-full min-h-full flex flex-col items-center px-4 pt-24 pb-16">
            <div className="flex justify-center gap-2.5 mb-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i <= activeDot ? 'bg-[#0E3F2E]' : 'bg-[#d1d5db]'
                  }`}
                />
              ))}
            </div>

            <div className="w-full max-w-lg">
              {step === 'path' && <StepPathChoice onChoose={handlePathChoice} />}
              {step === 'track-setup' && <StepTrackSetup onAction={handleNumbers} />}
              {step === 'goal-setup' && <StepGoalSetup onAction={handleGoal} />}
              {step === 'verify' && <StepVerify onVerified={handleVerified} onBack={backToNumbers} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
