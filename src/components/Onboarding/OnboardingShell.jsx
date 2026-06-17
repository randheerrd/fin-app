import { useState } from 'react';
import FinAppLogo from '../FinAppLogo';
import StepPathChoice from './StepPathChoice';
import StepTrackSetup from './StepTrackSetup';
import StepGoalSetup from './StepGoalSetup';
import StepVerify from './StepVerify';
import StepDiscovery from './StepDiscovery';
import StepNoAccounts from './StepNoAccounts';
import StepAccountSelect from './StepAccountSelect';
import StepConsent from './StepConsent';
import StepImport from './StepImport';

const STEP_TO_DOT = {
  path: 1,
  'track-setup': 2,
  'goal-setup': 2,
  verify: 3,
  'account-select': 4,
  consent: 4,
};

export default function OnboardingShell({ onComplete }) {
  const [step, setStep] = useState('path');
  const [path, setPath] = useState(null);
  // 0 = not set. The track path fills these; the goal path leaves them empty
  // so the dashboard prompts the user to add them.
  const [income, setIncome] = useState(0);
  const [budget, setBudget] = useState(0);
  const [goal, setGoal] = useState(null);
  const [phone, setPhone] = useState('');
  const [foundAccounts, setFoundAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const activeDot = STEP_TO_DOT[step] || 1;
  const isLoader = step === 'discovery' || step === 'import';
  const showDots = !isLoader && step !== 'no-accounts';
  // Consent is presented as a modal over the account-select screen.
  const baseStep = step === 'consent' ? 'account-select' : step;

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

  // After the number is verified, discover the bank accounts linked to it.
  const handleVerified = (verifiedPhone) => {
    setPhone(verifiedPhone || '');
    setStep('discovery');
  };

  const backToNumbers = () => setStep(path === 'goal' ? 'goal-setup' : 'track-setup');

  const handleDiscoveryComplete = (accounts) => {
    if (!accounts || accounts.length === 0) {
      setStep('no-accounts');
    } else {
      setFoundAccounts(accounts);
      setSelectedAccounts(accounts.map(() => true));
      setStep('account-select');
    }
  };

  const toggleAccount = (index) => {
    setSelectedAccounts((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const addAnotherAccount = (bankData) => {
    setFoundAccounts((prev) => [...prev, { bank: bankData.name, type: bankData.type, mask: bankData.mask }]);
    setSelectedAccounts((prev) => [...prev, true]);
  };

  const finish = (banks = []) => onComplete({ income, budget, goal, banks });

  const handleImportComplete = () => {
    const banks = foundAccounts
      .filter((_, i) => selectedAccounts[i])
      .map((acc) => ({ name: acc.bank, type: acc.type, mask: acc.mask, synced: 'just now' }));
    finish(banks);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0E3F2E] p-2.5 relative">
      <header className="h-14 flex items-center px-5 flex-shrink-0">
        <FinAppLogo color="#ffffff" className="h-6 w-auto" />
      </header>

      <div className="flex-1 bg-white rounded-3xl overflow-hidden relative">
        <div className="h-full overflow-y-auto">
          <div className="w-full min-h-full flex flex-col items-center px-4 pt-24 pb-16">
            {showDots && (
              <div className="flex justify-center gap-2.5 mb-12">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      i <= activeDot ? 'bg-[#0E3F2E]' : 'bg-[#d1d5db]'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="w-full max-w-lg">
              {baseStep === 'path' && <StepPathChoice onChoose={handlePathChoice} />}
              {baseStep === 'track-setup' && <StepTrackSetup onAction={handleNumbers} />}
              {baseStep === 'goal-setup' && <StepGoalSetup onAction={handleGoal} />}
              {baseStep === 'verify' && <StepVerify onVerified={handleVerified} onBack={backToNumbers} />}
              {baseStep === 'discovery' && (
                <StepDiscovery mobile={phone} token="" onComplete={handleDiscoveryComplete} />
              )}
              {baseStep === 'no-accounts' && (
                <StepNoAccounts onTryAgain={() => setStep('verify')} onManual={() => finish([])} />
              )}
              {baseStep === 'account-select' && (
                <StepAccountSelect
                  accounts={foundAccounts}
                  selected={selectedAccounts}
                  onToggle={toggleAccount}
                  onContinue={() => setStep('consent')}
                  onSkip={() => finish([])}
                  onBack={backToNumbers}
                  onAddAnother={addAnotherAccount}
                />
              )}
              {baseStep === 'import' && <StepImport onComplete={handleImportComplete} />}
            </div>
          </div>
        </div>

        {step === 'consent' && (
          <StepConsent onAccept={() => setStep('import')} onBack={() => setStep('account-select')} />
        )}
      </div>
    </div>
  );
}
