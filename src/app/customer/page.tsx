"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

export default function CustomerDashboardPage() {
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!user || user.role !== "customer") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za dostop se morate prijaviti kot stranka.</p>
        <Link
          href="/auth/customer/login"
          className="rounded-lg bg-[#1d283a] px-4 py-2 text-white hover:bg-[#2a3a4f]"
        >
          Prijava
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1d283a]">
        Dobrodošli, {user.name}
      </h1>
      <p className="mt-2 text-[#6b7280]">
        Kako vam lahko pomagamo danes?
      </p>
      <Link
        href="/customer/search"
        className="mt-8 flex max-w-xl flex-col gap-4 rounded-xl border-2 border-[#1d283a]/20 bg-white p-8 shadow-sm transition hover:border-[#1d283a]/40"
      >
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-semibold text-[#1d283a]">
          Išči storitve
        </h2>
        <p className="text-[#6b7280]">
          Opišite problem v naravnem jeziku – AI vam bo predlagal ustrezne preverjene izvajalce.
        </p>
        <span className="text-sm font-medium text-[#1d283a]">
          Začni iskanje →
        </span>
      </Link>
    </main>
  );
}
