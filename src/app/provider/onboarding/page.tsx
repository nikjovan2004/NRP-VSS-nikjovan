"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, setCurrentUser } from "@/lib/auth";
import { getProviderById } from "@/lib/mock-providers";
import { upsertProvider } from "@/lib/providersData";

const SLOVENIAN_CITIES = [
  "Ljubljana", "Maribor", "Celje", "Kranj", "Velenje", "Koper", "Novo Mesto",
  "Ptuj", "Trbovlje", "Kamnik", "Domžale", "Škofja Loka", "Nova Gorica",
  "Murska Sobota", "Slovenj Gradec", "Postojna", "Jesenice", "drugo",
];

const COMMON_SERVICES = [
  "Vodovod", "Elektrika", "Čiščenje stanovanj", "Čiščenje hiš",
  "Kosenje trave", "Obrezovanje", "Vzdrževanje vrta", "Kleparstvo",
  "Montaža sanitarij", "Popravilo pušilke", "Montaža svetilk",
  "Popravilo napeljav", "Slikopleskarska dela", "Pohištvena mizarija",
  "Selitve", "Kleparska dela", "Ogrevanje in klimatizacija", "Ključavničarstvo",
];

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? getCurrentUser() : null;

  useEffect(() => {
    if (!mounted) return;
    if (!user || user.role !== "provider") {
      router.replace("/auth/provider/login");
      return;
    }
    // Pre-fill display name from account name
    setDisplayName(user.name);
    // If provider already has a complete profile, skip onboarding
    if (user.providerProfileId) {
      const existing = getProviderById(user.providerProfileId);
      if (existing && existing.services.length > 0) {
        router.replace("/provider");
      }
    }
  }, [mounted, user, router]);

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustomService = () => {
    const trimmed = customService.trim();
    if (trimmed && !selectedServices.includes(trimmed)) {
      setSelectedServices((prev) => [...prev, trimmed]);
    }
    setCustomService("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.providerProfileId) return;

    if (selectedServices.length === 0) {
      setError("Izberite vsaj eno storitev.");
      return;
    }
    if (!location) {
      setError("Izberite lokacijo.");
      return;
    }
    if (!pricePerHour || isNaN(Number(pricePerHour)) || Number(pricePerHour) <= 0) {
      setError("Vnesite veljavno urno postavko.");
      return;
    }

    setSaving(true);
    try {
      const finalLocation = location === "drugo" ? customLocation.trim() || "drugo" : location;

      await upsertProvider({
        id: user.providerProfileId,
        name: displayName.trim() || user.name,
        services: selectedServices,
        rating: 0,
        reviewCount: 0,
        verified: false,
        priceRange: `${pricePerHour} €/h`,
        location: finalLocation,
        bio: bio.trim(),
      });

      // Update the stored user name if display name changed
      if (displayName.trim() && displayName.trim() !== user.name) {
        const updated = { ...user, name: displayName.trim() };
        setCurrentUser(updated);
      }

      router.push("/provider");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-[#1d283a] px-3 py-1 text-xs font-medium text-white">
            Korak 1 od 1 – Nastavitev profila
          </span>
          <h1 className="mt-4 text-2xl font-bold text-[#1d283a]">
            Dobrodošli! Uredite svoj profil izvajalca.
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Te podatke bodo videle stranke pri iskanju storitev.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          {/* Display name */}
          <div>
            <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-[#1d283a]">
              Ime / naziv podjetja *
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="npr. Janez Kovač – Vodovodarstvo"
              className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium text-[#1d283a]">
              Kratek opis (opcijsko)
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Opišite svoje izkušnje, specialnosti, način dela..."
              className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-medium text-[#1d283a]">
              Lokacija delovanja *
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            >
              <option value="">Izberite mesto...</option>
              {SLOVENIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {location === "drugo" && (
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Vnesite kraj..."
                className="mt-2 w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
              />
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium text-[#1d283a]">
              Urna postavka (€/h) *
            </label>
            <div className="flex items-center gap-2">
              <input
                id="price"
                type="number"
                min={1}
                max={500}
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                required
                placeholder="npr. 35"
                className="w-32 rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
              />
              <span className="text-[#6b7280]">€ / uro</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="mb-2 text-sm font-medium text-[#1d283a]">
              Storitve, ki jih nudite *
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SERVICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleService(s)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    selectedServices.includes(s)
                      ? "border-[#1d283a] bg-[#1d283a] text-white"
                      : "border-[#e5e7eb] bg-white text-[#6b7280] hover:border-[#1d283a]/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Custom service */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={customService}
                onChange={(e) => setCustomService(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomService())}
                placeholder="Dodaj svojo storitev..."
                className="flex-1 rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-sm focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
              />
              <button
                type="button"
                onClick={addCustomService}
                className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-sm text-[#6b7280] hover:bg-[#f8f9fa]"
              >
                Dodaj
              </button>
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedServices.map((s) => (
                  <span
                    key={s}
                    className="flex items-center gap-1 rounded-full bg-[#1d283a] px-3 py-1 text-sm text-white"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => toggleService(s)}
                      className="ml-1 text-white/70 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#1d283a] py-3 font-medium text-white hover:bg-[#2a3a4f] disabled:opacity-50"
          >
            {saving ? "Shranjujem..." : "Shrani profil in pojdi na nadzorno ploščo →"}
          </button>
        </form>
      </div>
    </div>
  );
}
