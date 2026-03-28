/**
 * Per-user favorites in localStorage (mock / fallback when Firestore unavailable).
 * Legacy key domservices-mock-favorites is migrated into the first user read.
 */

const LEGACY_FAV_KEY = "domservices-mock-favorites";
const USER_FAV_PREFIX = "domservices-fav-user-";

function userFavKey(userId: string): string {
  return `${USER_FAV_PREFIX}${userId}`;
}

function readStored(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const userRaw = localStorage.getItem(userFavKey(userId));
    if (userRaw) return JSON.parse(userRaw) as string[];
    const legacy = localStorage.getItem(LEGACY_FAV_KEY);
    if (legacy) {
      const ids = JSON.parse(legacy) as string[];
      localStorage.setItem(userFavKey(userId), JSON.stringify(ids));
      return ids;
    }
    return [];
  } catch {
    return [];
  }
}

function writeStored(userId: string, ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(userFavKey(userId), JSON.stringify(ids));
}

/** Remove per-user mock storage (e.g. after successful Firestore migration). */
export function clearStoredFavoritesForUser(userId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(userFavKey(userId));
  localStorage.removeItem(LEGACY_FAV_KEY);
}

export function getFavoriteIds(userId: string): string[] {
  return readStored(userId);
}

export function isFavorite(providerId: string, userId: string): boolean {
  return readStored(userId).includes(providerId);
}

export function toggleFavorite(providerId: string, userId: string): boolean {
  const favs = [...readStored(userId)];
  const idx = favs.indexOf(providerId);
  if (idx === -1) {
    favs.push(providerId);
    writeStored(userId, favs);
    return true;
  }
  favs.splice(idx, 1);
  writeStored(userId, favs);
  return false;
}
