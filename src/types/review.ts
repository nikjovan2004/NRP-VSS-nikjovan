export interface Review {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
