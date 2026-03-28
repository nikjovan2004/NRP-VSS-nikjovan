/**
 * Firebase Auth wrapper for DomServices.
 * Uses Email/Password sign-in.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential,
} from "firebase/auth";
import { getFirebaseAuth } from "./firebase";
import { getFirestoreUser, createFirestoreUser, setFirestoreUser } from "./firestoreClient";
import type { UserRole } from "@/types/auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  providerProfileId?: string;
}

function firebaseUserToAuthUser(fb: FirebaseUser, fsUser: AuthUser | null): AuthUser {
  return {
    id: fb.uid,
    email: fb.email ?? "",
    name: fsUser?.name ?? fb.email?.split("@")[0] ?? "",
    role: fsUser?.role ?? "customer",
    providerProfileId: fsUser?.providerProfileId,
  };
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) return { success: false, error: "Firebase ni konfiguriran." };

  try {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const providerProfileId = role === "provider" ? `dyn-${Date.now()}` : undefined;

    const authUser: AuthUser = {
      id: cred.user.uid,
      email,
      name,
      role,
      providerProfileId,
    };

    await createFirestoreUser({
      id: cred.user.uid,
      email,
      name,
      role,
      providerProfileId,
    });

    return { success: true, user: authUser };
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err.code === "auth/email-already-in-use") {
      return { success: false, error: "Račun s tem e-poštnim naslovom že obstaja." };
    }
    return { success: false, error: err.message ?? "Registracija ni uspela." };
  }
}

export async function signIn(
  email: string,
  password: string,
  role: UserRole
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) return { success: false, error: "Firebase ni konfiguriran." };

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const fsUser = await getFirestoreUser(cred.user.uid);

    if (fsUser && fsUser.role !== role) {
      await firebaseSignOut(auth);
      return { success: false, error: "Napačna vloga. Prijavite se kot " + (role === "customer" ? "stranka" : "ponudnik") + "." };
    }

    const authUser = firebaseUserToAuthUser(cred.user, fsUser);
    return { success: true, user: authUser };
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
      return { success: false, error: "Uporabnik ni najden. Preverite e-pošto in geslo." };
    }
    return { success: false, error: err.message ?? "Prijava ni uspela." };
  }
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) await firebaseSignOut(auth);
}

export async function getCurrentAuthUser(): Promise<AuthUser | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  const fbUser = auth.currentUser;
  if (!fbUser) return null;

  const fsUser = await getFirestoreUser(fbUser.uid);
  return firebaseUserToAuthUser(fbUser, fsUser);
}

export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }

  const unsub = onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    const fsUser = await getFirestoreUser(fbUser.uid);
    callback(firebaseUserToAuthUser(fbUser, fsUser));
  });

  return unsub;
}

export async function updateAuthUserProfile(
  userId: string,
  updates: { name?: string; providerProfileId?: string }
): Promise<void> {
  const fsUser = await getFirestoreUser(userId);
  if (!fsUser) return;

  const updated: Parameters<typeof setFirestoreUser>[0] = {
    ...fsUser,
    ...updates,
  };
  await setFirestoreUser(updated);
}
