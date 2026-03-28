"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/auth";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, "customer");
    setLoading(false);
    if (result.success && result.user) {
      router.push("/customer");
      router.refresh();
    } else {
      setError(result.error ?? "Prišlo je do napake.");
    }
  };

  return (
    <main className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#1d283a]">Prijava za stranke</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Vpišite se v svoj račun
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-[#1d283a]">
            E-pošta
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
            placeholder="ime@primer.si"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-[#1d283a]">
            Geslo
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-[#e5e7eb] px-4 py-2 focus:border-[#1d283a] focus:outline-none focus:ring-1 focus:ring-[#1d283a]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1d283a] py-2 font-medium text-white transition hover:bg-[#2a3a4f] disabled:opacity-50"
        >
          {loading ? "Prijava..." : "Prijava"}
        </button>
      </form>

      <p className="text-center text-sm text-[#6b7280]">
        Še nimate računa?{" "}
        <Link href="/auth/customer/register" className="font-medium text-[#1d283a] hover:underline">
          Registracija
        </Link>
      </p>

      <Link
        href="/"
        className="block text-center text-sm text-[#6b7280] hover:text-[#1d283a]"
      >
        ← Nazaj na izbiro vloge
      </Link>
    </main>
  );
}
