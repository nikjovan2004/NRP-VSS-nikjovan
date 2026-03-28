/**
 * Auth facade: uses Firebase when configured, otherwise mock.
 * Provides a unified interface for the rest of the app.
 */

import { isFirebaseConfigured } from "./firebase";
import * as firebaseAuth from "./firebase-auth";
import * as mockAuth from "./mock-auth";
import type { UserRole } from "@/types/auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  providerProfileId?: string;
}

function useFirebase(): boolean {
  if (typeof window === "undefined") return false;
  return isFirebaseConfigured();
}

export function getCurrentUser(): AuthUser | null {
  if (useFirebase()) {
    // Firebase auth is async - we can't return synchronously.
    // The app currently expects sync getCurrentUser. We need to bridge.
    // For now: firebase-auth will be used via async flows (login/register).
    // getCurrentUser is called in many places sync. Options:
    // A) Store last user in React state/context after auth change
    // B) Keep a module-level cache updated by onAuthChange
    // C) Make all consumers async
    // We'll use B: maintain a sync cache that onAuthChange updates.
    return getAuthCache();
  }
  const u = mockAuth.getCurrentUser();
  return u ? { id: u.id, email: u.email, name: u.name, role: u.role, providerProfileId: u.providerProfileId } : null;
}

let authCache: AuthUser | null = null;

export function setAuthCache(user: AuthUser | null) {
  authCache = user;
}

function getAuthCache(): AuthUser | null {
  return authCache;
}

export function initAuthListener() {
  if (!useFirebase()) return;
  firebaseAuth.onAuthChange((user) => {
    setAuthCache(user);
  });
}

export async function login(
  email: string,
  password: string,
  role: UserRole
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (useFirebase()) {
    const result = await firebaseAuth.signIn(email, password, role);
    if (result.success && result.user) setAuthCache(result.user);
    return result;
  }
  const r = mockAuth.mockLogin(email, password, role);
  return {
    success: r.success,
    user: r.user ? { id: r.user.id, email: r.user.email, name: r.user.name, role: r.user.role, providerProfileId: r.user.providerProfileId } : undefined,
    error: r.error,
  };
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (useFirebase()) {
    const result = await firebaseAuth.signUp(email, password, name, role);
    if (result.success && result.user) setAuthCache(result.user);
    return result;
  }
  const r = mockAuth.mockRegister(email, password, name, role);
  return {
    success: r.success,
    user: r.user ? { id: r.user.id, email: r.user.email, name: r.user.name, role: r.user.role, providerProfileId: r.user.providerProfileId } : undefined,
    error: r.error,
  };
}

export async function logout(): Promise<void> {
  if (useFirebase()) {
    await firebaseAuth.signOut();
    setAuthCache(null);
  } else {
    mockAuth.mockLogout();
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (useFirebase()) {
    setAuthCache(user);
    if (user) {
      firebaseAuth.updateAuthUserProfile(user.id, {
        name: user.name,
        providerProfileId: user.providerProfileId,
      }).catch(() => {});
    }
  } else {
    mockAuth.setCurrentUser(user ? {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      providerProfileId: user.providerProfileId,
    } : null);
  }
}
