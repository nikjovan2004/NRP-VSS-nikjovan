"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFavoriteIds, toggleFavorite } from "@/lib/favoritesData";
import { getProviderById } from "@/lib/mock-providers";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/components/toast";
import type { Provider } from "@/types/provider";

function resolveFavoriteProviders(ids: string[]): Provider[] {
  const seen = new Set<string>();
  const out: Provider[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const p = getProviderById(id);
    if (p) {
      seen.add(id);
      out.push(p);
    }
  }
  return out;
}

export default function FavoritesPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<Provider[]>([]);
  const { showToast } = useToast();

  const user = mounted ? getCurrentUser() : null;

  const loadFavorites = useCallback(() => {
    if (!user?.id) return;
    getFavoriteIds(user.id).then((ids) =>
      setFavorites(resolveFavoriteProviders(ids))
    );
  }, [user?.id]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites, pathname]);

  useEffect(() => {
    if (!user?.id) return;
    const refetch = () => loadFavorites();
    window.addEventListener("domservices-favorites-changed", refetch);
    window.addEventListener("focus", refetch);
    return () => {
      window.removeEventListener("domservices-favorites-changed", refetch);
      window.removeEventListener("focus", refetch);
    };
  }, [user?.id, loadFavorites]);

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za ogled priljubljenih se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  const handleRemove = async (providerId: string) => {
    if (!user?.id) return;
    await toggleFavorite(user.id, providerId);
    setFavorites((prev) => prev.filter((p) => p.id !== providerId));
    showToast("Odstranjeno iz priljubljenih.", "info");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1d283a]">Priljubljeni izvajalci</h1>
      <p className="mt-2 text-[#6b7280]">
        Izvajalci, ki ste jih shranili med priljubljene.
      </p>

      {!mounted ? null : favorites.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Ni priljubljenih"
          description="Med iskanjem izvajalcev kliknite srčko, da jih shranite sem."
          actionLabel="Išči izvajalce"
          actionHref="/customer/search"
        />
      ) : (
        <div className="mt-6 space-y-3">
          {favorites.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm"
            >
              <Link
                href={`/customer/provider/${p.id}`}
                className="min-w-0 flex-1"
              >
                <h3 className="truncate font-semibold text-[#1d283a] hover:underline">
                  {p.name}
                </h3>
                <p className="mt-0.5 text-sm text-[#6b7280]">{p.location}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{p.rating}</span>
                  <span className="text-sm text-[#6b7280]">({p.reviewCount} ocen)</span>
                  {p.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Preverjen
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium text-[#1d283a]">{p.priceRange}</p>
              </Link>
              <div className="ml-4 flex shrink-0 flex-col gap-2">
                <Link
                  href={`/customer/provider/${p.id}`}
                  className="rounded-lg bg-[#1d283a] px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-[#2a3a4f]"
                >
                  Rezerviraj
                </Link>
                <button
                  onClick={() => handleRemove(p.id)}
                  className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-xs text-[#6b7280] hover:bg-[#f8f9fa]"
                >
                  Odstrani
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
