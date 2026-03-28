/**
 * Review data layer: Firestore when configured, else mock.
 */

import { isFirebaseConfigured } from "./firebase";
import {
  createFirestoreReview,
  getFirestoreReviewsByProviderId,
  getFirestoreHasReviewForOrder,
} from "./firestoreClient";
import {
  createReview as mockCreateReview,
  getReviewsByProviderId as mockGetReviewsByProviderId,
  hasReviewForOrder as mockHasReviewForOrder,
} from "@/lib/mock-reviews";
import { getProviderById } from "@/lib/mock-providers";
import { upsertProvider } from "@/lib/providersData";
import type { Review } from "@/types/review";

function calcAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

async function getReviews(providerId: string): Promise<Review[]> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreReviewsByProviderId(providerId);
  }
  return mockGetReviewsByProviderId(providerId);
}

export async function getReviewsByProviderId(providerId: string): Promise<Review[]> {
  return getReviews(providerId);
}

export async function hasReviewForOrder(orderId: string): Promise<boolean> {
  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    return getFirestoreHasReviewForOrder(orderId);
  }
  return mockHasReviewForOrder(orderId);
}

export async function createReview(
  orderId: string,
  customerId: string,
  customerName: string,
  providerId: string,
  rating: number,
  comment: string
): Promise<Review> {
  const reviewData: Omit<Review, "id"> = {
    orderId,
    customerId,
    customerName,
    providerId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  const review = mockCreateReview(
    orderId,
    customerId,
    customerName,
    providerId,
    rating,
    comment
  );

  if (typeof window !== "undefined" && isFirebaseConfigured()) {
    try {
      await createFirestoreReview(reviewData);
    } catch {
      // Firestore write failed; mock was created
    }
  }

  const provider = getProviderById(providerId);
  if (provider) {
    const reviews = await getReviews(providerId);
    const newRating = calcAverageRating(reviews);
    const newCount = reviews.length;
    await upsertProvider({
      ...provider,
      rating: newRating,
      reviewCount: newCount,
      verified: provider.verified || newCount > 0,
    });
  }

  return review;
}
