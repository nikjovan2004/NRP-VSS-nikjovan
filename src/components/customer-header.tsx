"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/auth";
import { NotificationBell } from "@/components/notification-bell";

export function CustomerHeader() {
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getCurrentUser() : null;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/customer" className="text-xl font-bold text-[#1d283a]">
          DomServices
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/customer/search" className="text-sm text-[#6b7280] hover:text-[#1d283a]">
            Iskanje
          </Link>
          <Link href="/customer/favorites" className="text-sm text-[#6b7280] hover:text-[#1d283a]">
            Priljubljeni
          </Link>
          <Link href="/customer/orders" className="text-sm text-[#6b7280] hover:text-[#1d283a]">
            Moja naročila
          </Link>
          {user ? (
            <>
              <NotificationBell />
              <span className="text-sm text-[#6b7280]">{user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-[#e5e7eb] px-3 py-1.5 text-sm text-[#6b7280] hover:bg-[#f8f9fa]"
              >
                Odjava
              </button>
            </>
          ) : (
            <Link
              href="/auth/customer/login"
              className="rounded-lg bg-[#1d283a] px-3 py-1.5 text-sm text-white hover:bg-[#2a3a4f]"
            >
              Prijava
            </Link>
          )}
        </nav>

        {/* Mobile: bell + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {user && <NotificationBell />}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f8f9fa]"
            aria-label="Meni"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-[#e5e7eb] bg-white px-4 pb-4 sm:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            <Link
              href="/customer/search"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#6b7280] hover:text-[#1d283a]"
            >
              Iskanje
            </Link>
            <Link
              href="/customer/favorites"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#6b7280] hover:text-[#1d283a]"
            >
              Priljubljeni
            </Link>
            <Link
              href="/customer/orders"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-[#6b7280] hover:text-[#1d283a]"
            >
              Moja naročila
            </Link>
            {user ? (
              <>
                <span className="text-sm text-[#6b7280]">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-[#e5e7eb] px-3 py-2 text-left text-sm text-[#6b7280] hover:bg-[#f8f9fa]"
                >
                  Odjava
                </button>
              </>
            ) : (
              <Link
                href="/auth/customer/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-[#1d283a] px-3 py-2 text-center text-sm text-white hover:bg-[#2a3a4f]"
              >
                Prijava
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
