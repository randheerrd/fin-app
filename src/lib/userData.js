// Per-user data persistence. Primary store is Firestore (one doc per user), with
// a localStorage mirror so a returning user's data survives reloads even when
// Firestore is unreachable, empty, or not yet configured — otherwise the app
// would treat them as new and bounce them back into onboarding on every visit.
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from './firebase';

const cacheKey = (uid) => `finapp:user:${uid}`;

function readCache(uid) {
  try {
    const raw = localStorage.getItem(cacheKey(uid));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(uid, data) {
  try {
    localStorage.setItem(cacheKey(uid), JSON.stringify(data));
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// Subscribe to auth state. Returns an unsubscribe fn (noop if Firebase off).
export function onUser(cb) {
  if (!firebaseEnabled || !auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

// Load this user's saved app data, or null if none yet.
// Prefers Firestore but falls back to the local mirror so reloads stay sticky.
export async function loadUserData(uid) {
  if (!uid) return null;
  const cached = readCache(uid);
  if (!firebaseEnabled || !db) return cached;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      writeCache(uid, data);
      return data;
    }
    return cached; // Firestore has nothing for this user yet → use local copy
  } catch {
    return cached; // Firestore unreachable / rules deny → use local copy
  }
}

// Merge-save the user's app data: always to localStorage, best-effort to Firestore.
export async function saveUserData(uid, data) {
  if (!uid) return;
  const payload = { ...data, updatedAt: Date.now() };
  writeCache(uid, payload);
  if (!firebaseEnabled || !db) return;
  try {
    await setDoc(doc(db, 'users', uid), payload, { merge: true });
  } catch {
    /* keep the local copy; Firestore can sync on a later save */
  }
}
