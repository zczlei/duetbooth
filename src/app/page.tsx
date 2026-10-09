import Link from "next/link";
import { PricingSection } from "@/components/PricingSection";
import { VideoGenerator } from "@/components/VideoGenerator";
import { EFFECTS, getFeaturedEffect } from "@/lib/effects";

export default function HomePage() {
  const featured = getFeaturedEffect();
  const others = EFFECTS.filter((e) => e.slug !== featured.slug);

  return (
    <main>
      <section
        className="hero home-hero"
        style={{ ["--effect-accent" as string]: featured.accent }}
      >
        <div className="shell hero-inner">
          <p className="brand-mark">AI Video Generator</p>
          <h1>Turn photos into short videos in minutes.</h1>
          <p className="lede">
            Upload your photos, pick a style, and create a ready-to-share clip.
            No editing skills needed.
          </p>
          <div className="meta-row">
            <span>Photo to video</span>
            <span>Multiple styles</span>
            <span>Pay per video</span>
          </div>
        </div>
      </section>

      <div className="shell">
        <VideoGenerator effect={featured} />

        <section id="styles" className="section">
          <h2>Popular styles</h2>
          <p className="muted section-intro">
            Start with the generator above, or open a style page for a focused
            workflow.
          </p>
          <div className="trend-grid">
            <Link
              href={`/effects/${featured.slug}`}
              className="trend-card"
              style={{ ["--effect-accent" as string]: featured.accent }}
            >
              <em>Popular</em>
              <strong>{featured.title}</strong>
              <span>{featured.description}</span>
            </Link>
            {others.map((effect) => (
              <Link
                key={effect.slug}
                href={`/effects/${effect.slug}`}
                className="trend-card"
                style={{ ["--effect-accent" as string]: effect.accent }}
              >
                <em>Style</em>
                <strong>{effect.title}</strong>
                <span>{effect.description}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>How it works</h2>
          <div className="how-grid">
            <article className="how-card">
              <span>01</span>
              <h3>Upload photos</h3>
              <p>Use clear portraits. One subject per photo works best.</p>
            </article>
            <article className="how-card">
              <span>02</span>
              <h3>Choose a style</h3>
              <p>Pick a template that matches the look you want.</p>
            </article>
            <article className="how-card">
              <span>03</span>
              <h3>Generate & download</h3>
              <p>We render a short MP4 you can save and share.</p>
            </article>
          </div>
        </section>

        <PricingSection effectSlug={featured.slug} />
      </div>
    </main>
  );
}
