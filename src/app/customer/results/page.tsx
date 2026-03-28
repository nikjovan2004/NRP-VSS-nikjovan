"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getAllProviders,
  mockAiSearch,
  providerHasAvailabilityInRange,
  countTodayAvailability,
} from "@/lib/mock-providers";
import {
  runAiSearch,
  matchProvidersToAiResult,
  parseAiSearchJsonObject,
  type AiSearchResult,
} from "@/lib/aiSearch";
import { getFavoriteIds, toggleFavorite } from "@/lib/favoritesData";
import { ProviderCardSkeleton } from "@/components/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/components/toast";
import type { Provider } from "@/types/provider";

type SortKey = "relevance" | "rating" | "price_asc" | "price_desc";

function parsePricePerHour(priceRange: string): number {
  const match = priceRange.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function FavoriteButton({
  providerId,
  userId,
  initialFav,
  onToggle,
}: {
  providerId: string;
  userId: string;
  initialFav: boolean;
  onToggle: (id: string, nowFav: boolean) => void;
}) {
  const [fav, setFav] = useState(initialFav);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    const nowFav = await toggleFavorite(userId, providerId);
    setFav(nowFav);
    onToggle(providerId, nowFav);
  };

  return (
    <button
      onClick={handleClick}
      className={`rounded-full p-1.5 transition ${
        fav
          ? "text-red-500 hover:text-red-600"
          : "text-[#d1d5db] hover:text-red-400"
      }`}
      aria-label={fav ? "Odstrani iz priljubljenih" : "Dodaj med priljubljene"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

function ProviderCard({
  provider,
  favIds,
  userId,
  onFavToggle,
  bookParams,
}: {
  provider: Provider;
  favIds: string[];
  userId: string;
  onFavToggle: (id: string, nowFav: boolean) => void;
  bookParams?: { date: string; start: string; end: string };
}) {
  const todaySlots = typeof window !== "undefined" ? countTodayAvailability(provider.id) : 0;
  const bookHref =
    bookParams &&
    `/customer/book/${provider.id}?date=${encodeURIComponent(bookParams.date)}&start=${encodeURIComponent(bookParams.start)}&end=${encodeURIComponent(bookParams.end)}`;

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm transition hover:border-[#1d283a]/30 hover:shadow-md">
      <Link href={`/customer/provider/${provider.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-[#1d283a]">{provider.name}</h3>
            <p className="mt-0.5 text-sm text-[#6b7280]">{provider.location}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {provider.verified && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Preverjen
              </span>
            )}
            <FavoriteButton
              providerId={provider.id}
              userId={userId}
              initialFav={favIds.includes(provider.id)}
              onToggle={onFavToggle}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{provider.rating}</span>
          <span className="text-sm text-[#6b7280]">({provider.reviewCount} ocen)</span>
        </div>
        <p className="mt-1.5 text-sm text-[#6b7280]">{provider.services.join(", ")}</p>
        <p className="mt-1.5 font-medium text-[#1d283a]">{provider.priceRange}</p>
      </Link>
      <div className="mt-2 text-xs text-[#6b7280]">
        {todaySlots > 0
          ? `Še ${todaySlots} termin${todaySlots === 1 ? "" : "a"} danes`
          : "Danes ni prostih terminov"}
      </div>
      {bookHref && (
        <div className="mt-3 border-t border-[#e5e7eb] pt-3">
          <Link
            href={bookHref}
            className="inline-flex rounded-lg bg-[#1d283a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3a4f]"
          >
            Rezerviraj
          </Link>
        </div>
      )}
    </div>
  );
}

function FilterBar({
  sort,
  onSort,
  onlyVerified,
  onVerified,
  locationFilter,
  onLocation,
  locations,
}: {
  sort: SortKey;
  onSort: (s: SortKey) => void;
  onlyVerified: boolean;
  onVerified: (v: boolean) => void;
  locationFilter: string;
  onLocation: (l: string) => void;
  locations: string[];
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3">
      {/* Sort */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-[#6b7280]">
          Razvrsti:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          className="rounded-md border border-[#e5e7eb] px-2 py-1 text-sm focus:border-[#1d283a] focus:outline-none"
        >
          <option value="relevance">Relevantnost</option>
          <option value="rating">Ocena (↓)</option>
          <option value="price_asc">Cena (↑)</option>
          <option value="price_desc">Cena (↓)</option>
        </select>
      </div>

      {/* Location filter */}
      {locations.length > 1 && (
        <div className="flex items-center gap-2">
          <label htmlFor="location" className="text-sm font-medium text-[#6b7280]">
            Lokacija:
          </label>
          <select
            id="location"
            value={locationFilter}
            onChange={(e) => onLocation(e.target.value)}
            className="rounded-md border border-[#e5e7eb] px-2 py-1 text-sm focus:border-[#1d283a] focus:outline-none"
          >
            <option value="">Vse</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Verified toggle */}
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={onlyVerified}
          onChange={(e) => onVerified(e.target.checked)}
          className="h-4 w-4 rounded border-[#e5e7eb] accent-[#1d283a]"
        />
        <span className="text-[#6b7280]">Samo preverjeni</span>
      </label>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { showToast } = useToast();

  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favIds, setFavIds] = useState<string[]>([]);
  const [usedAi, setUsedAi] = useState(false);
  const [cityRequestedButNoMatch, setCityRequestedButNoMatch] = useState(false);
  const [aiResult, setAiResult] = useState<AiSearchResult | null>(null);

  // Filter/sort state
  const [sort, setSort] = useState<SortKey>("relevance");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const user = mounted ? getCurrentUser() : null;

  useEffect(() => {
    if (user?.id) {
      getFavoriteIds(user.id).then(setFavIds);
    }
  }, [user?.id, pathname]);

  useEffect(() => {
    if (!user?.id) return;
    const refetch = () => getFavoriteIds(user.id).then(setFavIds);
    window.addEventListener("domservices-favorites-changed", refetch);
    window.addEventListener("focus", refetch);
    return () => {
      window.removeEventListener("domservices-favorites-changed", refetch);
      window.removeEventListener("focus", refetch);
    };
  }, [user?.id]);

  useEffect(() => {
    setLoading(true);
    setUsedAi(false);
    setCityRequestedButNoMatch(false);
    setAiResult(null);
    const t = setTimeout(() => {
      const providers = getAllProviders();
      if (!q) {
        setAllProviders(providers);
        setLoading(false);
        return;
      }
      let stored: AiSearchResult | null = null;
      try {
        const raw = typeof window !== "undefined" ? sessionStorage.getItem("domservices-last-ai-result") : null;
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, unknown> | null;
          if (parsed) {
            stored = parseAiSearchJsonObject(parsed);
          }
        }
      } catch {
        // ignore
      }
      const resolveAi = stored ?? runAiSearch(q);
      Promise.resolve(resolveAi)
        .then((aiRes) => {
          if (aiRes) {
            setAiResult(aiRes);
            const match = matchProvidersToAiResult(providers, aiRes);
            let list = match.providers;
            if (
              aiRes.intent === "book" &&
              aiRes.date &&
              aiRes.timeStart &&
              aiRes.timeEnd
            ) {
              list = list.filter((p) =>
                providerHasAvailabilityInRange(
                  p.id,
                  aiRes!.date!,
                  aiRes!.timeStart!,
                  aiRes!.timeEnd!
                )
              );
            }
            setAllProviders(list);
            setCityRequestedButNoMatch(match.cityRequestedButNoMatch);
            setUsedAi(true);
          } else {
            setAllProviders(mockAiSearch(q));
          }
        })
        .catch(() => {
          setAllProviders(mockAiSearch(q));
        })
        .finally(() => {
          setLoading(false);
        });
    }, 600);
    return () => clearTimeout(t);
  }, [q]);

  const locations = useMemo(
    () => [...new Set(allProviders.map((p) => p.location))].sort(),
    [allProviders]
  );

  const filtered = useMemo(() => {
    let list = [...allProviders];
    if (onlyVerified) list = list.filter((p) => p.verified);
    if (locationFilter) list = list.filter((p) => p.location === locationFilter);
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "price_asc":
        list.sort((a, b) => parsePricePerHour(a.priceRange) - parsePricePerHour(b.priceRange));
        break;
      case "price_desc":
        list.sort((a, b) => parsePricePerHour(b.priceRange) - parsePricePerHour(a.priceRange));
        break;
    }
    return list;
  }, [allProviders, sort, onlyVerified, locationFilter]);

  const handleFavToggle = async (id: string, nowFav: boolean) => {
    if (user?.id) {
      const ids = await getFavoriteIds(user.id);
      setFavIds(ids);
    }
    showToast(
      nowFav ? "Dodano med priljubljene." : "Odstranjeno iz priljubljenih.",
      nowFav ? "success" : "info"
    );
  };

  if (mounted && (!user || user.role !== "customer")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za ogled rezultatov se morate prijaviti.</p>
        <Link href="/auth/customer/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center gap-4">
        <Link href="/customer/search" className="text-[#6b7280] hover:text-[#1d283a]">
          ← Nazaj na iskanje
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-[#1d283a]">
        Rezultati iskanja
      </h1>
      {q && !loading && (
        <>
          <p className="mt-1 text-[#6b7280]">
            Za &quot;{q}&quot; – {filtered.length} {filtered.length === 1 ? "ponudnik" : "ponudnikov"}
          </p>
          <p className="mt-1">
            {usedAi ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                Rezultati z AI (xAI Grok)
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-[#e5e7eb] px-2.5 py-0.5 text-xs font-medium text-[#6b7280]">
                Rezultati (iskanje po besedah)
              </span>
            )}
          </p>
          {cityRequestedButNoMatch && (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              V izbrani lokaciji trenutno ni ponudnikov. Prikazani so ponudniki iz drugih lokacij.
            </p>
          )}
        </>
      )}

      {!loading && allProviders.length > 0 && (
        <FilterBar
          sort={sort}
          onSort={setSort}
          onlyVerified={onlyVerified}
          onVerified={setOnlyVerified}
          locationFilter={locationFilter}
          onLocation={setLocationFilter}
          locations={locations}
        />
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => <ProviderCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="Ni rezultatov"
          description={
            onlyVerified || locationFilter
              ? "Ni ponudnikov, ki ustrezajo izbranim filtrom. Poskusite spremeniti filtre."
              : `Za iskanje "${q}" nismo našli nobenega izvajalca. Poskusite z drugimi ključnimi besedami.`
          }
          actionLabel="Novo iskanje"
          actionHref="/customer/search"
        />
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((p) => (
            <ProviderCard
              key={p.id}
              provider={p}
              favIds={favIds}
              userId={user?.id ?? ""}
              onFavToggle={handleFavToggle}
              bookParams={
                aiResult?.intent === "book" &&
                aiResult?.date &&
                aiResult?.timeStart &&
                aiResult?.timeEnd
                  ? {
                      date: aiResult.date,
                      start: aiResult.timeStart,
                      end: aiResult.timeEnd,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function CustomerResultsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 text-[#6b7280]">Nalaganje...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
