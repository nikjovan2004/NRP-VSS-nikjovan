/**
 * Favorites data layer: Firestore when Firebase Auth session matches userId,
 * otherwise per-user localStorage (mock-favorites).
 */

import { isFirebaseConfigured, getFirebaseAuth } from "./firebase";
import {
  getFirestoreFavoriteIds,
  setFirestoreFavorites,
  toggleFirestoreFavorite,
} from "./firestoreClient";
import {
  getFavoriteIds as mockGetFavoriteIds,
  toggleFavorite as mockToggleFavorite,
  clearStoredFavoritesForUser,
} from "@/lib/mock-favorites";

const MIGRATED_KEY_PREFIX = "domservices-fav-migrated-";

/** Use Firestore only when the user is signed in with Firebase (rules require auth). */
function useFirestoreForFavorites(userId: string): boolean {
  if (typeof window === "undefined") return false;
  if (!isFirebaseConfigured()) return false;
  const auth = getFirebaseAuth();
  const uid = auth?.currentUser?.uid;
  return uid != null && uid === userId;
}

function dispatchFavoritesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("domservices-favorites-changed"));
}

async function migrateLocalFavoritesToFirestore(userId: string): Promise<void> {
  if (typeof window === "undefined") return;
  const migratedKey = MIGRATED_KEY_PREFIX + userId;
  if (localStorage.getItem(migratedKey)) return;
  try {
    const localIds = mockGetFavoriteIds(userId);
    if (localIds.length === 0) {
      localStorage.setItem(migratedKey, "1");
      return;
    }
    const firestoreIds = await getFirestoreFavoriteIds(userId);
    const merged = [...new Set([...firestoreIds, ...localIds])];
    await setFirestoreFavorites(userId, merged);
    clearStoredFavoritesForUser(userId);
    localStorage.setItem(migratedKey, "1");
  } catch {
    // Migration failed; leave localStorage intact, don't mark migrated
  }
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  if (typeof window !== "undefined" && useFirestoreForFavorites(userId)) {
    try {
      await migrateLocalFavoritesToFirestore(userId);
      return await getFirestoreFavoriteIds(userId);
    } catch {
      return mockGetFavoriteIds(userId);
    }
  }
  return mockGetFavoriteIds(userId);
}

export async function isFavorite(
  userId: string,
  providerId: string
): Promise<boolean> {
  const ids = await getFavoriteIds(userId);
  return ids.includes(providerId);
}

export async function toggleFavorite(
  userId: string,
  providerId: string
): Promise<boolean> {
  let result: boolean;
  if (typeof window !== "undefined" && useFirestoreForFavorites(userId)) {
    try {
      result = await toggleFirestoreFavorite(userId, providerId);
    } catch {
      result = mockToggleFavorite(providerId, userId);
    }
  } else {
    result = mockToggleFavorite(providerId, userId);
  }
  dispatchFavoritesChanged();
  return result;
}
