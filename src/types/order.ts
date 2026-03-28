export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "paid";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  date: string;
  start: string;
  end: string;
  address: string;
  notes: string;
  status: OrderStatus;
  createdAt: string; // ISO string
}
