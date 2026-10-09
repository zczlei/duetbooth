"use client";

import { useState } from "react";

type Props = {
  packId: string;
  effectSlug?: string;
  label?: string;
  className?: string;
};

export function BuyPackButton({
  packId,
  effectSlug,
  label = "Buy now",
  className = "primary-btn",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onBuy() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, effectSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }
      if (!data.url) {
        throw new Error("No checkout URL returned");
      }
      window.location.href = data.url as string;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="buy-pack">
      <button
        type="button"
        className={className}
        disabled={loading}
        onClick={onBuy}
      >
        {loading ? "Redirecting…" : label}
      </button>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
