/**
 * Order data layer: writes to Firestore when configured, always to mock (localStorage).
 */

import { isFirebaseConfigured } from "./firebase";
import { createFirestoreOrder, updateFirestoreOrderStatus } from "./firestoreClient";
import { createOrder as mockCreateOrder, updateOrderStatus as mockUpdateOrderStatus } from "./mock-orders";
import type { Order, OrderStatus } from "@/types/order";

export async function createOrder(
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
  const order = mockCreateOrder(
    customerId,
    customerName,
    providerId,
    providerName,
    date,
    start,
    end,
    address,
    notes
  );
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    try {
      await createFirestoreOrder(
        order.id,
        customerId,
        customerName,
        providerId,
        providerName,
        date,
        start,
        end,
        address,
        notes
      );
    } catch {
      // Firestore write failed; mock order was created
    }
  }
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<Order | null> {
  const updated = mockUpdateOrderStatus(orderId, status);
  if (typeof window !== "undefined" && isFirebaseConfigured() && updated) {
    try {
      await updateFirestoreOrderStatus(orderId, status);
    } catch {
      // Firestore update failed
    }
  }
  return updated;
}
