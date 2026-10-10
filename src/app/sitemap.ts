import type { MetadataRoute } from "next";
import { EFFECTS } from "@/lib/effects";

const BASE = "https://duetbooth.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const effectEntries: MetadataRoute.Sitemap = EFFECTS.map((effect) => ({
    url: `${BASE}/effects/${effect.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: effect.featured ? 0.9 : 0.8,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...effectEntries,
  ];
}
