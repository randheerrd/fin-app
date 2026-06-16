import { useState, useEffect, useRef } from 'react';

export default function StepOTP({ mobile, onSubmit, onChangeNumber }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (newOtp.every(d => d)) {
      onSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const otpString = otp.join('');

  return (
    <div className="max-w-md w-full px-4">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-text-primary mb-2">Enter OTP</h1>
        <p className="text-text-dim text-sm">Sent to +91 {mobile}</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex gap-3 justify-center">
          {[0, 1, 2, 3].map(i => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="text"
              maxLength="1"
              inputMode="numeric"
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-14 h-14 text-2xl text-center bg-bg-card border border-line rounded-lg text-text-primary outline-none focus:border-sage"
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit(otpString)}
        disabled={otpString.length !== 4}
        className="w-full bg-sage text-bg py-3 rounded-lg font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3"
      >
        Verify OTP
      </button>

      <button
        onClick={onChangeNumber}
        className="w-full text-sage py-3 rounded-lg font-medium hover:bg-bg-card transition-colors"
      >
        Change number
      </button>
    </div>
  );
}
