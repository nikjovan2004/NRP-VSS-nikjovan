import type { Review } from "@/types/review";

const REVIEWS_KEY = "domservices-mock-reviews";

function getStoredReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStoredReviews(reviews: Review[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

export function createReview(
  orderId: string,
  customerId: string,
  customerName: string,
  providerId: string,
  rating: number,
  comment: string
): Review {
  const reviews = getStoredReviews();
  const review: Review = {
    id: `rev-${Date.now()}`,
    orderId,
    customerId,
    customerName,
    providerId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(review);
  setStoredReviews(reviews);
  return review;
}

export function getReviewsByProviderId(providerId: string): Review[] {
  return getStoredReviews().filter((r) => r.providerId === providerId);
}

export function hasReviewForOrder(orderId: string): boolean {
  return getStoredReviews().some((r) => r.orderId === orderId);
}
