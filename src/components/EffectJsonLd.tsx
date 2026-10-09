import type { EffectDefinition } from "@/lib/effects";

type Props = {
  effect: EffectDefinition;
};

/** FAQPage + WebPage + BreadcrumbList for effect landing pages. */
export function EffectJsonLd({ effect }: Props) {
  const pageUrl = `https://duetbooth.co/effects/${effect.slug}`;
  const shortName =
    effect.cardTitle ||
    effect.title.replace(/\s*—\s*.*$/, "").trim() ||
    effect.title;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: effect.title,
        description: effect.description,
        isPartOf: {
          "@type": "WebSite",
          name: "DuetBooth",
          url: "https://duetbooth.co",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://duetbooth.co/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Effects",
            item: "https://duetbooth.co/#styles",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: shortName,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: effect.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
