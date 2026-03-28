import { getBookedSlotsForProvider } from "@/lib/mock-orders";
import type { Provider, TimeSlot } from "@/types/provider";

export const MOCK_PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Janez Kovač – Vodovodarstvo",
    services: ["Vodovod", "Popravilo pušilke", "Montaža sanitarij"],
    rating: 4.8,
    reviewCount: 47,
    verified: false,
    priceRange: "45 €/h",
    location: "Velenje",
    bio: "15 let izkušenj v vodovodstvu. Hitri odziv, kakovostno delo.",
  },
  {
    id: "p2",
    name: "Marjana Čistoča",
    services: ["Čiščenje stanovanj", "Čiščenje hiš", "Pomivanje oken"],
    rating: 4.9,
    reviewCount: 82,
    verified: false,
    priceRange: "25 €/h",
    location: "Ljubljana",
    bio: "Profesionalno čiščenje za domače in poslovne prostore.",
  },
  {
    id: "p3",
    name: "Peter Elektro",
    services: ["Elektrika", "Montaža svetilk", "Popravilo napeljav"],
    rating: 4.7,
    reviewCount: 31,
    verified: false,
    priceRange: "55 €/h",
    location: "Maribor",
    bio: "Licencirani električar. Hitro in varno.",
  },
  {
    id: "p4",
    name: "Vrtnarstvo Mlakar",
    services: ["Kosenje trate", "Obrezovanje", "Vzdrževanje vrta"],
    rating: 4.6,
    reviewCount: 23,
    verified: false,
    priceRange: "35 €/h",
    location: "Celje",
    bio: "Popoln oskrbni vrtov in zelenih površin.",
  },
  {
    id: "p5",
    name: "Bojan Kleparstvo",
    services: ["Kleparstvo", "Popravilo pip", "Montaža radiatorjev"],
    rating: 4.8,
    reviewCount: 56,
    verified: false,
    priceRange: "50 €/h",
    location: "Velenje",
    bio: "Specialist za popravila v gospodinjstvu.",
  },
];

// --- Dynamic provider profiles stored in localStorage ---

const DYNAMIC_PROVIDERS_KEY = "domservices-dynamic-providers";

export function getDynamicProviders(): Provider[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DYNAMIC_PROVIDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setDynamicProviders(providers: Provider[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DYNAMIC_PROVIDERS_KEY, JSON.stringify(providers));
}

export function upsertDynamicProvider(provider: Provider) {
  const providers = getDynamicProviders();
  const idx = providers.findIndex((p) => p.id === provider.id);
  if (idx === -1) {
    providers.push(provider);
  } else {
    providers[idx] = provider;
  }
  setDynamicProviders(providers);
}

export function getAllProviders(): Provider[] {
  const base = MOCK_PROVIDERS;
  const dynamic = getDynamicProviders();
  if (dynamic.length === 0) return [...base];
  const map = new Map<string, Provider>();
  for (const p of base) {
    map.set(p.id, p);
  }
  for (const p of dynamic) {
    map.set(p.id, p);
  }
  return Array.from(map.values());
}

const KEYWORDS: Record<string, string[]> = {
  vodovod: ["pušilka", "pipe", "voda", "vodovod", "sanitarije"],
  čiščenje: ["čiščenje", "pomivanje", "pospraviti", "čistilka"],
  elektrika: ["elektrika", "luč", "napeljava", "svetilka", "tiščala"],
  vrt: ["trava", "vrta", "kositi", "obrezati", "vrtnar"],
  kleparstvo: ["klepar", "pipe", "radiator", "montaža"],
};

export function mockAiSearch(query: string): Provider[] {
  const all = getAllProviders();
  const q = query.toLowerCase().trim();
  if (!q) return all;

  const matched: { provider: Provider; score: number }[] = [];

  for (const provider of all) {
    let score = 0;
    for (const service of provider.services) {
      if (q.includes(service.toLowerCase())) score += 3;
      if (service.toLowerCase().includes(q)) score += 2;
    }
    for (const [category, words] of Object.entries(KEYWORDS)) {
      if (provider.services.some((s) => s.toLowerCase().includes(category))) {
        for (const word of words) {
          if (q.includes(word)) score += 2;
        }
      }
    }
    if (provider.location.toLowerCase().includes(q)) score += 1;
    if (provider.name.toLowerCase().includes(q)) score += 1;
    if (score > 0) {
      matched.push({ provider, score });
    }
  }

  matched.sort((a, b) => b.score - a.score);
  const result = matched.map((m) => m.provider);
  return result.length > 0 ? result : all;
}

export function getProviderById(id: string): Provider | undefined {
  const dynamic = getDynamicProviders().find((p) => p.id === id);
  if (dynamic) return dynamic;
  return MOCK_PROVIDERS.find((p) => p.id === id);
}

// --- Provider availability slots (localStorage) ---

const PROVIDER_SLOTS_KEY = "domservices-provider-slots";

function getStoredSlots(): Record<string, TimeSlot[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROVIDER_SLOTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredSlots(data: Record<string, TimeSlot[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROVIDER_SLOTS_KEY, JSON.stringify(data));
}

export function getProviderSlots(providerId: string): TimeSlot[] {
  const data = getStoredSlots();
  return data[providerId] ?? [];
}

export function setProviderSlots(providerId: string, slots: TimeSlot[]) {
  const data = getStoredSlots();
  data[providerId] = slots;
  setStoredSlots(data);
}

export function addProviderSlot(providerId: string, slot: TimeSlot) {
  const slots = getProviderSlots(providerId);
  const exists = slots.some((s) => s.date === slot.date && s.start === slot.start);
  if (!exists) {
    slots.push(slot);
    setProviderSlots(providerId, slots);
  }
}

export function removeProviderSlot(providerId: string, date: string, start: string) {
  const slots = getProviderSlots(providerId).filter(
    (s) => !(s.date === date && s.start === start)
  );
  setProviderSlots(providerId, slots);
}

export function getDefaultSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    slots.push({ date: dateStr, start: "09:00", end: "12:00" });
    if (i < 5) {
      slots.push({ date: dateStr, start: "14:00", end: "18:00" });
    }
  }
  return slots;
}

export function seedDefaultSlotsIfEmpty(providerId: string) {
  if (getProviderSlots(providerId).length === 0) {
    setProviderSlots(providerId, getDefaultSlots());
  }
}

export function mockGetAvailability(providerId: string): TimeSlot[] {
  const base =
    getProviderSlots(providerId).length > 0
      ? getProviderSlots(providerId)
      : getDefaultSlots();
  const booked = getBookedSlotsForProvider(providerId);
  return base.filter(
    (s) => !booked.some((b) => b.date === s.date && b.start === s.start)
  );
}

/** True if the provider has any available slot overlapping the given date/time window. */
export function providerHasAvailabilityInRange(
  providerId: string,
  date: string,
  timeStart: string,
  timeEnd: string
): boolean {
  const slots = mockGetAvailability(providerId);
  return slots.some(
    (s) =>
      s.date === date && s.start <= timeEnd && s.end >= timeStart
  );
}

/** Count how many free slots a provider has today (local time). */
export function countTodayAvailability(providerId: string): number {
  const today = new Date().toISOString().slice(0, 10);
  const slots = mockGetAvailability(providerId);
  return slots.filter((s) => s.date === today).length;
}
