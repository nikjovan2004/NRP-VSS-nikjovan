import Link from "next/link";

const BENEFITS = [
  {
    icon: "🔍",
    title: "Iskanje v minutah",
    description: "Opišite problem v naravnem jeziku – sistem vam predlaga ustrezne ponudnike.",
  },
  {
    icon: "✓",
    title: "Preverjeni ponudniki",
    description: "Samo verificirani izvajalci z ocenami drugih uporabnikov.",
  },
  {
    icon: "📅",
    title: "Razpoložljivost v realnem času",
    description: "Vidite, kdaj je ponudnik dostopen – rezervirajte termin brez čakanja.",
  },
  {
    icon: "💳",
    title: "Varno plačilo",
    description: "Plačilo s kartico, denar zaščiten do potrditve opravljenega dela.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1d283a] sm:text-4xl">
            DomServices
          </h1>
          <p className="mt-3 text-lg text-[#6b7280]">
            AI platforma za pametno iskanje in rezervacijo storitev za dom –
            popravila, čiščenje, vzdrževanje. Od iskanja do rezervacije v manj kot 5 minut.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex gap-4 rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1d283a]/5 text-xl"
                aria-hidden
              >
                {b.icon}
              </span>
              <div>
                <h2 className="font-semibold text-[#1d283a]">{b.title}</h2>
                <p className="mt-0.5 text-sm text-[#6b7280]">{b.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-xl border-2 border-[#1d283a]/20 bg-white p-8 shadow-sm">
          <h2 className="text-center text-xl font-semibold text-[#1d283a]">
            Kako želite nadaljevati?
          </h2>
          <p className="mt-1 text-center text-sm text-[#6b7280]">
            Izberite vlogo za prijavo ali registracijo
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/customer/login"
              className="flex items-center justify-center gap-4 rounded-lg border-2 border-[#1d283a]/20 bg-white px-6 py-5 transition-all hover:border-[#1d283a]/40 hover:bg-[#f8f9fa]"
            >
              <span className="text-3xl" aria-hidden>🏠</span>
              <div className="text-left">
                <span className="font-semibold text-[#1d283a]">Stranka</span>
                <p className="text-sm text-[#6b7280]">
                  Iskanje in rezervacija storitev
                </p>
              </div>
            </Link>
            <Link
              href="/auth/provider/login"
              className="flex items-center justify-center gap-4 rounded-lg border-2 border-[#1d283a]/20 bg-white px-6 py-5 transition-all hover:border-[#1d283a]/40 hover:bg-[#f8f9fa]"
            >
              <span className="text-3xl" aria-hidden>🔧</span>
              <div className="text-left">
                <span className="font-semibold text-[#1d283a]">Ponudnik</span>
                <p className="text-sm text-[#6b7280]">
                  Prejem naročil in upravljanje storitev
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
