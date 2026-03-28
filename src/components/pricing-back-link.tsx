"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";

/**
 * Only allow same-origin app paths under /customer or /provider (open-redirect safe).
 */
function safeReturnPath(from: string | null): string | null {
  if (!from || !from.startsWith("/")) return null;
  if (from.includes("//") || from.includes("..")) return null;
  if (!from.startsWith("/customer") && !from.startsWith("/provider")) {
    return null;
  }
  return from;
}

type Props = {
  className?: string;
};

/**
 * Back link on /pricing: uses ?from=... when present, else role-based home, else /.
 */
export function PricingBackLink({ className }: Props) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [href, setHref] = useState("/");
  const [label, setLabel] = useState("Nazaj");

  useEffect(() => {
    const safe = safeReturnPath(from);
    if (safe) {
      setHref(safe);
      setLabel("Nazaj");
      return;
    }
    const u = getCurrentUser();
    if (u?.role === "customer") {
      setHref("/customer");
      setLabel("Nazaj");
      return;
    }
    if (u?.role === "provider") {
      setHref("/provider");
      setLabel("Nazaj");
      return;
    }
    setHref("/");
    setLabel("Na začetek");
  }, [from]);

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
