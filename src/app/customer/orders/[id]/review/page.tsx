"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/mock-orders";
import { createReview, hasReviewForOrder } from "@/lib/reviewsData";
import { addNotification } from "@/lib/notificationsData";
import type { Order } from "@/types/order";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-3xl transition-transform hover:scale-110"
        >
          <span
            className={
              star <= (hovered || value)
                ? "text-yellow-400"
                : "text-[#e5e7eb]"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const o = getOrderById(id) ?? null;
    setOrder(o);
    if (o) {
      hasReviewForOrder(o.id).then(setAlreadyReviewed);
    } else {
      setAlreadyReviewed(null);
    }
  }, [id]);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za oddajo ocene se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Naročilo ni najdeno.</p>
        <Link href="/customer/orders" className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Moja naročila
        </Link>
      </main>
    );
  }

  if (order.status !== "completed") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Oceno lahko oddate samo za zaključena naročila.</p>
        <Link href={`/customer/orders/${id}`} className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Nazaj na naročilo
        </Link>
      </main>
    );
  }

  if (alreadyReviewed === true) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Za to naročilo ste že oddali oceno.</p>
        <Link href={`/customer/orders/${id}`} className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Nazaj na naročilo
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Prosimo, izberite oceno (1–5 zvezdic).");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(
        order.id,
        user!.id,
        user!.name,
        order.providerId,
        rating,
        comment
      );
      addNotification(
        user!.id,
        "Ocena oddana",
        `Vaša ocena za ${order.providerName} je bila uspešno oddana.`,
        `/customer/orders/${order.id}`
      );
      router.push(`/customer/orders/${order.id}/review/confirmation`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/customer/orders/${id}`} className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na naročilo
      </Link>

      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1d283a]">
          Oddaja ocene po končanem delu
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Ocenite izvajalca: <strong>{order.providerName}</strong>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1d283a]">
              Ocena *
            </label>
            <StarPicker value={rating} onChange={(v) => { setRating(v); setError(""); }} />
            {rating > 0 && (
              <p className="mt-1 text-sm text-[#6b7280]">
                {["", "Slabo", "Zadovoljivo", "Dobro", "Zelo dobro", "Odlično"][rating]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="comment" className="mb-1 block text-sm font-medium text-[#1d283a]">
              Komentar (opcijsko)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Opišite vašo izkušnjo z izvajalcem..."
              className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#1d283a] py-3 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
          >
            {submitting ? "Oddajam..." : "Oddaj oceno"}
          </button>
        </form>
      </div>
    </main>
  );
}
