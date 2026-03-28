"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getProviderById, getProviderSlots } from "@/lib/mock-providers";
import { seedDefaultSlotsIfEmpty } from "@/lib/slotsData";
import { addProviderSlot, removeProviderSlot } from "@/lib/slotsData";
import { getBookedSlotsForProvider } from "@/lib/mock-orders";
import { useToast } from "@/components/toast";
import type { TimeSlot } from "@/types/provider";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sl-SI", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const DEFAULT_START = "09:00";
const DEFAULT_END = "12:00";

export default function ProviderCalendarPage() {
  const [mounted, setMounted] = useState(false);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newStart, setNewStart] = useState(DEFAULT_START);
  const [newEnd, setNewEnd] = useState(DEFAULT_END);
  const { showToast } = useToast();

  const loadSlots = useCallback(async () => {
    const user = getCurrentUser();
    if (user?.role === "provider") {
      const profileId = user.providerProfileId ?? "p1";
      await seedDefaultSlotsIfEmpty(profileId);
      setSlots(getProviderSlots(profileId));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    void loadSlots();
  }, [mounted, loadSlots]);

  const user = mounted ? getCurrentUser() : null;

  if (mounted && (!user || user.role !== "provider")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p className="text-[#6b7280]">Za dostop se morate prijaviti kot ponudnik.</p>
        <Link href="/auth/provider/login" className="rounded-lg bg-[#1d283a] px-4 py-2 text-white">
          Prijava
        </Link>
      </div>
    );
  }

  const profileId = user?.providerProfileId ?? "p1";
  const profile = getProviderById(profileId);
  const booked = getBookedSlotsForProvider(profileId);

  const isBooked = (slot: TimeSlot) =>
    booked.some((b) => b.date === slot.date && b.start === slot.start);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate.trim()) {
      showToast("Izberite datum.", "error");
      return;
    }
    await addProviderSlot(profileId, { date: newDate, start: newStart, end: newEnd });
    loadSlots();
    setNewDate("");
    setNewStart(DEFAULT_START);
    setNewEnd(DEFAULT_END);
    showToast("Termin dodan.", "success");
  };

  const handleRemove = async (slot: TimeSlot) => {
    if (isBooked(slot)) {
      showToast("Rezerviranega termina ni mogoče odstraniti.", "error");
      return;
    }
    await removeProviderSlot(profileId, slot.date, slot.start);
    loadSlots();
    showToast("Termin odstranjen.", "success");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/provider" className="text-[#6b7280] hover:text-[#1d283a]">
        ← Nazaj na nadzorno ploščo
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-[#1d283a]">
        Upravljanje urnika
      </h1>
      <p className="mt-2 text-[#6b7280]">
        Dodajajte in odstranjujte termine. Rezervirani termini se samodejno odstranijo iz razpoložljivosti.
      </p>
      {profile && (
        <p className="mt-1 text-sm text-[#6b7280]">
          Profil: {profile.name}
        </p>
      )}

      <div className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-[#1d283a]">Dodaj nov termin</h2>
        <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="newDate" className="mb-1 block text-sm text-[#6b7280]">
              Datum
            </label>
            <input
              id="newDate"
              type="date"
              min={today}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>
          <div>
            <label htmlFor="newStart" className="mb-1 block text-sm text-[#6b7280]">
              Od
            </label>
            <input
              id="newStart"
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>
          <div>
            <label htmlFor="newEnd" className="mb-1 block text-sm text-[#6b7280]">
              Do
            </label>
            <input
              id="newEnd"
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="rounded-lg border border-[#e5e7eb] px-3 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#1d283a] px-4 py-2 font-medium text-white hover:bg-[#2a3a4f]"
          >
            Dodaj termin
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-[#1d283a]">Vaši termini</h2>
        <p className="mt-2 text-sm text-[#6b7280]">
          Rezervirani termini so označeni in jih ne morete odstraniti (stranka jih je rezervirala).
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {slots.map((slot) => {
            const booked = isBooked(slot);
            return (
              <div
                key={`${slot.date}-${slot.start}`}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                  booked
                    ? "border-amber-300 bg-amber-50"
                    : "border-[#e5e7eb] bg-[#f8f9fa]"
                }`}
              >
                <div>
                  <div className="font-medium text-[#1d283a]">
                    {formatDate(slot.date)}
                  </div>
                  <div className="text-sm text-[#6b7280]">
                    {slot.start} – {slot.end}
                    {booked && (
                      <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-xs text-amber-800">
                        rezervirano
                      </span>
                    )}
                  </div>
                </div>
                {!booked && (
                  <button
                    type="button"
                    onClick={() => handleRemove(slot)}
                    className="rounded p-1.5 text-red-600 hover:bg-red-50"
                    aria-label="Odstrani termin"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
