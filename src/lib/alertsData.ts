/**
 * Alerts data layer: customer wishes "notify me when provider [category] appears in [city]".
 * Firestore when configured, else mock (localStorage).
 */

import { isFirebaseConfigured } from "./firebase";
import {
  addFirestoreAlert,
  getFirestoreAlertsByCategoryAndCity,
} from "./firestoreClient";
import { providerToCategory } from "./aiSearch";
import { addNotification } from "./notificationsData";
import type { Provider } from "@/types/provider";

const MOCK_ALERTS_KEY = "domservices-mock-alerts";

interface MockAlert {
  userId: string;
  category: string;
  city: string;
}

function getMockAlerts(): MockAlert[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(MOCK_ALERTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setMockAlerts(alerts: MockAlert[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_ALERTS_KEY, JSON.stringify(alerts));
}

export async function addAlert(
  userId: string,
  category: string,
  city: string
): Promise<void> {
  const normalized = city.trim();
  if (!normalized) return;
  const existing = getMockAlerts();
  if (!existing.some((a) => a.userId === userId && a.category === category && a.city === normalized)) {
    existing.push({ userId, category, city: normalized });
    setMockAlerts(existing);
  }
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await addFirestoreAlert(userId, category, normalized);
  }
}

export async function getAlertsByCategoryAndCity(
  category: string,
  city: string
): Promise<{ userId: string }[]> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreAlertsByCategoryAndCity(category, city);
  }
  const mock = getMockAlerts();
  return mock
    .filter((a) => a.category === category && a.city === city)
    .map((a) => ({ userId: a.userId }));
}

const CATEGORY_LABELS: Record<string, string> = {
  plumber: "vodovodarstvo",
  electrician: "elektrika",
  cleaner: "čiščenje",
  gardener: "vrtnarstvo",
  other: "storitev",
};

/**
 * After a provider profile is saved: notify users who asked for alerts in this category + city.
 */
export async function notifyAlertsForNewProvider(provider: Provider): Promise<void> {
  const category = providerToCategory(provider);
  if (!category || !provider.location.trim()) return;
  const city = provider.location.trim();
  const alerts = await getAlertsByCategoryAndCity(category, city);
  const label = CATEGORY_LABELS[category] ?? category;
  for (const { userId } of alerts) {
    if (userId === provider.id) continue;
    await addNotification(
      userId,
      "Nov ponudnik v vaši lokaciji",
      `V ${city} je na voljo ${label}: ${provider.name}.`,
      "/customer/search"
    );
  }
}
