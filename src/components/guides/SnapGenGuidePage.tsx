import Link from "next/link";

const FAQ = [
  {
    q: "What is the SnapGen AI video generator?",
    a: "SnapGen AI is an online studio that turns text or images into short AI video clips. People search for it when they want a browser-based SnapGen AI video generator with model choices such as Veo or Seedance-style options.",
  },
  {
    q: "Is SnapGen AI free and unlimited with no watermark?",
    a: "SnapGen usually shows a credit balance and paid plans. Some model or resolution settings may cost zero credits for a while, which is why YouTube guides call it free and unlimited — but that can rotate. Always check the credit cost next to Generate before you run a clip. DuetBooth is separate: pay per trend video, no monthly plan required.",
  },
  {
    q: "Does SnapGen AI add a watermark?",
    a: "Most creators look for SnapGen AI video generator no watermark downloads. Watermark and commercial rules depend on SnapGen's current model terms and plan — verify on their site before publishing. DuetBooth downloads are pay-per-clip trend videos without a subscription watermark layer.",
  },
  {
    q: "SnapGen vs DuetBooth — which should I use?",
    a: "Use SnapGen (or similar open studios) when you want free-form text-to-video or image-to-video with prompt control. Use DuetBooth when you already have photos and want a one-click trend template — Hotel Lobby, Burning Bridges, Rain Dance — without writing prompts.",
  },
  {
    q: "Can I make a Drake Burning Bridges or Hotel Lobby clip in SnapGen?",
    a: "You can try with a long prompt, but results vary. DuetBooth locks those looks into templates so you only upload photos and generate.",
  },
];

export function SnapGenGuideJsonLd() {
  const pageUrl = "https://duetbooth.co/guides/snapgen-ai-video-generator";
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "SnapGen AI Video Generator — Review, Prompts & Alternatives",
        description:
          "What SnapGen AI is, how to use the SnapGen AI video generator, free vs credits, prompt ideas, and photo-to-video alternatives like DuetBooth.",
        isPartOf: {
          "@type": "WebSite",
          name: "DuetBooth",
          url: "https://duetbooth.co",
        },
      },
      {
        "@type": "BreadcrumbList",
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
            name: "Guides",
            item: "https://duetbooth.co/guides/snapgen-ai-video-generator",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "SnapGen AI Video Generator",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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

export function SnapGenGuidePage() {
  return (
    <main>
      <SnapGenGuideJsonLd />
      <section
        className="hero"
        style={{ ["--effect-accent" as string]: "#2bb5a0" }}
      >
        <div className="shell hero-inner">
          <p className="brand-mark">Guide</p>
          <h1>SnapGen AI Video Generator — Review, Prompts &amp; Alternatives</h1>
          <p className="lede">
            What SnapGen AI is, how people use it for free text-to-video, and when
            a photo-to-trend tool like DuetBooth is the faster path.
          </p>
          <p className="muted hero-desc">
            Independent guide on DuetBooth. We are not affiliated with SnapGen
            AI. Official product:{" "}
            <a
              href="https://snapgenai.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              snapgenai.io
            </a>
            .
          </p>
          <div className="meta-row">
            <span>Tutorial</span>
            <span>Prompt pack</span>
            <span>Alternatives</span>
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="effect-guide">
          <section className="section guide-section">
            <h2>What is the SnapGen AI video generator?</h2>
            <p>
              SnapGen AI is a browser studio for short AI clips: type a prompt
              (text-to-video) or upload a still (image-to-video), pick a model and
              length, then download the result. Searchers looking for a{" "}
              <strong>SnapGen AI video generator</strong> usually want a free
              online tool, no watermark, and as few limits as possible — or a
              clear walkthrough when the credit meter and model list feel
              confusing.
            </p>
            <p>
              That search intent is real. The honest answer is a bit more
              nuanced than &quot;unlimited forever&quot;: SnapGen shows credits
              next to Generate, and pricing pages list paid credit packs. Some
              model or resolution combinations may show a zero credit cost for a
              period, which is why tutorial videos pitch it as free. Treat those
              free tiers as rotating, not guaranteed.
            </p>
          </section>

          <section className="section guide-section">
            <h2>How to use SnapGen AI (quick tutorial)</h2>
            <h3>Step 1 — Open the studio</h3>
            <p>
              Go to the official SnapGen site, sign in if required, and open the
              video generation studio (often labeled Studio or Video Gen). Prefer
              typing the domain yourself so you do not land on a look-alike page.
            </p>
            <h3>Step 2 — Choose text-to-video or image-to-video</h3>
            <p>
              Text-to-video: write a short scene description (subject, setting,
              camera, motion). Image-to-video: upload one clear PNG/JPEG/WebP and
              describe how it should move. Keep uploads you have rights to use.
            </p>
            <h3>Step 3 — Check model, length, and credit cost</h3>
            <p>
              Before you hit Generate, read the credit number beside the button.
              Duration, resolution, and model all change cost. If a YouTube guide
              said &quot;unlimited free,&quot; confirm the same model still shows
              zero credits on your account today.
            </p>
            <h3>Step 4 — Download promptly</h3>
            <p>
              Save the file to your device. Provider preview links can expire.
              Add music in CapCut, TikTok, or Reels if the clip is silent.
            </p>
          </section>

          <section className="section guide-section">
            <h2>SnapGen AI video generator prompt pack</h2>
            <p>
              Use these as starting points for text-to-video. Keep one subject,
              one camera move, and one mood per prompt — stacked instructions
              usually fail.
            </p>
            <ul className="guide-list">
              <li>
                <strong>Street night.</strong> A person walking toward camera on
                a wet neon street at night, slow push-in, cinematic 9:16,
                shallow depth of field, light rain.
              </li>
              <li>
                <strong>Product desk.</strong> Soft daylight on a wooden desk, a
                ceramic mug and laptop, gentle camera orbit, clean commercial
                look, 16:9.
              </li>
              <li>
                <strong>Nature drone.</strong> Aerial glide over a pine forest
                at golden hour, smooth forward motion, no people, 16:9.
              </li>
              <li>
                <strong>Portrait motion.</strong> Close-up of a person looking
                left then smiling at camera, subtle hair movement, soft window
                light, 9:16.
              </li>
              <li>
                <strong>Food steam.</strong> Top-down bowl of ramen with rising
                steam, slow rotate, warm kitchen light, appetizing macro, 9:16.
              </li>
            </ul>
            <p>
              For image-to-video, keep the prompt shorter: &quot;slow push-in,
              soft breeze, keep face identity, no morphing&quot; usually beats a
              paragraph of style adjectives.
            </p>
          </section>

          <section className="section guide-section">
            <h2>SnapGen AI vs DuetBooth (and when to switch)</h2>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>
                    <th scope="col"> </th>
                    <th scope="col">SnapGen AI</th>
                    <th scope="col">DuetBooth</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Best for</th>
                    <td>Open text / image → video experiments</td>
                    <td>Trend templates from your photos</td>
                  </tr>
                  <tr>
                    <th scope="row">Prompt writing</th>
                    <td>Usually required</td>
                    <td>Not required — style is fixed</td>
                  </tr>
                  <tr>
                    <th scope="row">Pricing shape</th>
                    <td>Credits + optional monthly packs</td>
                    <td>Pay per video from $4.90</td>
                  </tr>
                  <tr>
                    <th scope="row">Examples</th>
                    <td>Veo / Seedance-style short clips</td>
                    <td>
                      Hotel Lobby, Burning Bridges, Rain Dance
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">&quot;Free unlimited&quot;</th>
                    <td>Sometimes via rotating zero-credit models</td>
                    <td>
                      Framing preview free on some styles; full render is paid
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              If your goal is &quot;free unlimited SnapGen AI video generator no
              watermark,&quot; start on SnapGen and verify today&apos;s credit
              cost. If your goal is &quot;put my face in this week&apos;s TikTok
              trend without fighting prompts,&quot; open DuetBooth instead.
            </p>
          </section>

          <section className="section guide-section">
            <h2>Try photo-to-trend on DuetBooth</h2>
            <p>
              Same credit wallet, no prompt engineering — pick a style and
              upload.
            </p>
            <div className="trend-grid" style={{ marginTop: "1rem" }}>
              <Link
                href="/effects/bulin-47"
                className="trend-card"
                style={{ ["--effect-accent" as string]: "#e23d4a" }}
              >
                <strong>Bulin 47 AI Video</strong>
                <span>One photo → freestyle party trend.</span>
              </Link>
              <Link
                href="/effects/burning-bridges"
                className="trend-card"
                style={{ ["--effect-accent" as string]: "#d4a24a" }}
              >
                <strong>Burning Bridges AI Video</strong>
                <span>One photo → Drake party trend clip.</span>
              </Link>
              <Link
                href="/effects/hotel-lobby"
                className="trend-card"
                style={{ ["--effect-accent" as string]: "#ff6a2b" }}
              >
                <strong>Hotel Lobby AI Video</strong>
                <span>Two photos → orange booth duet.</span>
              </Link>
            </div>
          </section>

          <section className="section">
            <h2>Questions</h2>
            <div className="faq">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
