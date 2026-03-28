import type { Order, OrderStatus } from "@/types/order";

const ORDERS_KEY = "domservices-mock-orders";

function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(
  customerId: string,
  customerName: string,
  providerId: string,
  providerName: string,
  date: string,
  start: string,
  end: string,
  address: string,
  notes: string
): Order {
  const orders = getStoredOrders();
  const order: Order = {
    id: `ord-${Date.now()}`,
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
  orders.unshift(order);
  setStoredOrders(orders);
  return order;
}

export function getOrdersByCustomerId(customerId: string): Order[] {
  return getStoredOrders().filter((o) => o.customerId === customerId);
}

export function getOrdersByProviderId(providerId: string): Order[] {
  return getStoredOrders()
    .filter((o) => o.providerId === providerId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getBookedSlotsForProvider(
  providerId: string
): { date: string; start: string }[] {
  return getStoredOrders()
    .filter(
      (o) =>
        o.providerId === providerId &&
        o.status !== "cancelled"
    )
    .map((o) => ({ date: o.date, start: o.start }));
}

export function acceptOrder(orderId: string): Order | null {
  return updateOrderStatus(orderId, "confirmed");
}

export function rejectOrder(orderId: string): Order | null {
  return updateOrderStatus(orderId, "cancelled");
}

export function getOrderById(id: string): Order | undefined {
  return getStoredOrders().find((o) => o.id === id);
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Order | null {
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], status };
  setStoredOrders(orders);
  return orders[idx];
}

export function cancelOrder(orderId: string): Order | null {
  return updateOrderStatus(orderId, "cancelled");
}
