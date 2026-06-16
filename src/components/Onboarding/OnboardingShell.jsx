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

export default function OnboardingShell({
  onBankConnected,
  onManualMode,
  linkingMode,
  onLinkBankComplete,
}) {
  const [step, setStep] = useState(linkingMode ? 'mobile' : 'path');
  const [path, setPath] = useState(null); // 'track' or 'goal'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [foundAccounts, setFoundAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  // Step 1: Path choice
  const handlePathChoice = (chosen) => {
    setPath(chosen);
    if (chosen === 'track') {
      setStep('track-setup');
    } else {
      setStep('goal-setup');
    }
  };

  // Step 2a: Track path setup
  const handleTrackSetup = (action) => {
    if (action === 'continue') {
      setStep('mobile');
    } else if (action === 'skip') {
      onManualMode();
    }
  };

  // Step 2b: Goal path setup
  const handleGoalSetup = (action) => {
    if (action === 'continue') {
      setStep('mobile');
    } else if (action === 'skip') {
      onManualMode();
    }
  };

  // Step 3: Mobile entry
  const handleMobileSubmit = (phoneNumber) => {
    setMobile(phoneNumber);
    setStep('otp');
  };

  const handleMobileBack = () => {
    if (linkingMode) {
      // In linking mode, can't go back
      return;
    }
    setStep(path === 'track' ? 'track-setup' : 'goal-setup');
    setMobile('');
  };

  // Step 4: OTP
  const handleOTPSubmit = (otpCode) => {
    setOtp(otpCode);
    setStep('discovery');
  };

  const handleOTPChangeNumber = () => {
    setMobile('');
    setOtp('');
    setStep('mobile');
  };

  // Step 5: Discovery
  const handleDiscoveryComplete = (accounts) => {
    if (accounts.length === 0) {
      // No accounts found
      setFoundAccounts([]);
      setStep('no-accounts');
    } else {
      // Accounts found
      setFoundAccounts(accounts);
      setSelectedAccounts(accounts.map((_, i) => i === 0)); // Pre-check first
      setStep('account-select');
    }
  };

  // Step 6e: No accounts
  const handleNoAccountsTryAgain = () => {
    setMobile('');
    setOtp('');
    setStep('mobile');
  };

  const handleNoAccountsManual = () => {
    onManualMode();
  };

  // Step 6: Account select
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
    setOtp('');
    setStep('mobile');
  };

  // Step 7: Consent
  const handleConsentAccept = () => {
    setStep('import');
  };

  const handleConsentBack = () => {
    setStep('account-select');
  };

  // Step 8: Import
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
    <div className="w-full h-full flex items-center justify-center bg-bg">
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
          onSubmit={handleOTPSubmit}
          onChangeNumber={handleOTPChangeNumber}
        />
      )}
      {step === 'discovery' && (
        <StepDiscovery
          mobile={mobile}
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
  );
}
