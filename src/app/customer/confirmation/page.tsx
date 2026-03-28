"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createOrder } from "@/lib/ordersData";
import { getProviderById } from "@/lib/mock-providers";
import { addNotification } from "@/lib/notificationsData";
import type { Order } from "@/types/order";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Parse amount in cents from provider priceRange (e.g. "45 €/h" -> 4500). Fallback 20 EUR. */
function amountFromPriceRange(priceRange: string): number {
  const match = priceRange.match(/(\d+)/);
  const euros = match ? parseInt(match[1], 10) : 20;
  return Math.max(100, euros * 100);
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get("providerId");
  const date = searchParams.get("date");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const [order, setOrder] = useState<{
    address: string;
    notes: string;
  } | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const provider = providerId ? getProviderById(providerId) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("domservices-pending-order");
    sessionStorage.removeItem("domservices-pending-order");
    if (!raw) return;
    const parsed = JSON.parse(raw);
    setOrder({ address: parsed.address ?? "", notes: parsed.notes ?? "" });
    const currentUser = getCurrentUser();
    if (
      !currentUser ||
      !parsed.customerId ||
      !parsed.providerId ||
      !parsed.date ||
      !parsed.start ||
      !parsed.end ||
      !parsed.providerName
    ) {
      return;
    }
    (async () => {
      try {
        const newOrder = await createOrder(
          parsed.customerId,
          parsed.customerName ?? currentUser.name,
          parsed.providerId,
          parsed.providerName,
          parsed.date,
          parsed.start,
          parsed.end,
          parsed.address ?? "",
          parsed.notes ?? ""
        );
        setCreatedOrder(newOrder);
        addNotification(
          parsed.customerId,
          "Naročilo oddano",
          `Vaše naročilo pri ${parsed.providerName} je bilo uspešno oddano. Plačajte za dokončanje.`,
          "/customer/orders"
        );
        if (currentUser.email) {
          const summary = `Ponudnik: ${parsed.providerName}\nDatum: ${parsed.date} ${parsed.start}–${parsed.end}\nNaslov: ${parsed.address ?? ""}`;
          await fetch("/api/email/order-created", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: currentUser.email,
              summary,
            }),
          }).catch(() => {});
        }
      } catch {
        setOrder(null);
        sessionStorage.setItem("domservices-pending-order", raw);
      }
    })();
  }, []);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Nepričakovana napaka.</p>
        <Link href="/customer" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Na nadzorno ploščo
        </Link>
      </div>
    );
  }

  if (!provider || !date || !start || !end) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-[#6b7280]">Manjkajoči podatki rezervacije.</p>
        <Link href="/customer" className="mt-4 inline-block text-[#1d283a] hover:underline">
          Nazaj na nadzorno ploščo
        </Link>
      </main>
    );
  }

  const handlePay = async () => {
    if (!createdOrder || !provider) return;
    setPayLoading(true);
    try {
      const amount = amountFromPriceRange(provider.priceRange);
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrder.id,
          amount,
          currency: "eur",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Napaka pri ustvarjanju plačila.");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("Ni URL za plačilo.");
    } catch (e) {
      setPayLoading(false);
      alert(e instanceof Error ? e.message : "Napaka pri preusmeritvi na Stripe.");
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <span className="text-5xl">✓</span>
        <h1 className="mt-4 text-2xl font-bold text-[#1d283a]">
          Naročilo ustvarjeno – plačajte depozit
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Z Stripe lahko varno plačate (testni način). Po plačilu bo naročilo označeno kot plačano.
        </p>
      </div>
      <div className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-6">
        <h2 className="font-semibold text-[#1d283a]">Podrobnosti naročila</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-[#6b7280]">Izvajalec</dt>
            <dd className="font-medium">{provider.name}</dd>
          </div>
          <div>
            <dt className="text-[#6b7280]">Datum in čas</dt>
            <dd className="font-medium">{formatDate(date)} {start} – {end}</dd>
          </div>
          {order?.address && (
            <div>
              <dt className="text-[#6b7280]">Naslov</dt>
              <dd className="font-medium">{order.address}</dd>
            </div>
          )}
        </dl>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {createdOrder && (
          <button
            type="button"
            onClick={handlePay}
            disabled={payLoading}
            className="flex-1 rounded-lg bg-[#1d283a] py-3 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
          >
            {payLoading ? "Preusmerjanje na Stripe…" : "Plačaj (Stripe)"}
          </button>
        )}
        <Link
          href="/customer/orders"
          className="flex-1 rounded-lg border border-[#e5e7eb] py-3 text-center font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
        >
          Moja naročila
        </Link>
        <Link
          href="/customer/search"
          className="flex-1 rounded-lg border border-[#e5e7eb] py-3 text-center font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
        >
          Novo iskanje
        </Link>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-12 text-[#6b7280]">Nalaganje...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
