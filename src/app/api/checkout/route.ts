import { NextResponse } from "next/server";
import { getPack, toStripeCents } from "@/lib/packs";
import { getAppUrl, getStripe, isStripeConfigured } from "@/lib/stripe";
import { getOrCreateWalletId } from "@/lib/wallet";

type Body = {
  packId?: string;
  /** Optional effect slug for success redirect. */
  effectSlug?: string;
};

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const pack = body.packId ? getPack(body.packId) : undefined;
  if (!pack) {
    return NextResponse.json({ error: "Unknown pack" }, { status: 400 });
  }

  const walletId = await getOrCreateWalletId();
  const appUrl = getAppUrl();
  // Keep {CHECKOUT_SESSION_ID} literal — Stripe replaces it; do not URL-encode braces.
  const successUrl = body.effectSlug
    ? `${appUrl}/billing/success?effect=${encodeURIComponent(body.effectSlug)}&session_id={CHECKOUT_SESSION_ID}`
    : `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelPath = body.effectSlug
    ? `/effects/${encodeURIComponent(body.effectSlug)}`
    : "/";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${appUrl}${cancelPath}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: toStripeCents(pack.priceUsd),
            product_data: {
              name: `${pack.label} — ${pack.videos} video credit${pack.videos > 1 ? "s" : ""}`,
              description: pack.blurb,
            },
          },
        },
      ],
      metadata: {
        project: "duetbooth",
        walletId,
        packId: pack.id,
        videos: String(pack.videos),
        ...(body.effectSlug ? { effectSlug: body.effectSlug } : {}),
      },
      client_reference_id: walletId,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
