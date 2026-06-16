// Firebase Phone Auth wiring.
// Runs entirely client-side. If the VITE_FIREBASE_* env vars are not set,
// `firebaseEnabled` is false and the app falls back to the demo mock flow.
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(cfg.apiKey && cfg.authDomain && cfg.projectId);

let auth = null;
let db = null;
if (firebaseEnabled) {
  const app = initializeApp(cfg);
  auth = getAuth(app);
  auth.useDeviceLanguage();
  db = getFirestore(app);
}

export { auth, db };

// Lazily create one invisible reCAPTCHA verifier bound to a container element id.
let recaptcha = null;
function getRecaptcha(containerId) {
  if (!recaptcha) {
    recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  }
  return recaptcha;
}

/**
 * Send an OTP to a 10-digit Indian number.
 * Returns a confirmationResult you pass to confirmOtp().
 */
export async function sendOtp(phone10, recaptchaContainerId) {
  const verifier = getRecaptcha(recaptchaContainerId);
  return signInWithPhoneNumber(auth, `+91${phone10}`, verifier);
}

/** Verify the 6-digit code. Resolves to the Firebase user on success. */
export async function confirmOtp(confirmationResult, code) {
  const cred = await confirmationResult.confirm(code);
  return cred.user;
}
