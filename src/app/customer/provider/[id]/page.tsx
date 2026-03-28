"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getProviderById, mockGetAvailability, countTodayAvailability } from "@/lib/mock-providers";
import { getReviewsByProviderId } from "@/lib/reviewsData";
import { isFavorite, toggleFavorite } from "@/lib/favoritesData";
import { useToast } from "@/components/toast";
import type { TimeSlot } from "@/types/provider";
import type { Review } from "@/types/review";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sl-SI", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function ProviderProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [fav, setFav] = useState(false);
  const { showToast } = useToast();

  const provider = getProviderById(id);
  const [slots] = useState(() => mockGetAvailability(id));
  const todayCount = typeof window !== "undefined" ? countTodayAvailability(id) : 0;
  const [reviews, setReviews] = useState<Review[]>([]);

  const user = mounted ? getCurrentUser() : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getReviewsByProviderId(id).then(setReviews);
  }, [id]);

  useEffect(() => {
    if (!user?.id) {
      setFav(false);
      return;
    }
    const loadFav = () => isFavorite(user.id, id).then(setFav);
    loadFav();
    window.addEventListener("domservices-favorites-changed", loadFav);
    window.addEventListener("focus", loadFav);
    return () => {
      window.removeEventListener("domservices-favorites-changed", loadFav);
      window.removeEventListener("focus", loadFav);
    };
  }, [id, user?.id]);

  const handleFavToggle = async () => {
    if (!user?.id) return;
    const nowFav = await toggleFavorite(user.id, id);
    setFav(nowFav);
    showToast(
      nowFav ? "Dodano med priljubljene." : "Odstranjeno iz priljubljenih.",
      nowFav ? "success" : "info"
    );
  };

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za ogled profila se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  if (!provider) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-[#6b7280]">Izvajalec ni najden.</p>
        <Link href="/customer/results" className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Nazaj na rezultate
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/customer/results" className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na rezultate
      </Link>
      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1d283a]">{provider.name}</h1>
            <p className="mt-1 text-[#6b7280]">{provider.location}</p>
            {provider.verified && (
              <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Preverjen izvajalec
              </span>
            )}
          </div>
          <div className="flex items-start gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{provider.rating}</span>
              </div>
              <p className="text-sm text-[#6b7280]">{provider.reviewCount} ocen</p>
            </div>
            {mounted && (
              <button
                onClick={handleFavToggle}
                className={`rounded-full p-1.5 transition ${
                  fav ? "text-red-500 hover:text-red-600" : "text-[#d1d5db] hover:text-red-400"
                }`}
                aria-label={fav ? "Odstrani iz priljubljenih" : "Dodaj med priljubljene"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {provider.bio && (
          <p className="mt-4 text-[#6b7280]">{provider.bio}</p>
        )}
        <p className="mt-4 font-medium text-[#1d283a]">{provider.priceRange}</p>
        <p className="mt-1 text-sm text-[#6b7280]">
          Storitve: {provider.services.join(", ")}
        </p>
        <p className="mt-2 text-xs text-[#6b7280]">
          {todayCount > 0
            ? `Še ${todayCount} prost${todayCount === 1 ? " termin" : "a termina"} danes`
            : "Danes ni prostih terminov – preverite prihodnje dni."}
        </p>
      </div>

      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#1d283a]">
            Ocene uporabnikov
          </h2>
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-[#e5e7eb] bg-white p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#1d283a]">
                    {r.customerName}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                    <span className="text-[#e5e7eb]">
                      {"★".repeat(5 - r.rating)}
                    </span>
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-1 text-sm text-[#6b7280]">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-[#1d283a]">
          Razpoložljivost
        </h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Izberite termin za rezervacijo
        </p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {slots.map((slot: TimeSlot) => (
            <Link
              key={`${slot.date}-${slot.start}`}
              href={`/customer/book/${provider.id}?date=${slot.date}&start=${slot.start}&end=${slot.end}`}
              className="rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 text-center transition hover:border-[#1d283a]/40 hover:bg-[#f8f9fa]"
            >
              <div className="font-medium text-[#1d283a]">
                {formatDate(slot.date)}
              </div>
              <div className="text-sm text-[#6b7280]">
                {slot.start} – {slot.end}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
