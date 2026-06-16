import { useState } from 'react';
import FinAppLogo from '../FinAppLogo';
import { aaEnabled, createConsent } from '../../lib/setu';
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

  // Real Setu AA: create a consent and redirect to the hosted approval page.
  // We stash what we need so the app can resume the import when the user returns.
  const handleAAConnect = async (phoneNumber) => {
    const redirectUrl = window.location.origin + '/';
    const res = await createConsent(phoneNumber, redirectUrl);
    if (!res?.id || !res?.url) throw new Error('Could not start bank connection.');
    localStorage.setItem(
      'aa_pending',
      JSON.stringify({ consentId: res.id, mobile: phoneNumber, income, budget })
    );
    window.location.href = res.url;
  };

  const handleMobileBack = () => {
    if (linkingMode) return;
    setStep(path === 'track' ? 'track-setup' : 'goal-setup');
    setMobile('');
    setConsentId('');
    setToken('');
  };

  const handleOTPSubmit = (otpCode, verificationToken) => {
    setToken(verificationToken);
    setStep('discovery');
  };

  const handleOTPChangeNumber = () => {
    setMobile('');
    setConsentId('');
    setToken('');
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

  const handleAddAnother = (bankData) => {
    setFoundAccounts((prev) => [...prev, { bank: bankData.name, type: bankData.type, mask: bankData.mask }]);
    setSelectedAccounts((prev) => [...prev, true]);
  };

  const handleAccountContinue = () => {
    setStep('consent');
  };

  const handleAccountBack = () => {
    setMobile('');
    setConsentId('');
    setToken('');
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
      onBankConnected(bankData, { income, budget });
    }
  };

  const isLoader = step === 'discovery' || step === 'import';
  const showDots = !linkingMode && !isLoader;
  // Consent is presented as a modal over the account-select screen.
  const baseStep = step === 'consent' ? 'account-select' : step;

  return (
    <div className="w-full h-screen flex flex-col bg-[#0E3F2E] p-2.5 relative">
      {/* Logo on the green frame */}
      <header className="h-14 flex items-center px-5 flex-shrink-0">
        <FinAppLogo color="#ffffff" className="h-6 w-auto" />
      </header>

      {/* White rounded panel floating on the green background */}
      <div className="flex-1 bg-white rounded-3xl overflow-hidden relative">
        <div className="h-full overflow-y-auto">
        <div className="w-full min-h-full flex flex-col items-center px-4 pt-24 pb-16">
          {showDots && (
            <div className="flex justify-center gap-2.5 mb-12">
              {[1, 2, 3, 4, 5].map((i) => (
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
            {baseStep === 'track-setup' && <StepTrackSetup onAction={handleTrackSetup} />}
            {baseStep === 'goal-setup' && <StepGoalSetup onAction={handleGoalSetup} />}
            {baseStep === 'mobile' && (
              <StepMobileEntry
                onSubmit={handleMobileSubmit}
                onAAConnect={aaEnabled ? handleAAConnect : null}
                onBack={linkingMode ? null : handleMobileBack}
              />
            )}
            {baseStep === 'otp' && (
              <StepOTP
                mobile={mobile}
                consentId={consentId}
                onSubmit={handleOTPSubmit}
                onChangeNumber={handleOTPChangeNumber}
              />
            )}
            {baseStep === 'discovery' && (
              <StepDiscovery mobile={mobile} token={token} onComplete={handleDiscoveryComplete} />
            )}
            {baseStep === 'import' && <StepImport onComplete={handleImportComplete} />}
            {baseStep === 'no-accounts' && (
              <StepNoAccounts onTryAgain={handleNoAccountsTryAgain} onManual={handleNoAccountsManual} />
            )}
            {baseStep === 'account-select' && (
              <StepAccountSelect
                accounts={foundAccounts}
                selected={selectedAccounts}
                onToggle={handleAccountSelect}
                onContinue={handleAccountContinue}
                onBack={handleAccountBack}
                onAddAnother={handleAddAnother}
              />
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Consent modal */}
      {step === 'consent' && <StepConsent onAccept={handleConsentAccept} onBack={handleConsentBack} />}
    </div>
  );
}
