import { useState, useRef } from 'react';
import { Lock, Pencil } from 'lucide-react';
import FinAppLogo from './FinAppLogo';
import { useOtpAuth } from '../lib/useOtpAuth';

const RECAPTCHA_ID = 'login-recaptcha';

export default function LoginPage({ onBack, onSuccess }) {
  const { stage, setStage, phone, setPhone, loading, error, resendCooldown, sendCode: handleSendCode, verify: doVerify } =
    useOtpAuth(RECAPTCHA_ID);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const verify = (code) => doVerify(code, onSuccess);

  const handleOtp = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    if (v && i < 5) refs[i + 1].current?.focus();
    if (next.every((d) => d)) verify(next.join(''));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <button onClick={onBack} aria-label="Back to home" className="inline-flex">
          <FinAppLogo color="#0E3F2E" className="h-7 w-auto" />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl text-[#111827] mb-1.5">
            {stage === 'otp' ? 'Enter the code' : 'Continue to FinApp'}
          </h1>
          <p className="text-sm text-[#6b7280] mb-8 flex items-center gap-1.5">
            {stage === 'phone' ? (
              'One phone number for both new and returning accounts.'
            ) : (
              <>
                Sent to +91 {phone}
                <button
                  onClick={() => setStage('phone')}
                  className="inline-flex items-center gap-1 text-[#0E3F2E] font-medium hover:underline"
                >
                  <Pencil size={12} /> Edit
                </button>
              </>
            )}
          </p>

          {stage === 'phone' ? (
            <>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">Mobile number</label>
              <div className="flex items-center border border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#0E3F2E] mb-5">
                <span className="pl-4 pr-2 py-3 text-[#6b7280] text-sm select-none">+91</span>
                <input
                  autoFocus
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  onKeyDown={(e) => e.key === 'Enter' && phone.length === 10 && handleSendCode()}
                  placeholder="9876543210"
                  className="flex-1 pr-4 py-3 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={phone.length !== 10 || loading}
                className="w-full py-3 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send code'}
              </button>
            </>
          ) : (
            <>
              <div className="flex gap-2.5 items-center mb-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {i === 3 && <span className="text-[#9ca3af] font-bold">·</span>}
                    <input
                      ref={refs[i]}
                      autoFocus={i === 0}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtp(i, e.target.value)}
                      onKeyDown={(e) => e.key === 'Backspace' && !otp[i] && i > 0 && refs[i - 1].current?.focus()}
                      className="w-11 py-3 text-xl text-center border border-[#e5e7eb] rounded-lg text-[#111827] outline-none focus:border-[#0E3F2E] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => verify(otp.join(''))}
                disabled={otp.some((d) => !d) || loading}
                className="w-full py-3 bg-[#0E3F2E] text-white text-sm font-semibold rounded-lg hover:bg-[#0a3122] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying…' : 'Verify & continue'}
              </button>
              <p className="text-sm text-[#6b7280] text-center mt-4">
                {resendCooldown > 0 ? (
                  <>
                    Resend code in {Math.floor(resendCooldown / 60)}:
                    {String(resendCooldown % 60).padStart(2, '0')}
                  </>
                ) : (
                  <>
                    Didn't get it?{' '}
                    <button
                      onClick={handleSendCode}
                      disabled={loading}
                      className="text-[#0E3F2E] font-semibold hover:underline disabled:opacity-40"
                    >
                      Resend code
                    </button>
                  </>
                )}
              </p>
            </>
          )}

          {error && <p className="text-red-500 text-xs mt-3">{error}</p>}
          <div id={RECAPTCHA_ID} />

          <p className="text-xs text-[#9ca3af] flex items-center gap-1.5 mt-4">
            <Lock size={11} />
            Phone login · OTP-secured
          </p>
        </div>
      </div>
    </div>
  );
}
