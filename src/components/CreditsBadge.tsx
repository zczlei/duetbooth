"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type WalletPayload = {
  credits?: number;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
};

export function CreditsBadge() {
  const [credits, setCredits] = useState<number | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/wallet", { cache: "no-store" });
        const data = (await res.json()) as WalletPayload;
        if (cancelled) return;
        if (typeof data.credits === "number") setCredits(data.credits);
        setSignedIn(Boolean(data.user?.email || data.user?.name));
      } catch {
        // ignore
      }
    }
    load();
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <Link
      href="/#pricing"
      className="credits-badge"
      title={
        signedIn
          ? "Your account video credits"
          : "Guest credits (sign in to keep them)"
      }
    >
      {credits === null
        ? "…"
        : `${credits} credit${credits === 1 ? "" : "s"}`}
    </Link>
  );
}
