"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByProviderId } from "@/lib/mock-orders";
import { getProviderById } from "@/lib/mock-providers";
import { getReviewsByProviderId } from "@/lib/reviewsData";
import { OrderCardSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import type { Order } from "@/types/order";
import type { Review } from "@/types/review";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending_confirmation: "Čaka potrditev",
  paid: "Plačano",
  confirmed: "Potrjeno",
  in_progress: "V teku",
  completed: "Zaključeno",
  cancelled: "Preklicano",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending_confirmation: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  confirmed: "bg-blue-100 text-blue-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProviderDashboardPage() {
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.role === "provider") {
      const profileId = currentUser.providerProfileId ?? "p1";
      setOrders(getOrdersByProviderId(profileId));
      getReviewsByProviderId(profileId).then(setReviews);
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-7 w-64 animate-pulse rounded bg-[#e5e7eb]" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[#e5e7eb]" />
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
        </div>
      </main>
    );
  }

  if (!user || user.role !== "provider") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-[#f8f9fa] px-4">
        <p className="text-[#6b7280]">Za dostop se morate prijaviti kot ponudnik.</p>
        <Link
          href="/auth/provider/login"
          className="rounded-lg bg-[#1d283a] px-4 py-2 text-white hover:bg-[#2a3a4f]"
        >
          Prijava
        </Link>
      </div>
    );
  }

  const profileId = user.providerProfileId ?? "p1";
  const profile = getProviderById(profileId);
  const profileIncomplete = !profile || profile.services.length === 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1d283a]">
            Nadzorna plošča izvajalca
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Dobrodošli, {user.name}.
            {profile && profile.services.length > 0 && (
              <span className="block mt-1">
                Profil: {profile.name} · {profile.location} · {profile.priceRange}
              </span>
            )}
          </p>
        </div>
        <Link
          href={`/pricing?from=${encodeURIComponent(pathname)}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-medium text-[#6b7280] hover:border-[#1d283a]/40 hover:text-[#1d283a]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Nadgradi plan</span>
        </Link>
      </div>

      {profileIncomplete && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">Vaš profil ni dokončan</h2>
          <p className="mt-1 text-sm text-amber-800">
            Stranke vas ne morejo najti v iskanju, dokler ne izpolnite profila izvajalca.
          </p>
          <Link
            href="/provider/onboarding"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            Dokončaj profil →
          </Link>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-[#1d283a]">Prejete ocene</h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-semibold text-[#1d283a]">
              {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
            </span>
            <span className="text-sm text-[#6b7280]">({reviews.length} {reviews.length === 1 ? "ocena" : "ocen"})</span>
          </div>
          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-lg border border-[#e5e7eb] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#1d283a]">{r.customerName}</span>
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                    <span className="text-[#e5e7eb]">{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                {r.comment && (
                  <p className="mt-1 text-sm text-[#6b7280]">{r.comment}</p>
                )}
                <p className="mt-1 text-xs text-[#9ca3af]">
                  {new Date(r.createdAt).toLocaleDateString("sl-SI", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon="🛠️"
          title="Še nimate naročil"
          description="Ko stranke rezervirajo vaše storitve, se bodo naročila prikazala tukaj."
        />
      ) : (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-[#1d283a]">Moja naročila</h2>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/provider/orders/${order.id}`}
              className="block rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm transition hover:border-[#1d283a]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#1d283a]">
                    {order.customerName}
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {formatDate(order.date)} {order.start} – {order.end}
                  </p>
                  <p className="mt-1 text-sm text-[#6b7280]">{order.address || "—"}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
