"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByCustomerId } from "@/lib/mock-orders";
import { OrderCardSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import type { Order } from "@/types/order";

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

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const user = getCurrentUser();
    if (user?.role === "customer") {
      setOrders(getOrdersByCustomerId(user.id));
    }
    setLoading(false);
  }, [mounted]);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za ogled naročil se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1d283a]">
        Moja naročila
      </h1>
      <p className="mt-2 text-[#6b7280]">
        Tukaj lahko spremljate status vaših naročil.
      </p>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => <OrderCardSkeleton key={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Še nimate naročil"
          description="Ko rezervirate storitev, se bo vaše naročilo prikazalo tukaj."
          actionLabel="Išči storitve"
          actionHref="/customer/search"
        />
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/customer/orders/${order.id}`}
              className="block rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm transition hover:border-[#1d283a]/30 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#1d283a]">
                    {order.providerName}
                  </h3>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {formatDate(order.date)} {order.start} – {order.end}
                  </p>
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
