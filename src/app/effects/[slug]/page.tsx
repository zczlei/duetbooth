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

  return {
    title: `${effect.title} | DuetBooth`,
    description: effect.description,
    keywords: effect.seoKeywords,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const effect = getEffect(slug);
  if (!effect) notFound();
  return <EffectPage effect={effect} />;
}
