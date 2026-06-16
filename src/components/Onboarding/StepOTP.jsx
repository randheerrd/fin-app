import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';
import accountAggregatorAPI from '../../lib/api';

export default function StepOTP({ mobile, consentId, onSubmit, onChangeNumber }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (otpCode) => {
    setLoading(true);
    setError('');

    try {
      const response = await accountAggregatorAPI.verifyOTP(consentId, otpCode);
      if (response.token || response.success) {
        onSubmit(otpCode, response.token);
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('OTP verification error:', err);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-[#111827] mb-2">Enter the code</h1>
        <p className="text-[#6b7280] text-sm flex items-center justify-center gap-1.5">
          We sent a 6-digit code to +91{mobile}
          <button
            onClick={onChangeNumber}
            className="inline-flex items-center gap-1 text-[#0E3F2E] font-medium hover:underline"
          >
            <Pencil size={13} />
            Edit
          </button>
        </p>
      </div>

      <div className="flex gap-2.5 justify-center items-center mb-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            {i === 3 && <span className="text-[#9ca3af] font-bold">·</span>}
            <input
              ref={inputRefs[i]}
              autoFocus={i === 0}
              type="text"
              maxLength="1"
              inputMode="numeric"
              value={otp[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              disabled={loading}
              className="w-12 h-14 text-xl text-center border border-[#e5e7eb] rounded-lg text-[#111827] outline-none focus:border-[#0E3F2E] focus:ring-1 focus:ring-[#0E3F2E]/20 transition-colors disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      {loading && <p className="text-[#9ca3af] text-xs text-center">Verifying…</p>}
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
    </div>
  );
}
