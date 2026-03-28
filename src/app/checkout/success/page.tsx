"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { updateOrderStatus } from "@/lib/ordersData";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setMessage("Manjka session_id.");
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/checkout/success", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setMessage(data.error || "Preverjanje plačila ni uspelo.");
          return;
        }
        const orderId = data.orderId;
        if (orderId) {
          await updateOrderStatus(orderId, "paid");
        }
        setStatus("ok");
      } catch {
        setStatus("error");
        setMessage("Napaka pri povezavi s strežnikom.");
      }
    })();
  }, [sessionId]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {status === "loading" && (
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-8 text-center">
          <p className="text-[#6b7280]">Preverjam plačilo…</p>
        </div>
      )}
      {status === "ok" && (
        <>
          <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
            <span className="text-5xl">✓</span>
            <h1 className="mt-4 text-2xl font-bold text-[#1d283a]">
              Plačilo uspešno
            </h1>
            <p className="mt-2 text-[#6b7280]">
              Vaše naročilo je bilo plačano. Izvajalec vas bo obvestil o nadaljnjih korakih.
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Link
              href="/customer/orders"
              className="rounded-lg bg-[#1d283a] px-6 py-3 font-medium text-white hover:bg-[#2a3a4f]"
            >
              Moja naročila
            </Link>
          </div>
        </>
      )}
      {status === "error" && (
        <>
          <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-8 text-center">
            <h1 className="text-xl font-bold text-[#1d283a]">Plačilo ni bilo potrjeno</h1>
            <p className="mt-2 text-[#6b7280]">{message}</p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/customer/orders"
              className="rounded-lg bg-[#1d283a] px-6 py-3 font-medium text-white hover:bg-[#2a3a4f]"
            >
              Moja naročila
            </Link>
            <Link
              href="/customer"
              className="rounded-lg border border-[#e5e7eb] px-6 py-3 font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
            >
              Nazaj na začetek
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-12 text-[#6b7280]">Nalaganje…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
