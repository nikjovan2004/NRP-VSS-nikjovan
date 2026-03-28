"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-8 text-center">
        <h1 className="text-2xl font-bold text-[#1d283a]">
          Plačilo preklicano
        </h1>
        <p className="mt-2 text-[#6b7280]">
          Plačilo prek Stripe ste preklicali. Naročilo ostane v seznamu; lahko ga plačate kasneje ali prekličete.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/customer/orders"
          className="rounded-lg bg-[#1d283a] px-6 py-3 text-center font-medium text-white hover:bg-[#2a3a4f]"
        >
          Moja naročila
        </Link>
        <Link
          href="/customer"
          className="rounded-lg border border-[#e5e7eb] px-6 py-3 text-center font-medium text-[#1d283a] hover:bg-[#f8f9fa]"
        >
          Nazaj na začetek
        </Link>
      </div>
    </main>
  );
}
