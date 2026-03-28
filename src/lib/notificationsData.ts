/**
 * Notifications data layer: Firestore when configured, else mock.
 */

import { isFirebaseConfigured } from "./firebase";
import {
  addFirestoreNotification,
  getFirestoreNotificationsForUser,
  getFirestoreUnreadCount,
  markFirestoreAllNotificationsRead,
  markFirestoreNotificationRead,
} from "./firestoreClient";
import {
  addNotification as mockAddNotification,
  getNotificationsForUser as mockGetNotificationsForUser,
  getUnreadCount as mockGetUnreadCount,
  markAllRead as mockMarkAllRead,
  markRead as mockMarkRead,
} from "@/lib/mock-notifications";
import type { Notification } from "@/lib/mock-notifications";
export type { Notification };

export async function addNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
): Promise<Notification> {
  const notif = mockAddNotification(userId, title, message, link);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    try {
      await addFirestoreNotification(userId, title, message, link);
    } catch {
      // Firestore write failed
    }
  }
  return notif;
}

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreNotificationsForUser(userId);
  }
  return mockGetNotificationsForUser(userId);
}

export async function getUnreadCount(userId: string): Promise<number> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreUnreadCount(userId);
  }
  return mockGetUnreadCount(userId);
}

export async function markAllRead(userId: string): Promise<void> {
  mockMarkAllRead(userId);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await markFirestoreAllNotificationsRead(userId);
  }
}

export async function markRead(notifId: string): Promise<void> {
  mockMarkRead(notifId);
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    await markFirestoreNotificationRead(notifId);
  }
}
