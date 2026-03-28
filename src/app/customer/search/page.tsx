"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { runAiSearch } from "@/lib/aiSearch";
import { addAlert } from "@/lib/alertsData";

const CATEGORY_LABELS: Record<string, string> = {
  plumber: "vodovodarstvo",
  electrician: "elektrika",
  cleaner: "čiščenje",
  gardener: "vrtnarstvo",
  other: "storitev",
};

export default function CustomerSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [alertMessage, setAlertMessage] = useState<"success" | "need_city" | null>(null);
  const [lastAlertCity, setLastAlertCity] = useState<string | null>(null);
  const [lastAlertCategory, setLastAlertCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za iskanje se morate prijaviti kot stranka.</p>
        <Link
          href="/auth/customer/login"
          className="rounded-lg bg-[#1d283a] px-4 py-2 text-white hover:bg-[#2a3a4f]"
        >
          Prijava
        </Link>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setAlertMessage(null);
    const encoded = encodeURIComponent(query.trim());

    const ai = await runAiSearch(query.trim());
    if (!ai) {
      router.push(`/customer/results?q=${encoded}`);
      setLoading(false);
      return;
    }

    if (ai.intent === "alert") {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      if (!ai.city?.trim()) {
        setAlertMessage("need_city");
        setLoading(false);
        return;
      }
      await addAlert(user.id, ai.category, ai.city.trim());
      setLastAlertCity(ai.city.trim());
      setLastAlertCategory(ai.category);
      setAlertMessage("success");
      setLoading(false);
      return;
    }

    try {
      sessionStorage.setItem("domservices-last-ai-result", JSON.stringify(ai));
    } catch {
      // sessionStorage full or unavailable
    }
    router.push(`/customer/results?q=${encoded}`);
    setLoading(false);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-[#1d283a]">
        Pristajalna stran in AI iskanje
      </h1>
      <p className="mt-2 text-[#6b7280]">
        Opišite svoj problem v naravnem jeziku – npr. &quot;Popraviti moram pušilko v kuhinji&quot; ali &quot;Potrebujem čiščenje stanovanja&quot;.
      </p>

      <form onSubmit={handleSearch} className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Opišite, kaj potrebujete..."
            className="flex-1 rounded-lg border border-[#e5e7eb] px-4 py-3 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-[#1d283a] px-6 py-3 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
          >
            {loading ? "Iskanje..." : "Išči"}
          </button>
        </div>
      </form>

      {alertMessage === "success" && lastAlertCity && lastAlertCategory && (
        <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Obvestilo nastavljeno. Ko se v {lastAlertCity} pojavi {CATEGORY_LABELS[lastAlertCategory] ?? lastAlertCategory}, vas bomo obvestili.
        </p>
      )}
      {alertMessage === "need_city" && (
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Za obvestilo prosim navedite mesto (npr. &quot;Obvesti me, ko bo vodovodarstvo v Kopru&quot;).
        </p>
      )}
      <p className="mt-4 text-sm text-[#6b7280]">
        AI bo razumel vašo zahtevo in predlagal najustreznejše preverjene izvajalce.
      </p>
    </main>
  );
}
