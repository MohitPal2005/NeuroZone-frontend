import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth();
const provider = new GoogleAuthProvider();

/**
 * Listen to Firebase auth state changes
 * @param {function} setUser - callback to set user state
 * @param {function} setLoading - callback to set loading state
 */
export function listenAuth(setUser, setLoading) {
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser || null);
    setLoading(false);
  });
}


export async function loginWithGoogle() {
  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Google login failed:", err);
    throw err;
  }
}

/**
 * Get Firebase ID token of the current user
 * @returns {Promise<string|null>}
 */
export async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

/**
 * Get the current Firebase user object
 * @returns {User|null}
 */
export function getCurrentUser() {
  return auth.currentUser || null;
}

export default auth;
