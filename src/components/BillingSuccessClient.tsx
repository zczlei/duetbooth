"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  sessionId: string;
  backHref: string;
};

export function BillingSuccessClient({ sessionId, backHref }: Props) {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [credits, setCredits] = useState<number | null>(null);
  const [videosGranted, setVideosGranted] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("Missing session_id. Open this page from Stripe Checkout.");
      return;
    }

    let cancelled = false;
    async function confirm() {
      try {
        const res = await fetch(
          `/api/billing/confirm?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Could not confirm payment");
        }
        if (cancelled) return;
        setCredits(data.credits);
        setVideosGranted(data.videosGranted);
        setStatus("ok");
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Confirm failed");
      }
    }
    confirm();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "loading") {
    return <p className="note">Confirming payment…</p>;
  }

  if (status === "error") {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="billing-result">
      <p className="note">
        Added {videosGranted} video credit{videosGranted === 1 ? "" : "s"}.
        Balance: <strong>{credits}</strong>.
      </p>
      <Link href={backHref} className="primary-btn">
        Generate a video
      </Link>
    </div>
  );
}
