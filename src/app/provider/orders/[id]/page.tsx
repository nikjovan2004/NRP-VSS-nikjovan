"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import {
  getOrderById,
  acceptOrder,
  rejectOrder,
  updateOrderStatus,
} from "@/lib/mock-orders";
import { addNotification } from "@/lib/notificationsData";
import { getUserEmailById } from "@/lib/userEmailLookup";
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

export default function ProviderJobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOrder(getOrderById(id) ?? null);
  }, [id]);

  const user = mounted ? getCurrentUser() : null;
  const profileId = user?.providerProfileId ?? "p1";
  const isMyOrder = order?.providerId === profileId;

  const handleAccept = async () => {
    if (!order) return;
    setLoading(true);
    const updated = acceptOrder(order.id);
    if (updated) {
      setOrder(updated);
      addNotification(
        order.customerId,
        "Naročilo potrjeno",
        `Izvajalec ${order.providerName} je potrdil vaše naročilo za ${order.date}.`,
        `/customer/orders/${order.id}`
      );
      showToast("Naročilo uspešno sprejeto.", "success");
      const email = await getUserEmailById(order.customerId);
      if (email) {
        const summary = `Ponudnik: ${order.providerName}\nDatum: ${order.date} ${order.start}–${order.end}\nNaslov: ${order.address ?? ""}`;
        await fetch("/api/email/order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            status: "Potrjeno",
            summary,
          }),
        }).catch(() => {});
      }
    }
    setLoading(false);
  };

  const handleReject = () => {
    if (!order) return;
    if (!confirm("Ali ste prepričani, da želite zavrniti to naročilo?")) return;
    setLoading(true);
    const updated = rejectOrder(order.id);
    if (updated) {
      setOrder(updated);
      addNotification(
        order.customerId,
        "Naročilo zavrnjeno",
        `Izvajalec ${order.providerName} je zavrnil vaše naročilo za ${order.date}.`,
        `/customer/orders/${order.id}`
      );
      showToast("Naročilo zavrnjeno.", "error");
    }
    setLoading(false);
  };

  const handleStart = () => {
    if (!order) return;
    setLoading(true);
    const updated = updateOrderStatus(order.id, "in_progress");
    if (updated) {
      setOrder(updated);
      addNotification(
        order.customerId,
        "Delo se je začelo",
        `Izvajalec ${order.providerName} je začel z delom.`,
        `/customer/orders/${order.id}`
      );
      showToast("Status posodobljen – delo v teku.", "info");
    }
    setLoading(false);
  };

  const handleComplete = () => {
    if (!order) return;
    setLoading(true);
    const updated = updateOrderStatus(order.id, "completed");
    if (updated) {
      setOrder(updated);
      addNotification(
        order.customerId,
        "Delo zaključeno – oddajte oceno",
        `Izvajalec ${order.providerName} je zaključil delo. Prosimo, ocenite vašo izkušnjo.`,
        `/customer/orders/${order.id}/review`
      );
      showToast("Naročilo označeno kot zaključeno.", "success");
    }
    setLoading(false);
  };

  const canAcceptReject =
    order?.status === "pending_confirmation" && isMyOrder;
  const canStart = order?.status === "confirmed" && isMyOrder;
  const canComplete = order?.status === "in_progress" && isMyOrder;

  if (mounted && (!user || user.role !== "provider")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za dostop se morate prijaviti kot ponudnik.</p>
        <Link href="/auth/provider/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Naročilo ni najdeno.</p>
        <Link href="/provider" className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Nazaj na nadzorno ploščo
        </Link>
      </main>
    );
  }

  if (!isMyOrder) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">To naročilo ni namenjeno vam.</p>
        <Link href="/provider" className="mt-4 inline-block text-[#1d283a] hover:underline">
          ← Nazaj na nadzorno ploščo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/provider" className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na nadzorno ploščo
      </Link>

      <div className="mt-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1d283a]">
          Podrobnosti dela
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
            <dt className="text-[#6b7280]">Stranka</dt>
            <dd className="font-medium text-[#1d283a]">{order.customerName}</dd>
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
              <dt className="text-[#6b7280]">Opombe stranke</dt>
              <dd className="font-medium">{order.notes}</dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          {canAcceptReject && (
            <>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Obdelavam..." : "Sprejmi naročilo"}
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                Zavrni naročilo
              </button>
            </>
          )}
          {canStart && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="rounded-lg bg-[#1d283a] px-4 py-2 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
            >
              {loading ? "Obdelavam..." : "Začni delo"}
            </button>
          )}
          {canComplete && (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Obdelavam..." : "Označi kot zaključeno"}
            </button>
          )}
          <Link
            href={`/provider/orders/${order.id}/chat`}
            className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
          >
            Klepet s stranko
          </Link>
        </div>
      </div>
    </main>
  );
}
