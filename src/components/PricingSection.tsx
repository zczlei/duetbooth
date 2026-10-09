import { CREDIT_PACKS } from "@/lib/packs";
import { BuyPackButton } from "@/components/BuyPackButton";

type Props = {
  effectSlug?: string;
};

export function PricingSection({ effectSlug }: Props) {
  return (
    <section className="section pricing" id="pricing">
      <h2>Pay per video. No subscription.</h2>
      <p className="muted pricing-lede">
        One-time packs. Credits never expire. Failed renders return the credit.
      </p>
      <div className="pack-grid">
        {CREDIT_PACKS.map((pack) => (
          <article key={pack.id} className="pack-card">
            <h3>{pack.label}</h3>
            <p className="price">
              ${pack.priceUsd.toFixed(2)}
              <small>
                {" "}
                / {pack.videos} video{pack.videos > 1 ? "s" : ""}
              </small>
            </p>
            <p className="muted">{pack.blurb}</p>
            <BuyPackButton
              packId={pack.id}
              effectSlug={effectSlug}
              label={`Buy ${pack.label}`}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
