/**
 * Provider slots data layer: writes to Firestore when configured, always to mock (localStorage).
 */

import { isFirebaseConfigured } from "./firebase";
import {
  addFirestoreProviderSlot,
  removeFirestoreProviderSlot,
  setFirestoreProviderSlots,
} from "./firestoreClient";
import {
  addProviderSlot as mockAddProviderSlot,
  removeProviderSlot as mockRemoveProviderSlot,
  getProviderSlots,
  setProviderSlots,
  getDefaultSlots,
} from "./mock-providers";
import type { TimeSlot } from "@/types/provider";

export async function seedDefaultSlotsIfEmpty(
  providerId: string
): Promise<void> {
  if (getProviderSlots(providerId).length === 0) {
    const defaults = getDefaultSlots();
    setProviderSlots(providerId, defaults);
    if (typeof window !== "undefined" && isFirebaseConfigured()) {
      await setFirestoreProviderSlots(providerId, defaults);
    }
  }
}

export async function addProviderSlot(
  providerId: string,
  slot: TimeSlot
): Promise<void> {
  mockAddProviderSlot(providerId, slot);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await addFirestoreProviderSlot(providerId, slot);
  }
}

export async function removeProviderSlot(
  providerId: string,
  date: string,
  start: string
): Promise<void> {
  mockRemoveProviderSlot(providerId, date, start);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await removeFirestoreProviderSlot(providerId, date, start);
  }
}
