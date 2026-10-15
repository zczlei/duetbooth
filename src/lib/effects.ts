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
          "Image 1 is the LEFT performer; Image 2 is the RIGHT performer for the whole clip — never switch sides and never blend the two faces. Preserve each person's face, hair, outfit and body shape from their own photo. Seamless burnt-orange studio booth, one silver condenser microphone hanging on a cable between them, warm saturated light. They alternate rap gestures and call-and-response into the shared mic; locked-off medium-wide camera, same framing throughout, one continuous 16:9 shot. Photoreal, sharp readable faces. No text, captions, logos or watermarks.",
      },
      {
        id: "friends-couples",
        name: "Friends & Couples",
        blurb: "Clearer left/right staging for pairs.",
        promptHint:
          "Image 1 LEFT, Image 2 RIGHT — couple or friends, sides fixed, faces never blend. Keep each face, hairstyle and outfit exactly from their photo. Warm orange COLORS-style booth, hanging mic centered between them, call-and-response gestures, locked camera, continuous 16:9 landscape. Natural skin tones. No text, captions, logos or watermarks.",
      },
      {
        id: "pets",
        name: "Rapping Pets",
        blurb: "Keep fur markings while adding playful motion.",
        promptHint:
          "Image 1 is the LEFT pet; Image 2 is the RIGHT pet — never swap sides. Preserve each animal's species, fur colors and markings from its photo; do not turn them into humans or add human hands. Playful upright staging in a bright orange studio booth under a hanging microphone, alternating energetic gestures, locked medium-wide 16:9 camera, one continuous shot. No text, captions, logos or watermarks.",
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
    slug: "burning-bridges",
    keyword: "burning bridges ai video",
    title: "Burning Bridges AI Video Generator — Drake Party Trend",
    cardTitle: "Burning Bridges AI Video",
    headline: "One photo. You take the party spot.",
    description:
      "Burning Bridges AI video generator for the Drake party trend: upload one clear photo and get a chandelier-lit handheld clip with the wave, the cup, and the Where she at? move. No prompt writing. Pay per clip from $4.90.",
    accent: "#d4a24a",
    durationSec: 10,
    aspectRatio: "9:16",
    subjects: 1,
    seoKeywords: [
      "burning bridges ai video",
      "drake burning bridges ai video",
      "burning bridges ai",
      "drake burning bridges ai",
      "burning bridges ai trend",
      "where she at ai video",
      "burning bridges face swap",
    ],
    templates: [
      {
        id: "chandelier-party",
        name: "Chandelier Party",
        blurb: "Crowded private dining room, warm light, wave at the lens.",
        promptHint:
          "Image 1 is the only lead identity — preserve face, hair and outfit from the photo in every frame; no celebrity likeness. Warm dim private dining room under crystal chandeliers, dark wood, soft amber light, distinct friends behind with silver cups (never clones of the lead). One continuous handheld phone-style shot at shoulder height with slight natural shake, close on the lead. The lead sways, points into the crowd, flicks a hand at the lens, raises one silver metal cup and waves. Vertical 9:16, natural skin tones, no cuts. No text, captions, logos or watermarks.",
      },
      {
        id: "where-she-at",
        name: "Where She At?",
        blurb: "Hand over the eyes, scanning the room on the meme beat.",
        promptHint:
          "Image 1 is the lead — keep face, hair and outfit from the photo. Chandelier-lit party, handheld 9:16. Silver cup in one hand; finger flicks at the lens; twice do a clear hand-over-eyes searching gesture as if scanning the room. Crowded friends behind, warm film look, one continuous shot, no celebrity likeness. No text, captions, logos or watermarks.",
      },
      {
        id: "party-pet",
        name: "Party Pet",
        blurb: "Put a pet in the party spot with playful swagger.",
        promptHint:
          "Image 1 is a pet lead — preserve species, fur markings and face from the photo; adapt cup and wave to existing limbs, do not add human hands or a human face. Packed chandelier party, silver cup raised, waving at handheld camera, warm golden light, soft-focus friends behind who are not copies of the pet. Cinematic vertical 9:16, one continuous shot. No text, captions, logos or watermarks.",
      },
    ],
    packs: [
      { id: "single", videos: 1, priceUsd: 4.9, label: "Single Video" },
      { id: "three", videos: 3, priceUsd: 9.9, label: "Three Pack" },
      { id: "ten", videos: 10, priceUsd: 19.9, label: "Creator Pack" },
    ],
    howTo: [
      {
        title: "Upload one clear photo",
        body: "Front-facing, evenly lit, face and upper body in frame. Full-body works best if you want outfit match. JPG, PNG or WebP up to 5MB.",
      },
      {
        title: "Pick a party style",
        body: "Chandelier Party for the classic Drake Burning Bridges look, Where She At? for the meme gesture, or Party Pet for animals.",
      },
      {
        title: "Generate & post",
        body: "Get a 10-second 9:16 burning bridges AI video. Add the sound from the platform library when you post — the clip itself has no licensed track baked in.",
      },
    ],
    faq: [
      {
        q: "What is the burning bridges AI video trend?",
        a: "Short AI clips that put you (or a friend, pet, or character) into a chandelier-lit party scene inspired by Drake's \"Burning Bridges\" music video — waving at a handheld camera, raising a cup, often with the Where she at? hand-over-eyes gesture. People search it as burning bridges AI video and Drake burning bridges AI video.",
      },
      {
        q: "Is this a face swap on the original Drake MV?",
        a: "No. DuetBooth generates a fresh party scene from your photo and the trend staging. We do not edit or redistribute copyrighted music-video footage.",
      },
      {
        q: "How many photos do I need?",
        a: "One. This trend has a single starring spot — the person (or pet) at the center of the party.",
      },
      {
        q: "Do I have to write a prompt?",
        a: "No. The chandelier room, handheld energy, cup, and gesture options are built into the style templates.",
      },
      {
        q: "Does the video include the Drake song?",
        a: "No. Download the silent (or ambient) clip, then add \"Burning Bridges\" from TikTok, Reels, or Shorts' own sound library when you post — that is the usual and safer path for the trend.",
      },
      {
        q: "Can I use a pet or a character still?",
        a: "Yes. Use Party Pet for animals, or upload a clear character/portrait still with Chandelier Party or Where She At?. Sharp face (or markings) and even light work best.",
      },
      {
        q: "How long is the clip and what ratio?",
        a: "10 seconds at 9:16, ready for TikTok, Reels, and Shorts.",
      },
      {
        q: "Do I need an account?",
        a: "No. Generate as a guest. Sign in with Google if you want credits to follow you across devices.",
      },
    ],
  },
  {
    slug: "bulin-47",
    keyword: "bulin 47 ai",
    title: "Bulin 47 AI Video Generator — Freestyle Trend from 1 Photo",
    cardTitle: "Bulin 47 AI Video",
    headline: "One photo. You take the freestyle spot.",
    description:
      "Bulin 47 AI video generator for the viral freestyle trend: upload one clear photo and get a red-lit handheld party clip with dembow energy. No prompt writing. Pay per clip from $4.90.",
    accent: "#e23d4a",
    durationSec: 10,
    aspectRatio: "9:16",
    subjects: 1,
    seoKeywords: [
      "bulin 47 ai",
      "bulin 47 ai video",
      "bulin 47 ai video generator",
      "bulin 47 freestyle ai",
      "bulin47 ai",
      "bulin 47 face swap",
      "bulin 47 trend",
    ],
    templates: [
      {
        id: "freestyle-lead",
        name: "Freestyle Lead",
        blurb: "Red-lit room, handheld camera, you as the center freestyle.",
        promptHint:
          "Image 1 is the sole lead freestyle performer — preserve face, hair and outfit from the photo; not a celebrity likeness. Packed red-lit room party, crowd behind with phones, dembow-rhythm body moves and energetic hand gestures. Handheld phone camera, slight shake, staying on the lead. Vertical 9:16, one continuous cinematic social shot, natural skin tones. No text, captions, logos or watermarks.",
      },
      {
        id: "crowd-hype",
        name: "Crowd Hype",
        blurb: "Tighter crowd, phones up, high-energy cut.",
        promptHint:
          "Image 1 is the lead in a dense night party crowd with phones raised — keep face and outfit from the photo. Deep red lighting, high-energy freestyle motion, tight handheld framing, vertical 9:16, one continuous shot. Background people stay distinct, never clones of the lead. No text, captions, logos or watermarks.",
      },
      {
        id: "character-recast",
        name: "Character Recast",
        blurb: "Stylized character or meme still in the freestyle spot.",
        promptHint:
          "Image 1 is a stylized character lead — preserve distinctive face design, colors and rendering style from the reference; do not turn it into a random realistic celebrity. Red-lit party room, handheld camera, crowd energy, freestyle center staging, vertical 9:16, one continuous shot. No text, captions, logos or watermarks.",
      },
    ],
    packs: [
      { id: "single", videos: 1, priceUsd: 4.9, label: "Single Video" },
      { id: "three", videos: 3, priceUsd: 9.9, label: "Three Pack" },
      { id: "ten", videos: 10, priceUsd: 19.9, label: "Creator Pack" },
    ],
    howTo: [
      {
        title: "Upload one clear photo",
        body: "Front-facing, evenly lit, face visible. Skip sunglasses and group shots. JPG, PNG or WebP up to 5MB.",
      },
      {
        title: "Pick a freestyle style",
        body: "Freestyle Lead for the classic Bulin 47 AI look, Crowd Hype for denser party energy, or Character Recast for meme stills.",
      },
      {
        title: "Generate & post",
        body: "Get a 10-second 9:16 clip. Add the trending freestyle sound from TikTok, Reels, or Shorts when you post — the file has no licensed track baked in.",
      },
    ],
    faq: [
      {
        q: "What is Bulin 47 AI?",
        a: "Bulin 47 AI is the search name for tools that put your face into the viral Bulin 47 freestyle party clip. On DuetBooth it means a one-photo generator that builds a trend-faithful red-lit freestyle scene — not an official Bulin 47 product.",
      },
      {
        q: "Is this a face swap on the original freestyle video?",
        a: "No. DuetBooth generates a fresh freestyle party scene from your photo and the trend staging. We do not edit or redistribute the original clip.",
      },
      {
        q: "How many photos do I need?",
        a: "One. The trend has a single lead performer in the center of the frame.",
      },
      {
        q: "Do I have to write a prompt?",
        a: "No. Room light, handheld energy, and freestyle motion options are built into the templates.",
      },
      {
        q: "Does the video include the original song?",
        a: "No. Download the clip, then add the Bulin 47 freestyle sound from the platform library when you post.",
      },
      {
        q: "Can I use a character or meme still?",
        a: "Yes — use Character Recast with a clear still you have rights to use. Sharp face or distinctive features work best.",
      },
      {
        q: "How long is the clip and what ratio?",
        a: "10 seconds at 9:16, ready for TikTok, Reels, and Shorts.",
      },
      {
        q: "Do I need an account?",
        a: "No. Generate as a guest. Sign in with Google if you want credits across devices.",
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
          "Image 1 is the dancer — preserve face, hair and outfit from the photo. Joyful dance in heavy night rain on a wet city street, neon reflections on asphalt, raindrops and mist visible. Medium shot, slow handheld or gentle push-in, vertical 9:16, one continuous cinematic shot, natural skin tones under cool neon. No text, captions, logos or watermarks.",
      },
      {
        id: "soft-drizzle",
        name: "Soft Drizzle",
        blurb: "Gentler rain with warmer light.",
        promptHint:
          "Image 1 is the dancer — keep face and outfit from the photo. Soft drizzle at dusk, warmer street lights, gentle emotional dance, light rain on hair and clothes. Stable medium vertical 9:16 framing, one continuous shot. No text, captions, logos or watermarks.",
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
          "Image 1 is the subject — keep recognizable face structure and hair from the photo while applying a non-graphic zombie look (pale skin, tired eyes, subtle decay makeup; no gore, no blood, no open wounds). Slow walk toward camera on a dim empty street, horror color grade, medium shot, vertical 9:16, one continuous shot, slight handheld. No text, captions, logos or watermarks.",
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
