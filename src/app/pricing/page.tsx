import Link from "next/link";
import { Suspense } from "react";
import { PricingBackLink } from "@/components/pricing-back-link";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0 € / mesec",
    subtitle: "Za testiranje platforme in prva naročila.",
    features: [
      "Do 3 aktivna naročila na mesec",
      "Osnovni prikaz v iskanju",
      "In-app obvestila",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "19 € / mesec",
    subtitle: "Za aktivne uporabnike in ponudnike.",
    features: [
      "Neomejeno število naročil",
      "Prednostna pozicija v iskanju",
      "Napredna obvestila in podpora",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "49 € / mesec",
    subtitle: "Za ekipe in podjetja z več lokacijami.",
    features: [
      "Več uporabniških računov",
      "Poročila in statistike (coming soon)",
      "Namenska podpora",
    ],
  },
] as const;

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1d283a]">
            Naročnine DomServices
          </h1>
          <p className="mt-2 text-[#6b7280]">
            Vizualni model monetizacije za šolski projekt. Plačevanje naročnin
            ni implementirano; strani prikazujejo, kako bi lahko izgledali paketi.
          </p>
        </div>
        <Suspense
          fallback={
            <span className="hidden rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#6b7280] sm:inline-block">
              Nazaj…
            </span>
          }
        >
          <PricingBackLink className="hidden rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#1d283a] hover:bg-[#f8f9fa] sm:inline-block" />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className="flex flex-col rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1d283a]">
                {p.name}
              </h2>
            </div>
            <p className="text-2xl font-bold text-[#1d283a]">{p.price}</p>
            <p className="mt-1 text-sm text-[#6b7280]">{p.subtitle}</p>
            <ul className="mt-4 space-y-1 text-sm text-[#4b5563]">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 text-emerald-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/customer/register"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#1d283a] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a3a4f]"
            >
              Začni brezplačno
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-[#9ca3af]">
        Opomba: naročnine so del koncepta monetizacije v dokumentaciji. V tej
        verziji aplikacije so prikazane le kot informativni paketi; dejansko
        zaračunavanje poteka le prek Stripe plačil za posamezna naročila.
      </p>
    </main>
  );
}

