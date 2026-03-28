/**
 * Firebase initialization.
 * Reads config from environment variables.
 * Add these to .env.local (see .env.example).
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp | undefined {
  if (typeof window === "undefined") return undefined;
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return undefined;
  if (!app) {
    app = getApps().length > 0 ? (getApps()[0] as FirebaseApp) : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth | undefined {
  if (typeof window === "undefined") return undefined;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export function getFirestoreDb(): Firestore | undefined {
  if (typeof window === "undefined") return undefined;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return undefined;
  if (!db) db = getFirestore(firebaseApp);
  return db;
}

export function isFirebaseConfigured(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}
