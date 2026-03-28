"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProviderById } from "@/lib/mock-providers";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function BookingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const date = searchParams.get("date") ?? "";
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";

  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const provider = getProviderById(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za rezervacijo se morate prijaviti.</p>
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
          ← Nazaj
        </Link>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const order = {
      customerId: user?.id ?? "",
      customerName: user?.name ?? "",
      providerId: provider.id,
      providerName: provider.name,
      date,
      start,
      end,
      address,
      notes,
      status: "pending_payment",
    };
    sessionStorage.setItem("domservices-pending-order", JSON.stringify(order));
    router.push(`/customer/confirmation?providerId=${provider.id}&date=${date}&start=${start}&end=${end}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link href={`/customer/provider/${id}`} className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na profil
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-[#1d283a]">
        Rezervacija in depozitno plačilo
      </h1>
      <p className="mt-2 text-[#6b7280]">
        {provider.name} • {formatDate(date)} {start}–{end}
      </p>
      <p className="mt-2 font-medium text-[#1d283a]">{provider.priceRange}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="address" className="mb-1 block text-sm font-medium text-[#1d283a]">
            Naslov izvedbe *
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Ulica, hišna številka, kraj"
            className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
          />
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-medium text-[#1d283a]">
            Dodatne opombe (opcijsko)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Npr. ključ v poštni predalček..."
            className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
          />
        </div>
        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          Depozit bo zadržan v escrow do potrditve opravljenega dela.
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1d283a] py-3 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
        >
          {loading ? "Nadaljujem..." : "Nadaljuj na plačilo"}
        </button>
      </form>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-8 text-[#6b7280]">Nalaganje...</div>}>
      <BookingContent />
    </Suspense>
  );
}
