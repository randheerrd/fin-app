import { useState, useRef, useEffect } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { auth, firebaseEnabled, sendOtp as sendFirebaseOtp, confirmOtp as confirmFirebaseOtp, resetRecaptcha } from './firebase';
import { isDemoPhone, demoCode } from '../data/demoSeed';

const RESEND_COOLDOWN_SECONDS = 60;
const FIREBASE_SEND_TIMEOUT_MS = 15000;

function withTimeout(promise, ms, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
  ]);
}

// Phone OTP login: tries Twilio Verify (server-side) first, falls back to
// Firebase Phone Auth if the Twilio endpoint is unavailable/unconfigured,
// and falls back to the demo mock if neither is configured. Demo phone
// numbers always skip straight to the mock regardless of provider.
export function useOtpAuth(recaptchaContainerId) {
  const [stage, setStage] = useState('phone');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const confirmationRef = useRef(null);
  const providerRef = useRef(null); // 'twilio' | 'firebase' | null

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const sendCode = async () => {
    if (phone.length !== 10 || resendCooldown > 0) return;
    setError('');
    if (isDemoPhone(phone)) {
      setStage('otp');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      return;
    }

    setLoading(true);
    try {
      const r = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!r.ok) throw new Error('twilio-unavailable');
      providerRef.current = 'twilio';
      setStage('otp');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      if (!firebaseEnabled) {
        setError('Could not send code.');
        setLoading(false);
        return;
      }
      try {
        confirmationRef.current = await withTimeout(
          sendFirebaseOtp(phone, recaptchaContainerId),
          FIREBASE_SEND_TIMEOUT_MS,
          'timed-out'
        );
        providerRef.current = 'firebase';
        setStage('otp');
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      } catch (e) {
        console.error(e);
        resetRecaptcha();
        setError(
          e?.message === 'timed-out'
            ? 'Taking too long to send. Please try again.'
            : e?.code
              ? `Couldn't send code — ${e.code}`
              : 'Could not send code.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const verify = async (code, onVerified) => {
    setError('');
    if (isDemoPhone(phone)) {
      if (code === demoCode(phone)) onVerified(phone);
      else setError('Invalid code. Please try again.');
      return;
    }

    setLoading(true);
    try {
      if (providerRef.current === 'twilio') {
        const r = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code }),
        });
        const data = await r.json();
        if (!r.ok || !data.verified) throw new Error(data.error || 'invalid-code');
        if (data.customToken) await signInWithCustomToken(auth, data.customToken);
        onVerified(phone);
      } else if (providerRef.current === 'firebase') {
        await confirmFirebaseOtp(confirmationRef.current, code);
        onVerified(phone);
      } else {
        onVerified(phone);
      }
    } catch (e) {
      console.error(e);
      if (e?.code === 'auth/code-expired') {
        setError('Code expired. Tap Resend for a new one.');
      } else if (e?.code === 'auth/invalid-verification-code') {
        setError('Invalid code. Please try again.');
      } else if (e?.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a bit and try again.');
      } else if (e?.code) {
        setError(`Couldn't verify — ${e.code}`);
      } else {
        setError(e?.message && e.message !== 'invalid-code' ? e.message : 'Invalid code. Please try again.');
      }
      setLoading(false);
    }
  };

  return { stage, setStage, phone, setPhone, loading, error, resendCooldown, sendCode, verify };
}
