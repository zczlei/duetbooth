import Link from "next/link";
import type { EffectDefinition } from "@/lib/effects";
import { EFFECTS } from "@/lib/effects";
import { EffectJsonLd } from "@/components/EffectJsonLd";
import {
  HotelLobbyGuide,
  HotelLobbyIdeas,
} from "@/components/effect-guides/HotelLobbyGuide";
import { PricingSection } from "@/components/PricingSection";
import { VideoGenerator } from "@/components/VideoGenerator";

export function EffectPage({ effect }: { effect: EffectDefinition }) {
  const others = EFFECTS.filter((e) => e.slug !== effect.slug);
  const showHotelGuide = effect.slug === "hotel-lobby";

  return (
    <main>
      <EffectJsonLd effect={effect} />
      <section
        className="hero"
        style={{ ["--effect-accent" as string]: effect.accent }}
      >
        <div className="shell hero-inner">
          <p className="brand-mark">AI Video Style</p>
          <h1>{effect.title}</h1>
          <p className="lede">{effect.headline}</p>
          <p className="muted hero-desc">{effect.description}</p>
          <div className="meta-row">
            <span>{effect.durationSec}s</span>
            <span>{effect.aspectRatio}</span>
            <span>{effect.subjects === 2 ? "2 photos" : "1 photo"}</span>
            <span>Pay per video</span>
          </div>
        </div>
      </section>

      <div className="shell">
        <VideoGenerator effect={effect} />

        <section className="section">
          <h2>How it works</h2>
          <div className="how-grid">
            {effect.howTo.map((step, i) => (
              <article key={step.title} className="how-card">
                <span>0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {showHotelGuide ? <HotelLobbyGuide /> : null}

        <PricingSection effectSlug={effect.slug} />

        <section className="section">
          <h2>Questions</h2>
          <div className="faq">
            {effect.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {showHotelGuide ? <HotelLobbyIdeas /> : null}

        {others.length ? (
          <section className="section">
            <h2>More styles</h2>
            <div className="trend-grid">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  href={`/effects/${item.slug}`}
                  className="trend-card"
                  style={{ ["--effect-accent" as string]: item.accent }}
                >
                  <strong>{item.cardTitle || item.title}</strong>
                  <span>{item.headline}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
