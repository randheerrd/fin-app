// Mints a Firebase custom token after Twilio confirms an OTP, so the client
// can sign in and keep using the existing Firestore rules (which require a
// real Firebase-authenticated uid). Runs ONLY on the server.
// Optional: if these env vars aren't set, mintCustomToken resolves to null
// and the client just proceeds without a Firestore-backed session.
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export function firebaseAdminEnabled() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
  );
}

let app = null;
function getAdminApp() {
  if (!app) {
    app =
      getApps()[0] ||
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
  }
  return app;
}

export async function mintCustomToken(uid) {
  if (!firebaseAdminEnabled()) return null;
  return getAuth(getAdminApp()).createCustomToken(uid);
}
