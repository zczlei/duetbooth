import type { Metadata } from "next";
import { SnapGenGuidePage } from "@/components/guides/SnapGenGuidePage";

export const metadata: Metadata = {
  title: "SnapGen AI Video Generator — Review, Prompts & Alternatives",
  description:
    "SnapGen AI video generator guide: what it is, free vs credits, no-watermark notes, prompt pack, and photo-to-trend alternatives like DuetBooth.",
  keywords: [
    "snapgen ai video generator",
    "snapgen ai",
    "snapgen ai free",
    "snapgen ai video generator no watermark",
    "free ai video generator no watermark",
  ],
  alternates: { canonical: "/guides/snapgen-ai-video-generator" },
  openGraph: {
    title: "SnapGen AI Video Generator — Review, Prompts & Alternatives",
    description:
      "How to use SnapGen AI, prompt ideas, free vs credits, and when DuetBooth is the better photo-to-trend path.",
    url: "/guides/snapgen-ai-video-generator",
  },
};

export default function Page() {
  return <SnapGenGuidePage />;
}
