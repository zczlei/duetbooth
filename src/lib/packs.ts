export type CreditPack = {
  id: string;
  videos: number;
  priceUsd: number;
  label: string;
  blurb: string;
};

/** Shared one-time packs used site-wide (all effect pages). */
export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "single",
    videos: 1,
    priceUsd: 4.9,
    label: "Single Video",
    blurb: "One finished clip for a single post.",
  },
  {
    id: "three",
    videos: 3,
    priceUsd: 9.9,
    label: "Three Pack",
    blurb: "Three renders for testing different photos.",
  },
  {
    id: "ten",
    videos: 10,
    priceUsd: 19.9,
    label: "Creator Pack",
    blurb: "Best per-video rate. Credits never expire.",
  },
];

export function getPack(packId: string) {
  return CREDIT_PACKS.find((p) => p.id === packId);
}

/** Convert dollars to Stripe integer cents. */
export function toStripeCents(priceUsd: number) {
  return Math.round(priceUsd * 100);
}
