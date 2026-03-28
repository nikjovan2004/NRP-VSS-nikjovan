/**
 * AI search (xAI Grok) for DomServices: natural-language query → structured result,
 * then match against providers. API key stays server-side; client calls /api/search/ai.
 *
 * --- Struktura odgovora (AiSearchResult) ---
 * - intent, category, city/cities, keywords, book polja: glavni vnos za iskanje / alert / book.
 * - minRating / maxRating: minimalna oziroma največja povprečna ocena (0–5).
 * - verifiedOnly: samo ponudniki z verified === true.
 * - priceMinEur / priceMaxEur: razpon cene €/h (iz niza priceRange ponudnika).
 * - limit: največ toliko zadetkov po filtrih.
 * - cities[]: več mest (OR); če je prazno, se uporabi legacy `city`.
 */

import type { Provider } from "@/types/provider";

export type AiSearchIntent = "search" | "alert" | "book";

export type AiSearchResult = {
  intent: AiSearchIntent;
  category: "plumber" | "electrician" | "cleaner" | "gardener" | "other";
  /** Eno glavno mesto (npr. za alert); če je null, lahko uporabimo cities[0]. */
  city: string | null;
  /** Več mest (OR), npr. Velenje in Celje. Če prazno, velja `city`. */
  cities: string[];
  keywords: string[];
  /**
   * Zgornja meja ocene: ohranjeni so ponudniki s rating <= maxRating
   * (npr. "slaba ocena", "največ 3 zvezdice").
   */
  maxRating: number | null;
  /**
   * Spodnja meja: ponudniki z rating >= minRating
   * (npr. "nad 4", "vsaj 4.5 zvezdic").
   */
  minRating: number | null;
  /** Samo preverjeni ponudniki. */
  verifiedOnly: boolean;
  /** Minimalna cena €/h (vključno). */
  priceMinEur: number | null;
  /** Maksimalna cena €/h (vključno). */
  priceMaxEur: number | null;
  /** Po filtrih: vrni največ toliko zadetkov (1–100). */
  limit: number | null;
  date: string | null;
  timeStart: string | null;
  timeEnd: string | null;
};

export type AiSearchMatchResult = {
  providers: Provider[];
  /** True when AI requested a city/cities but no provider matches location. */
  cityRequestedButNoMatch: boolean;
};

const CATEGORIES: AiSearchResult["category"][] = [
  "plumber",
  "electrician",
  "cleaner",
  "gardener",
  "other",
];

const INTENTS: AiSearchIntent[] = ["search", "alert", "book"];

/** Iz niza tipa "45 €/h" izlušči prvo številko kot EUR/h. */
export function parsePricePerHourEur(priceRange: string): number | null {
  const match = priceRange.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return null;
  return parseFloat(match[1].replace(",", "."));
}

function clampRating(n: number): number {
  return Math.min(5, Math.max(0, n));
}

function parseStringArray(val: unknown): string[] {
  if (!Array.isArray(val)) return [];
  return (val as unknown[])
    .filter((k): k is string => typeof k === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Normalizira JSON objekt iz modela v AiSearchResult.
 * Uporablja API route in obnova iz sessionStorage.
 */
export function parseAiSearchJsonObject(
  obj: Record<string, unknown>
): AiSearchResult | null {
  if (typeof obj.category !== "string" || !Array.isArray(obj.keywords)) {
    return null;
  }
  const categoryRaw = obj.category;
  const validCategory =
    typeof categoryRaw === "string" &&
    CATEGORIES.includes(categoryRaw as AiSearchResult["category"])
      ? (categoryRaw as AiSearchResult["category"])
      : "other";

  const intentRaw = obj.intent;
  const validIntent =
    typeof intentRaw === "string" && INTENTS.includes(intentRaw as AiSearchIntent)
      ? (intentRaw as AiSearchIntent)
      : "search";

  const city =
    obj.city === null || obj.city === undefined
      ? null
      : typeof obj.city === "string"
        ? obj.city.trim() || null
        : null;

  let cities = parseStringArray(obj.cities);
  if (cities.length === 0 && city) {
    cities = [city];
  }

  const keywords = Array.isArray(obj.keywords)
    ? (obj.keywords as unknown[]).filter((k): k is string => typeof k === "string")
    : [];

  let maxRating: number | null = null;
  if (typeof obj.maxRating === "number" && obj.maxRating >= 0 && obj.maxRating <= 5) {
    maxRating = clampRating(obj.maxRating);
  }

  let minRating: number | null = null;
  if (typeof obj.minRating === "number" && obj.minRating >= 0 && obj.minRating <= 5) {
    minRating = clampRating(obj.minRating);
  }

  const verifiedOnly = obj.verifiedOnly === true;

  let priceMinEur: number | null = null;
  if (typeof obj.priceMinEur === "number" && obj.priceMinEur >= 0 && obj.priceMinEur < 10000) {
    priceMinEur = obj.priceMinEur;
  }
  let priceMaxEur: number | null = null;
  if (typeof obj.priceMaxEur === "number" && obj.priceMaxEur >= 0 && obj.priceMaxEur < 10000) {
    priceMaxEur = obj.priceMaxEur;
  }

  let limit: number | null = null;
  if (typeof obj.limit === "number" && Number.isFinite(obj.limit)) {
    const n = Math.floor(obj.limit);
    if (n >= 1 && n <= 100) limit = n;
  }

  const date =
    obj.date === null || obj.date === undefined
      ? null
      : typeof obj.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(obj.date.trim())
        ? obj.date.trim()
        : null;
  const timeStart =
    obj.timeStart === null || obj.timeStart === undefined
      ? null
      : typeof obj.timeStart === "string" && /^\d{1,2}:\d{2}$/.test(obj.timeStart.trim())
        ? obj.timeStart.trim()
        : null;
  const timeEnd =
    obj.timeEnd === null || obj.timeEnd === undefined
      ? null
      : typeof obj.timeEnd === "string" && /^\d{1,2}:\d{2}$/.test(obj.timeEnd.trim())
        ? obj.timeEnd.trim()
        : null;

  const cityForAlert = city ?? cities[0] ?? null;

  return {
    intent: validIntent,
    category: validCategory,
    city: cityForAlert,
    cities,
    keywords,
    maxRating,
    minRating,
    verifiedOnly,
    priceMinEur,
    priceMaxEur,
    limit,
    date,
    timeStart,
    timeEnd,
  };
}

/**
 * Iz surovega besedila modela (lahko vsebuje ```json ... ```) izlušči AiSearchResult.
 * Uporablja API route (/api/search/ai).
 */
export function parseAiSearchModelTextContent(text: string): AiSearchResult | null {
  const trimmed = text.trim();
  let jsonStr = trimmed;
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) {
    jsonStr = codeBlock[1].trim();
  }
  try {
    const parsed = JSON.parse(jsonStr) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as Record<string, unknown>;
    return parseAiSearchJsonObject(obj);
  } catch {
    return null;
  }
}

/**
 * Call the server AI search endpoint. Returns null if key missing or request fails.
 */
export async function runAiSearch(
  query: string,
  city?: string
): Promise<AiSearchResult | null> {
  try {
    const res = await fetch("/api/search/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: query.trim(),
        city: city?.trim() || undefined,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    if (!data) return null;
    return parseAiSearchJsonObject(data);
  } catch {
    return null;
  }
}

/**
 * Map a provider to a single category from their services/bio.
 * Used when a new provider is saved to notify alert subscribers.
 */
export function providerToCategory(
  provider: Provider
): AiSearchResult["category"] | null {
  const s = (provider.services.join(" ") + " " + (provider.bio ?? "")).toLowerCase();
  if (CATEGORY_TERMS.plumber.some((t) => s.includes(t))) return "plumber";
  if (CATEGORY_TERMS.electrician.some((t) => s.includes(t))) return "electrician";
  if (CATEGORY_TERMS.cleaner.some((t) => s.includes(t))) return "cleaner";
  if (CATEGORY_TERMS.gardener.some((t) => s.includes(t))) return "gardener";
  return null;
}

/** Service terms that map AI category to provider services/bio (lowercase). */
/**
 * Pri category "other" te besede ne zahtevajo zadetka v profilu (npr. "Vsi ponudniki"
 * sicer ne bi ujelo nobenega ponudnika).
 */
const GENERIC_QUERY_WORDS_OTHER = new Set([
  "vsi",
  "vse",
  "ves",
  "vsa",
  "vseh",
  "vsem",
  "ponudnik",
  "ponudniki",
  "izvajalec",
  "izvajalci",
  "uporabnik",
  "uporabniki",
  "pokaži",
  "pokazi",
  "najdi",
  "seznam",
  "daj",
  "mi",
  "storitev",
  "storitve",
  "list",
]);

const CATEGORY_TERMS: Record<AiSearchResult["category"], string[]> = {
  plumber: [
    "vodovod",
    "klepar",
    "pušilka",
    "pipe",
    "sanitarij",
    "radiator",
    "popravilo pip",
    "montaža sanitarij",
  ],
  electrician: [
    "elektrik",
    "svetilk",
    "napeljav",
    "elektrika",
    "montaža svetilk",
    "popravilo napeljav",
  ],
  cleaner: [
    "čiščenje",
    "pomivanje",
    "posprav",
    "čistilka",
    "pomivanje oken",
  ],
  gardener: [
    "vrt",
    "trava",
    "trave",
    "kosenje",
    "košnja",
    "obrezovanje",
    "vzdrževanje vrta",
    "trate",
  ],
  other: [],
};

/** Normalize for city match: lowercase, collapse spaces. */
function normalizeCity(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, " ");
}

/** True if provider location matches requested city (contains or equals). */
function locationMatchesCity(providerLocation: string, city: string): boolean {
  const a = normalizeCity(providerLocation);
  const b = normalizeCity(city);
  return a.includes(b) || b.includes(a);
}

function getEffectiveCities(result: AiSearchResult): string[] {
  const list = result.cities?.filter(Boolean) ?? [];
  if (list.length > 0) return list;
  if (result.city?.trim()) return [result.city.trim()];
  return [];
}

function providerMatchesAnyCity(
  providerLocation: string,
  cities: string[]
): boolean {
  return cities.some((c) => locationMatchesCity(providerLocation, c));
}

/**
 * Filter and sort providers using the AI search result.
 * - Category terms, keywords (for "other"), min/max rating, verified, price €/h.
 * - City/cities: OR po mestih; če ni zadetka v mestih, ohranimo kategorijo in cityRequestedButNoMatch.
 * - limit: zreže seznam po sortiranju.
 */
export function matchProvidersToAiResult(
  providers: Provider[],
  result: AiSearchResult
): AiSearchMatchResult {
  const { category, keywords, maxRating, minRating } = result;
  const terms = CATEGORY_TERMS[category];
  /** Za "other": besede kot "vsi"/"ponudniki" ne smejo izprazniti rezultatov. */
  const keywordsForOtherMatch =
    category === "other"
      ? keywords.filter(
          (k) => !GENERIC_QUERY_WORDS_OTHER.has(k.toLowerCase().trim())
        )
      : keywords;
  const keywordSet = new Set(keywordsForOtherMatch.map((k) => k.toLowerCase()));
  const citiesEff = getEffectiveCities(result);
  const cityLower = citiesEff.length > 0;

  let candidate: Provider[] = [];

  for (const provider of providers) {
    const servicesStr = provider.services.join(" ").toLowerCase();
    const bio = (provider.bio ?? "").toLowerCase();

    if (result.verifiedOnly && !provider.verified) continue;

    if (minRating != null && provider.rating < minRating) continue;

    if (maxRating != null && provider.rating > maxRating) continue;

    const priceEur = parsePricePerHourEur(provider.priceRange);
    if (result.priceMinEur != null) {
      if (priceEur == null || priceEur < result.priceMinEur) continue;
    }
    if (result.priceMaxEur != null) {
      if (priceEur == null || priceEur > result.priceMaxEur) continue;
    }

    let categoryMatch = false;
    if (category !== "other" && terms.length > 0) {
      for (const term of terms) {
        if (servicesStr.includes(term) || bio.includes(term)) {
          categoryMatch = true;
          break;
        }
      }
    } else if (category === "other") {
      categoryMatch = true;
    }

    if (!categoryMatch) continue;

    let keywordBonus = 0;
    for (const kw of keywordSet) {
      if (
        servicesStr.includes(kw) ||
        bio.includes(kw) ||
        provider.name.toLowerCase().includes(kw)
      ) {
        keywordBonus += 1;
      }
    }

    if (
      category === "other" &&
      keywordsForOtherMatch.length > 0 &&
      keywordBonus === 0
    ) {
      continue;
    }

    candidate.push(provider);
  }

  let cityRequestedButNoMatch = false;
  if (cityLower && candidate.length > 0) {
    const inAny = candidate.filter((p) =>
      providerMatchesAnyCity(p.location, citiesEff)
    );
    if (inAny.length > 0) {
      candidate = inAny;
    } else {
      cityRequestedButNoMatch = true;
    }
  }

  candidate.sort((a, b) => {
    if (citiesEff.length > 0) {
      const aIn = providerMatchesAnyCity(a.location, citiesEff);
      const bIn = providerMatchesAnyCity(b.location, citiesEff);
      if (aIn !== bIn) return bIn ? 1 : -1;
    }
    return b.rating - a.rating;
  });

  if (result.limit != null && result.limit > 0 && candidate.length > result.limit) {
    candidate = candidate.slice(0, result.limit);
  }

  return {
    providers: candidate,
    cityRequestedButNoMatch,
  };
}
