import { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function StepOTP({ mobile, onSubmit, onChangeNumber }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Enter the code</h1>
        <p className="text-[#6b7280] text-sm">We sent a 6-digit code to +91{mobile}</p>
      </div>

      <div className="flex gap-3 justify-center mb-8">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <input
            key={i}
            ref={inputRefs[i]}
            autoFocus={i === 0}
            type="text"
            maxLength="1"
            inputMode="numeric"
            value={otp[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="w-12 h-12 text-xl text-center border border-[#e5e7eb] rounded-lg text-[#111827] outline-none focus:border-[#1B3A2F] focus:ring-1 focus:ring-[#1B3A2F]/20 transition-colors"
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onChangeNumber}
          className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => onSubmit(otpString)}
          disabled={otpString.length !== 6}
          className="px-5 py-2.5 bg-[#1B3A2F] text-white text-sm font-medium rounded-lg hover:bg-[#142D24] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
