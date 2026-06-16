import { useState } from 'react';
import StepPathChoice from './StepPathChoice';
import StepTrackSetup from './StepTrackSetup';
import StepGoalSetup from './StepGoalSetup';
import StepMobileEntry from './StepMobileEntry';
import StepOTP from './StepOTP';
import StepDiscovery from './StepDiscovery';
import StepNoAccounts from './StepNoAccounts';
import StepAccountSelect from './StepAccountSelect';
import StepConsent from './StepConsent';
import StepImport from './StepImport';

const STEP_TO_DOT = {
  'path': 1,
  'track-setup': 2,
  'goal-setup': 2,
  'mobile': 3,
  'otp': 4,
  'discovery': 4,
  'no-accounts': 4,
  'account-select': 5,
  'consent': 5,
  'import': 5,
};

export default function OnboardingShell({
  onBankConnected,
  onManualMode,
  linkingMode,
  onLinkBankComplete,
}) {
  const [step, setStep] = useState(linkingMode ? 'mobile' : 'path');
  const [path, setPath] = useState(null);
  const [mobile, setMobile] = useState('');
  const [consentId, setConsentId] = useState('');
  const [token, setToken] = useState('');
  const [income, setIncome] = useState(100000);
  const [budget, setBudget] = useState(50000);
  const [otp, setOtp] = useState('');
  const [foundAccounts, setFoundAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const activeDot = STEP_TO_DOT[step] || 1;

  const handlePathChoice = (chosen) => {
    setPath(chosen);
    if (chosen === 'track') {
      setStep('track-setup');
    } else {
      setStep('goal-setup');
    }
  };

  const handleTrackSetup = (action, data) => {
    if (action === 'continue') {
      if (data) { setIncome(data.income); setBudget(data.budget); }
      setStep('mobile');
    } else if (action === 'skip') {
      onManualMode();
    }
  };

  const handleGoalSetup = (action, data) => {
    if (action === 'continue') {
      if (data) { setIncome(data.income); setBudget(data.budget); }
      setStep('mobile');
    } else if (action === 'skip') {
      onManualMode();
    }
  };

  const handleMobileSubmit = (phoneNumber, cid) => {
    setMobile(phoneNumber);
    setConsentId(cid);
    setStep('otp');
  };

  const handleMobileBack = () => {
    if (linkingMode) return;
    setStep(path === 'track' ? 'track-setup' : 'goal-setup');
    setMobile('');
    setConsentId('');
    setToken('');
  };

  const handleOTPSubmit = (otpCode, verificationToken) => {
    setOtp(otpCode);
    setToken(verificationToken);
    setStep('discovery');
  };

  const handleOTPChangeNumber = () => {
    setMobile('');
    setConsentId('');
    setToken('');
    setOtp('');
    setStep('mobile');
  };

  const handleDiscoveryComplete = (accounts) => {
    if (accounts.length === 0) {
      setFoundAccounts([]);
      setStep('no-accounts');
    } else {
      setFoundAccounts(accounts);
      setSelectedAccounts(accounts.map(() => true));
      setStep('account-select');
    }
  };

  const handleNoAccountsTryAgain = () => {
    setMobile('');
    setConsentId('');
    setToken('');
    setOtp('');
    setStep('mobile');
  };

  const handleNoAccountsManual = () => {
    onManualMode();
  };

  const handleAccountSelect = (index) => {
    setSelectedAccounts(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleAccountContinue = () => {
    setStep('consent');
  };

  const handleAccountBack = () => {
    setMobile('');
    setConsentId('');
    setToken('');
    setOtp('');
    setStep('mobile');
  };

  const handleConsentAccept = () => {
    setStep('import');
  };

  const handleConsentBack = () => {
    setStep('account-select');
  };

  const handleImportComplete = () => {
    const selected = foundAccounts.filter((_, i) => selectedAccounts[i]);
    const bankData = selected.map(acc => ({
      name: acc.bank,
      type: acc.type,
      mask: acc.mask,
      synced: 'just now',
    }));

    if (linkingMode) {
      onLinkBankComplete(bankData);
    } else {
      onBankConnected(bankData);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Top navbar */}
      <header className="h-12 bg-[#1B3A2F] flex items-center px-6 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex flex-col justify-center gap-1 flex-shrink-0">
            <span className="block w-full h-0.5 bg-white rounded" />
            <span className="block w-3/4 h-0.5 bg-white rounded" />
            <span className="block w-full h-0.5 bg-white rounded" />
          </div>
          <span className="text-white font-semibold text-base">FinApp</span>
        </div>
      </header>

      {/* Content area */}
      <div className="flex-1 bg-[#f9fafb] overflow-auto">
        <div className="w-full h-full flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl bg-white border border-[#e5e7eb] rounded-xl shadow-sm">
            {/* Progress dots */}
            {!linkingMode && step !== 'import' && step !== 'discovery' && (
              <div className="flex justify-center gap-3 pt-10 pb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i <= activeDot ? 'bg-[#1B3A2F]' : 'bg-[#d1d5db]'
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="px-12 pb-12 pt-8">
              {step === 'path' && <StepPathChoice onChoose={handlePathChoice} />}
              {step === 'track-setup' && <StepTrackSetup onAction={handleTrackSetup} />}
              {step === 'goal-setup' && <StepGoalSetup onAction={handleGoalSetup} />}
              {step === 'mobile' && (
                <StepMobileEntry
                  onSubmit={handleMobileSubmit}
                  onBack={linkingMode ? null : handleMobileBack}
                />
              )}
              {step === 'otp' && (
                <StepOTP
                  mobile={mobile}
                  consentId={consentId}
                  onSubmit={handleOTPSubmit}
                  onChangeNumber={handleOTPChangeNumber}
                />
              )}
              {step === 'discovery' && (
                <StepDiscovery
                  mobile={mobile}
                  token={token}
                  onComplete={handleDiscoveryComplete}
                />
              )}
              {step === 'no-accounts' && (
                <StepNoAccounts
                  onTryAgain={handleNoAccountsTryAgain}
                  onManual={handleNoAccountsManual}
                />
              )}
              {step === 'account-select' && (
                <StepAccountSelect
                  accounts={foundAccounts}
                  selected={selectedAccounts}
                  onToggle={handleAccountSelect}
                  onContinue={handleAccountContinue}
                  onBack={handleAccountBack}
                />
              )}
              {step === 'consent' && (
                <StepConsent
                  onAccept={handleConsentAccept}
                  onBack={handleConsentBack}
                />
              )}
              {step === 'import' && <StepImport onComplete={handleImportComplete} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
