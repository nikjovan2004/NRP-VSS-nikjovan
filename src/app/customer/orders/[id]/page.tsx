"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById, cancelOrder } from "@/lib/mock-orders";
import { hasReviewForOrder } from "@/lib/reviewsData";
import { OrderDetailSkeleton } from "@/components/skeleton";
import { useToast } from "@/components/toast";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_confirmation: "Čaka potrditev",
  paid: "Plačano",
  confirmed: "Potrjeno",
  in_progress: "V teku",
  completed: "Zaključeno",
  cancelled: "Preklicano",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const o = getOrderById(id) ?? null;
    setOrder(o);
    if (o) hasReviewForOrder(o.id).then(setAlreadyReviewed);
  }, [id]);

  const user = mounted ? getCurrentUser() : null;

  const handleCancel = () => {
    if (!confirm("Ali ste prepričani, da želite preklicati naročilo?")) return;
    setCancelling(true);
    const updated = cancelOrder(id);
    if (updated) {
      setOrder(updated);
      showToast("Naročilo je bilo preklicano.", "error");
    }
    setCancelling(false);
  };

  const canCancel =
    order?.status === "pending_confirmation" || order?.status === "confirmed";
  const canReview = order?.status === "completed" && !alreadyReviewed;
  const canRebook =
    order?.status === "completed" || order?.status === "cancelled";

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za ogled naročila se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  if (!mounted) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="h-4 w-24 animate-pulse rounded bg-[#e5e7eb]" />
        <div className="mt-6">
          <OrderDetailSkeleton />
        </div>
      </main>
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/customer/orders" className="text-[#6b7280] hover:text-[#1d283a]">
        ← Moja naročila
      </Link>

      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1d283a]">
          Pregled naročila
        </h1>
        <span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            order.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : order.status === "completed"
                ? "bg-green-100 text-green-800"
                : order.status === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>

        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-[#6b7280]">Izvajalec</dt>
            <dd className="font-medium text-[#1d283a]">{order.providerName}</dd>
          </div>
          <div>
            <dt className="text-[#6b7280]">Datum in čas</dt>
            <dd className="font-medium">
              {formatDate(order.date)} {order.start} – {order.end}
            </dd>
          </div>
          <div>
            <dt className="text-[#6b7280]">Naslov</dt>
            <dd className="font-medium">{order.address || "—"}</dd>
          </div>
          {order.notes && (
            <div>
              <dt className="text-[#6b7280]">Opombe</dt>
              <dd className="font-medium">{order.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              {cancelling ? "Preklicujem..." : "Prekliči naročilo"}
            </button>
          )}
          {canReview && (
            <Link
              href={`/customer/orders/${order.id}/review`}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-yellow-600"
            >
              Oddaj oceno
            </Link>
          )}
          {alreadyReviewed && order.status === "completed" && (
            <span className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
              Ocena oddana ✓
            </span>
          )}
          {canRebook && (
            <Link
              href={`/customer/provider/${order.providerId}`}
              className="rounded-lg border border-[#1d283a] px-4 py-2 text-center text-sm font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
            >
              Ponovna rezervacija
            </Link>
          )}
          <Link
            href={`/customer/orders/${order.id}/chat`}
            className="rounded-lg bg-[#1d283a] px-4 py-2 text-center text-sm font-medium text-white hover:bg-[#2a3a4f]"
          >
            Klepet z izvajalcem
          </Link>
        </div>
      </div>
    </main>
  );
}
