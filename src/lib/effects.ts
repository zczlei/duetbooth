export type EffectPack = {
  id: string;
  videos: number;
  priceUsd: number;
  label: string;
};

export type EffectTemplate = {
  id: string;
  name: string;
  blurb: string;
  /** Optional remote reference video URL for reference-to-video providers */
  referenceVideoUrl?: string;
  promptHint?: string;
};

export type EffectDefinition = {
  slug: string;
  keyword: string;
  title: string;
  headline: string;
  description: string;
  accent: string;
  durationSec: number;
  aspectRatio: "16:9" | "9:16";
  subjects: 1 | 2;
  seoKeywords: string[];
  templates: EffectTemplate[];
  packs: EffectPack[];
  faq: { q: string; a: string }[];
  howTo: { title: string; body: string }[];
  featured?: boolean;
};

/**
 * Add a new video keyword page by appending an entry here.
 * Route becomes: /effects/{slug}
 */
export const EFFECTS: EffectDefinition[] = [
  {
    slug: "hotel-lobby",
    keyword: "hotel lobby ai",
    title: "Hotel Lobby AI Video Generator",
    headline: "Two photos. One orange booth duet.",
    description:
      "Upload two clear portraits and turn them into a ready-to-share Hotel Lobby style studio duet. No prompt writing required.",
    accent: "#ff6a2b",
    durationSec: 10,
    aspectRatio: "16:9",
    subjects: 2,
    featured: true,
    seoKeywords: [
      "hotel lobby ai",
      "hotel lobby ai video",
      "hotel lobby ai generator",
      "migos ai",
      "hotel lobby ai filter",
    ],
    templates: [
      {
        id: "classic-orange",
        name: "Classic Orange Booth",
        blurb: "Locked medium-wide duet with a hanging mic.",
        promptHint:
          "Two performers in a bright orange studio booth, one hanging microphone, alternating rap gestures, landscape 16:9",
      },
      {
        id: "friends-couples",
        name: "Friends & Couples",
        blurb: "Clearer left/right staging for pairs.",
        promptHint:
          "Couple or friends performing a call-and-response in an orange COLORS-style booth",
      },
      {
        id: "pets",
        name: "Rapping Pets",
        blurb: "Keep fur markings while adding playful motion.",
        promptHint:
          "Two pets performing in an orange studio booth under a hanging microphone",
      },
    ],
    packs: [
      { id: "single", videos: 1, priceUsd: 4.9, label: "Single Video" },
      { id: "three", videos: 3, priceUsd: 9.9, label: "Three Pack" },
      { id: "ten", videos: 10, priceUsd: 19.9, label: "Creator Pack" },
    ],
    howTo: [
      {
        title: "Pick your pair",
        body: "Choose two people, friends, a couple, or pets. One clear subject per photo works best.",
      },
      {
        title: "Upload clear portraits",
        body: "Front-facing photos with visible eyes and even light. We keep each reference locked to a side.",
      },
      {
        title: "Generate the duet",
        body: "Render runs in the background. Download when ready. Failed jobs release reserved credits.",
      },
    ],
    faq: [
      {
        q: "How do I stop the two characters from swapping faces?",
        a: "Upload one subject per photo and keep left/right order consistent. Reference-to-video anchors each identity to a side.",
      },
      {
        q: "How much does one video cost?",
        a: "Packs start at $4.90 for a single short video. Purchased credits stay on your account until you use them.",
      },
      {
        q: "Which model powers this?",
        a: "We use modern AI video models to animate your photos into a short studio-style clip. Results can vary with photo quality and lighting.",
      },
    ],
  },
  {
    slug: "rain-dance",
    keyword: "rain dance ai",
    title: "Rain Dance AI Video Generator",
    headline: "Put anyone in the rain-dance trend.",
    description:
      "One clear portrait becomes a cinematic rain-soaked performance clip. Built as a second effect page you can clone for the next trend.",
    accent: "#3ec7ff",
    durationSec: 8,
    aspectRatio: "9:16",
    subjects: 1,
    seoKeywords: ["rain dance ai", "raindance ai", "rain dance ai video"],
    templates: [
      {
        id: "night-rain",
        name: "Night Rain Street",
        blurb: "Neon reflections and heavy rain.",
        promptHint:
          "Person dancing joyfully in heavy night rain on a wet street, cinematic vertical video",
      },
      {
        id: "soft-drizzle",
        name: "Soft Drizzle",
        blurb: "Gentler rain with warmer light.",
        promptHint:
          "Person dancing in soft drizzle at dusk, emotional vertical video",
      },
    ],
    packs: [
      { id: "single", videos: 1, priceUsd: 4.9, label: "Single Video" },
      { id: "three", videos: 3, priceUsd: 9.9, label: "Three Pack" },
    ],
    howTo: [
      {
        title: "Upload one portrait",
        body: "A clear face and upper body give the model the cleanest identity lock.",
      },
      {
        title: "Choose a rain look",
        body: "Pick night street or soft drizzle before you spend credits.",
      },
      {
        title: "Generate & share",
        body: "Vertical 9:16 output is ready for Reels and TikTok.",
      },
    ],
    faq: [
      {
        q: "Is this the same as face swap?",
        a: "No. We generate a new scene from your portrait and a trend prompt instead of editing copyrighted source footage.",
      },
    ],
  },
  {
    slug: "zombie-trend",
    keyword: "ai zombie trend",
    title: "AI Zombie Trend Video Generator",
    headline: "Turn a portrait into the zombie trend.",
    description:
      "A third sample effect page. Duplicate this config when the next viral video keyword appears.",
    accent: "#8dff6a",
    durationSec: 8,
    aspectRatio: "9:16",
    subjects: 1,
    seoKeywords: ["zombie trend", "ai zombie trend", "zombie ai video"],
    templates: [
      {
        id: "street-zombie",
        name: "Street Zombie",
        blurb: "Slow walk toward camera with horror grading.",
        promptHint:
          "Person transformed into cinematic zombie walking toward camera, vertical social video",
      },
    ],
    packs: [
      { id: "single", videos: 1, priceUsd: 4.9, label: "Single Video" },
      { id: "three", videos: 3, priceUsd: 9.9, label: "Three Pack" },
    ],
    howTo: [
      {
        title: "Upload a portrait",
        body: "Front light and a neutral expression usually convert cleanly.",
      },
      {
        title: "Generate the trend clip",
        body: "One click produces a short vertical horror-style transformation.",
      },
    ],
    faq: [
      {
        q: "Can I try other styles?",
        a: "Yes. Open the home page or More styles section to switch between Hotel Lobby, Rain Dance, and other looks.",
      },
    ],
  },
];

export function getEffect(slug: string) {
  return EFFECTS.find((e) => e.slug === slug);
}

export function getFeaturedEffect() {
  return EFFECTS.find((e) => e.featured) ?? EFFECTS[0];
}
