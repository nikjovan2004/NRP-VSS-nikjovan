/**
 * Firestore client helpers for DomServices.
 * All functions return undefined/null or throw if Firebase is not configured.
 */

import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "./firebase";
import type { Provider, TimeSlot } from "@/types/provider";
import type { Order, OrderStatus } from "@/types/order";
import type { UserRole } from "@/types/auth";
import type { Review } from "@/types/review";

// --- Firestore paths ---
const USERS_COLL = "users";
const PROVIDERS_COLL = "providers";
const PROVIDER_SLOTS_COLL = "providerSlots";
const ORDERS_COLL = "orders";
const REVIEWS_COLL = "reviews";
const NOTIFICATIONS_COLL = "notifications";
const FAVORITES_COLL = "favorites";
const ALERTS_COLL = "alerts";

// --- User (stored in Firestore, linked to Auth UID) ---
export interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  providerProfileId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getFirestoreUser(userId: string): Promise<FirestoreUser | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const ref = doc(db, USERS_COLL, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreUser;
}

export async function setFirestoreUser(user: FirestoreUser): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, USERS_COLL, user.id);
  await setDoc(ref, {
    email: user.email,
    name: user.name,
    role: user.role,
    providerProfileId: user.providerProfileId ?? null,
    updatedAt: serverTimestamp(),
  } as DocumentData, { merge: true });
}

export async function createFirestoreUser(user: FirestoreUser): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, USERS_COLL, user.id);
  await setDoc(ref, {
    email: user.email,
    name: user.name,
    role: user.role,
    providerProfileId: user.providerProfileId ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as DocumentData);
}

// --- Providers (dynamic, MOCK_PROVIDERS stay in code) ---
export async function getFirestoreProvider(providerId: string): Promise<Provider | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const ref = doc(db, PROVIDERS_COLL, providerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name,
    services: data.services ?? [],
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,
    verified: data.verified ?? false,
    priceRange: data.priceRange ?? "",
    location: data.location ?? "",
    bio: data.bio,
  } as Provider;
}

export async function setFirestoreProvider(provider: Provider): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, PROVIDERS_COLL, provider.id);
  await setDoc(ref, {
    name: provider.name,
    services: provider.services,
    rating: provider.rating,
    reviewCount: provider.reviewCount,
    verified: provider.verified,
    priceRange: provider.priceRange,
    location: provider.location,
    bio: provider.bio ?? null,
    updatedAt: serverTimestamp(),
  } as DocumentData, { merge: true });
}

export async function getFirestoreProviders(): Promise<Provider[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(collection(db, PROVIDERS_COLL));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      services: data.services ?? [],
      rating: data.rating ?? 0,
      reviewCount: data.reviewCount ?? 0,
      verified: data.verified ?? false,
      priceRange: data.priceRange ?? "",
      location: data.location ?? "",
      bio: data.bio,
    } as Provider;
  });
}

// --- Provider slots ---
export async function getFirestoreProviderSlots(providerId: string): Promise<TimeSlot[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const ref = doc(db, PROVIDER_SLOTS_COLL, providerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return (snap.data().slots ?? []) as TimeSlot[];
}

export async function setFirestoreProviderSlots(
  providerId: string,
  slots: TimeSlot[]
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, PROVIDER_SLOTS_COLL, providerId);
  await setDoc(ref, { slots, updatedAt: serverTimestamp() } as DocumentData, { merge: true });
}

export async function addFirestoreProviderSlot(
  providerId: string,
  slot: TimeSlot
): Promise<void> {
  const slots = await getFirestoreProviderSlots(providerId);
  const exists = slots.some((s) => s.date === slot.date && s.start === slot.start);
  if (!exists) {
    slots.push(slot);
    await setFirestoreProviderSlots(providerId, slots);
  }
}

export async function removeFirestoreProviderSlot(
  providerId: string,
  date: string,
  start: string
): Promise<void> {
  const slots = (await getFirestoreProviderSlots(providerId)).filter(
    (s) => !(s.date === date && s.start === start)
  );
  await setFirestoreProviderSlots(providerId, slots);
}

// --- Orders ---
export async function createFirestoreOrder(
  orderId: string,
  customerId: string,
  customerName: string,
  providerId: string,
  providerName: string,
  date: string,
  start: string,
  end: string,
  address: string,
  notes: string
): Promise<Order> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not configured");
  const ref = doc(db, ORDERS_COLL, orderId);
  await setDoc(ref, {
    customerId,
    customerName,
    providerId,
    providerName,
    date,
    start,
    end,
    address,
    notes,
    status: "pending_confirmation",
    createdAt: serverTimestamp(),
  } as DocumentData);
  return {
    id: orderId,
    customerId,
    customerName,
    providerId,
    providerName,
    date,
    start,
    end,
    address,
    notes,
    status: "pending_confirmation",
    createdAt: new Date().toISOString(),
  };
}

export async function getFirestoreOrder(orderId: string): Promise<Order | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const ref = doc(db, ORDERS_COLL, orderId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    customerId: data.customerId,
    customerName: data.customerName,
    providerId: data.providerId,
    providerName: data.providerName,
    date: data.date,
    start: data.start,
    end: data.end,
    address: data.address,
    notes: data.notes,
    status: data.status as OrderStatus,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
  } as Order;
}

export async function getFirestoreOrdersByCustomerId(customerId: string): Promise<Order[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(
    collection(db, ORDERS_COLL),
    where("customerId", "==", customerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId,
      customerName: data.customerName,
      providerId: data.providerId,
      providerName: data.providerName,
      date: data.date,
      start: data.start,
      end: data.end,
      address: data.address,
      notes: data.notes,
      status: data.status as OrderStatus,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? "",
    } as Order;
  });
}

export async function getFirestoreOrdersByProviderId(providerId: string): Promise<Order[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(
    collection(db, ORDERS_COLL),
    where("providerId", "==", providerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      customerId: data.customerId,
      customerName: data.customerName,
      providerId: data.providerId,
      providerName: data.providerName,
      date: data.date,
      start: data.start,
      end: data.end,
      address: data.address,
      notes: data.notes,
      status: data.status as OrderStatus,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? "",
    } as Order;
  });
}

export async function getFirestoreBookedSlotsForProvider(
  providerId: string
): Promise<{ date: string; start: string }[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(
    collection(db, ORDERS_COLL),
    where("providerId", "==", providerId),
    where("status", "!=", "cancelled")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    date: d.data().date,
    start: d.data().start,
  }));
}

export async function updateFirestoreOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const db = getFirestoreDb();
  if (!db) return null;
  const ref = doc(db, ORDERS_COLL, orderId);
  await updateDoc(ref, { status } as DocumentData);
  return getFirestoreOrder(orderId);
}

// --- Reviews ---
export async function createFirestoreReview(review: Omit<Review, "id">): Promise<Review> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not configured");
  const ref = collection(db, REVIEWS_COLL);
  const docRef = await addDoc(ref, {
    ...review,
    createdAt: serverTimestamp(),
  } as DocumentData);
  return { ...review, id: docRef.id, createdAt: new Date().toISOString() };
}

export async function getFirestoreReviewsByProviderId(
  providerId: string
): Promise<Review[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(
    collection(db, REVIEWS_COLL),
    where("providerId", "==", providerId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      orderId: data.orderId,
      customerId: data.customerId,
      customerName: data.customerName,
      providerId: data.providerId,
      rating: data.rating,
      comment: data.comment ?? "",
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    } as Review;
  });
}

export async function getFirestoreHasReviewForOrder(orderId: string): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db) return false;
  const q = query(
    collection(db, REVIEWS_COLL),
    where("orderId", "==", orderId),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}

// --- Chat (subcollection: orders/{orderId}/messages) ---
export interface ChatMessage {
  id: string;
  orderId: string;
  senderRole: "customer" | "provider";
  senderName: string;
  text: string;
  createdAt: string;
}

export async function getFirestoreMessagesForOrder(
  orderId: string
): Promise<ChatMessage[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const ref = collection(db, ORDERS_COLL, orderId, "messages");
  const q = query(ref, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      orderId,
      senderRole: data.senderRole,
      senderName: data.senderName,
      text: data.text,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    } as ChatMessage;
  });
}

export async function sendFirestoreMessage(
  orderId: string,
  senderRole: "customer" | "provider",
  senderName: string,
  text: string
): Promise<ChatMessage> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not configured");
  const ref = collection(db, ORDERS_COLL, orderId, "messages");
  const docRef = await addDoc(ref, {
    senderRole,
    senderName,
    text: text.trim(),
    createdAt: serverTimestamp(),
  } as DocumentData);
  return {
    id: docRef.id,
    orderId,
    senderRole,
    senderName,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

// --- Notifications ---
export interface FirestoreNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export async function addFirestoreNotification(
  userId: string,
  title: string,
  message: string,
  link?: string
): Promise<FirestoreNotification> {
  const db = getFirestoreDb();
  if (!db) throw new Error("Firestore not configured");
  const ref = collection(db, NOTIFICATIONS_COLL);
  const docRef = await addDoc(ref, {
    userId,
    title,
    message,
    read: false,
    link: link ?? null,
    createdAt: serverTimestamp(),
  } as DocumentData);
  return {
    id: docRef.id,
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    link,
  };
}

export async function getFirestoreNotificationsForUser(
  userId: string
): Promise<FirestoreNotification[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const q = query(
    collection(db, NOTIFICATIONS_COLL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      title: data.title,
      message: data.message,
      read: data.read ?? false,
      link: data.link,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
    };
  });
}

export async function getFirestoreUnreadCount(userId: string): Promise<number> {
  const db = getFirestoreDb();
  if (!db) return 0;
  const q = query(
    collection(db, NOTIFICATIONS_COLL),
    where("userId", "==", userId),
    where("read", "==", false)
  );
  const snap = await getDocs(q);
  return snap.size;
}

export async function markFirestoreNotificationRead(notifId: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, NOTIFICATIONS_COLL, notifId);
  await updateDoc(ref, { read: true } as DocumentData);
}

export async function markFirestoreAllNotificationsRead(userId: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const q = query(
    collection(db, NOTIFICATIONS_COLL),
    where("userId", "==", userId),
    where("read", "==", false)
  );
  const snap = await getDocs(q);
  const batch = snap.docs.map((d) =>
    updateDoc(doc(db, NOTIFICATIONS_COLL, d.id), { read: true } as DocumentData)
  );
  await Promise.all(batch);
}

// --- Favorites (per user: favorites/{userId}) ---
export async function getFirestoreFavoriteIds(userId: string): Promise<string[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const ref = doc(db, FAVORITES_COLL, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return (snap.data().providerIds ?? []) as string[];
}

export async function setFirestoreFavorites(
  userId: string,
  providerIds: string[]
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const ref = doc(db, FAVORITES_COLL, userId);
  await setDoc(ref, {
    providerIds,
    updatedAt: serverTimestamp(),
  } as DocumentData, { merge: true });
}

export async function toggleFirestoreFavorite(
  userId: string,
  providerId: string
): Promise<boolean> {
  const ids = await getFirestoreFavoriteIds(userId);
  const idx = ids.indexOf(providerId);
  if (idx === -1) {
    ids.push(providerId);
    await setFirestoreFavorites(userId, ids);
    return true;
  }
  ids.splice(idx, 1);
  await setFirestoreFavorites(userId, ids);
  return false;
}

// --- Alerts (customer wishes: notify when provider appears in city) ---
export async function addFirestoreAlert(
  userId: string,
  category: string,
  city: string
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;
  const id = `${userId}_${category}_${city.replace(/\s+/g, "_")}`;
  const ref = doc(db, ALERTS_COLL, id);
  await setDoc(ref, {
    userId,
    category,
    city,
    createdAt: serverTimestamp(),
  } as DocumentData, { merge: true });
}

export async function getFirestoreAlertsByCategoryAndCity(
  category: string,
  city: string
): Promise<{ userId: string }[]> {
  const db = getFirestoreDb();
  if (!db) return [];
  const collRef = collection(db, ALERTS_COLL);
  const q = query(
    collRef,
    where("category", "==", category),
    where("city", "==", city)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ userId: d.data().userId as string }));
}
