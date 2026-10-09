import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EffectPage } from "@/components/EffectPage";
import { EFFECTS, getEffect } from "@/lib/effects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return EFFECTS.map((effect) => ({ slug: effect.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const effect = getEffect(slug);
  if (!effect) return {};

  // Title is the topic only — layout template appends "| DuetBooth" once.
  return {
    title: effect.title,
    description: effect.description,
    keywords: effect.seoKeywords,
    alternates: { canonical: `/effects/${effect.slug}` },
    openGraph: {
      title: effect.title,
      description: effect.description,
      url: `/effects/${effect.slug}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const effect = getEffect(slug);
  if (!effect) notFound();
  return <EffectPage effect={effect} />;
}
