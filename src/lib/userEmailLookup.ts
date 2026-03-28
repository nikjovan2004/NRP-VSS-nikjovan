/**
 * E-poštni naslov uporabnika po ID-ju (mock localStorage ali Firestore users).
 * Uporaba: obvestila stranki (npr. ko ponudnik sprejme naročilo).
 */

import { isFirebaseConfigured } from "./firebase";
import { getFirestoreUser } from "./firestoreClient";
import { getMockUserById } from "./mock-auth";

export async function getUserEmailById(userId: string): Promise<string | null> {
  if (typeof window === "undefined" || !userId) return null;
  if (isFirebaseConfigured()) {
    try {
      const u = await getFirestoreUser(userId);
      const e = u?.email?.trim();
      return e || null;
    } catch {
      return null;
    }
  }
  const u = getMockUserById(userId);
  const e = u?.email?.trim();
  return e || null;
}
