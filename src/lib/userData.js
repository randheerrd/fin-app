// Per-user data persistence in Firestore (one document per user).
// All functions no-op when Firebase isn't configured, so the demo keeps working.
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from './firebase';

// Subscribe to auth state. Returns an unsubscribe fn (noop if Firebase off).
export function onUser(cb) {
  if (!firebaseEnabled || !auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

// Load this user's saved app data, or null if none yet.
export async function loadUserData(uid) {
  if (!firebaseEnabled || !db || !uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

// Merge-save the user's app data.
export async function saveUserData(uid, data) {
  if (!firebaseEnabled || !db || !uid) return;
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: Date.now() }, { merge: true });
}
