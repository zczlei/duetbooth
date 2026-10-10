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

export type EffectPreview = {
  /** Frontend canvas storyboard — never hits the generate pipeline. */
  mode: "storyboard";
  label: string;
  note: string;
};

export type EffectDefinition = {
  slug: string;
  keyword: string;
  title: string;
  /** Shorter label for homepage / internal link anchors (optional). */
  cardTitle?: string;
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
  /** Optional free client-side framing preview (hotel-lobby). */
  preview?: EffectPreview;
};

/**
 * Add a new video keyword page by appending an entry here.
 * Route becomes: /effects/{slug}
 */
export const EFFECTS: EffectDefinition[] = [
  {
    slug: "hotel-lobby",
    keyword: "hotel lobby ai",
    title: "Hotel Lobby AI Video Generator — Migos Trend from 2 Photos",
    cardTitle: "Hotel Lobby AI Video Generator",
    headline: "Two photos. One orange booth duet.",
    description:
      "Hotel lobby AI video generator with free framing preview: upload two photos, see the orange booth layout, then unlock the Migos hotel lobby duet. No prompt writing, pay per clip from $4.90.",
    accent: "#ff6a2b",
    durationSec: 10,
    aspectRatio: "16:9",
    subjects: 2,
    featured: true,
    seoKeywords: [
      "hotel lobby ai",
      "hotel lobby ai video",
      "hotel lobby ai generator",
      "free hotel lobby ai generator",
      "hotel lobby ai video free",
      "migos hotel lobby ai",
      "migos ai",
      "hotel lobby ai filter",
      "hotel lobby colors booth",
    ],
    preview: {
      mode: "storyboard",
      label: "Preview framing free",
      note: "See who lands left, who lands right, and how the booth frame crops — before you spend a credit.",
    },
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
        body: "Two subjects only. First upload stays left, second stays right — friends, couples, bandmates, or pets.",
      },
      {
        title: "Upload two clear portraits",
        body: "One photo per person, front-facing and evenly lit. JPG, PNG or WebP up to 5MB. Avoid sunglasses and group shots.",
      },
      {
        title: "Preview free, then unlock",
        body: "Preview framing free in your browser (0 credits). When left/right looks right, unlock the 10-second 16:9 clip for one credit.",
      },
    ],
    faq: [
      {
        q: "What is the hotel lobby AI trend?",
        a: "A two-person AI duet recreation of Migos' \"Hotel Lobby\" performance — orange lobby lighting, a hanging microphone, both subjects lip-syncing in a locked medium-wide shot. People post it on TikTok, Reels and Shorts.",
      },
      {
        q: "How many photos do I need?",
        a: "Two — one per person. Upload order sets who stands left and who stands right, and that position stays fixed through the clip.",
      },
      {
        q: "Do I have to write a prompt?",
        a: "No. The trend's framing, lighting and microphone position are built into the style template, so you only upload photos and press generate.",
      },
      {
        q: "Is there a free hotel lobby AI video generator?",
        a: "Yes — the framing preview is free. Upload two photos, see the orange booth layout and who stands left or right, then spend one credit ($4.90) to render and download the full 10-second clip. No card needed for the preview and no subscription behind it.",
      },
      {
        q: "How long is the video and what ratio?",
        a: "10 seconds at 16:9, which suits YouTube and landscape feeds. Crop to vertical in your editor if you need a 9:16 frame for TikTok or Reels.",
      },
      {
        q: "Can I use it for couples, friends, or pets?",
        a: "Yes. Classic Orange Booth is the trend look, Friends & Couples separates two subjects more clearly, and Rapping Pets animates two animals while keeping their fur markings.",
      },
      {
        q: "Do I need an account?",
        a: "No. You can generate and download as a guest. Sign in with Google if you want your credit balance available on another device.",
      },
      {
        q: "Does the clip include the original song?",
        a: "No. You add the audio yourself when you post, using the platform's own sound library — which is also the safest way to stay within the platform's licensing.",
      },
    ],
  },
  {
    slug: "rain-dance",
    keyword: "rain dance ai",
    title: "Rain Dance AI Video Generator",
    headline: "Put anyone in the rain-dance trend.",
    description:
      "Rain dance AI video generator: turn one portrait into a cinematic rain-soaked clip — neon night street or soft drizzle. Pay per clip, 8s vertical.",
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
      "AI zombie trend video generator: turn one portrait into a short horror-style transformation clip with street color grading. No prompt writing.",
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
