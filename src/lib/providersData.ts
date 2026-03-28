/**
 * Provider data layer: writes to Firestore when configured, always to mock (localStorage).
 */

import { isFirebaseConfigured } from "./firebase";
import { setFirestoreProvider } from "./firestoreClient";
import { upsertDynamicProvider } from "./mock-providers";
import { notifyAlertsForNewProvider } from "./alertsData";
import type { Provider } from "@/types/provider";

export async function upsertProvider(provider: Provider): Promise<void> {
  upsertDynamicProvider(provider);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await setFirestoreProvider(provider);
  }
  if (typeof window !== "undefined") {
    await notifyAlertsForNewProvider(provider);
  }
}
