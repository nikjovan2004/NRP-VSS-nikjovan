"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReviewConfirmationPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-8 text-center">
        <span className="text-5xl">⭐</span>
        <h1 className="mt-4 text-2xl font-bold text-[#1d283a]">
          Potrditev oddaje ocene
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Hvala! Vaša ocena je bila uspešno oddana in bo pomagala drugim uporabnikom.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href={`/customer/orders/${id}`}
          className="flex-1 rounded-lg border border-[#e5e7eb] py-3 text-center font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
        >
          Nazaj na naročilo
        </Link>
        <Link
          href="/customer/orders"
          className="flex-1 rounded-lg bg-[#1d283a] py-3 text-center font-medium text-white hover:bg-[#2a3a4f]"
        >
          Moja naročila
        </Link>
      </div>
    </main>
  );
}
