// Mints a Firebase custom token after Twilio confirms an OTP, so the client
// can sign in and keep using the existing Firestore rules (which require a
// real Firebase-authenticated uid). Runs ONLY on the server.
// Optional: if these env vars aren't set, mintCustomToken resolves to null
// and the client just proceeds without a Firestore-backed session.
//
// `firebase-admin` is imported lazily (only inside mintCustomToken, only once
// enabled) because a static top-level import loads it as soon as any file that
// imports this module loads — which crashed every /api/otp/verify call in
// production (Error [ERR_REQUIRE_ESM]) even when Firebase Admin creds weren't
// set and this code path would never run.

export function firebaseAdminEnabled() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
  );
}

let app = null;
async function getAdminApp() {
  if (!app) {
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
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
  const { getAuth } = await import('firebase-admin/auth');
  return getAuth(await getAdminApp()).createCustomToken(uid);
}
