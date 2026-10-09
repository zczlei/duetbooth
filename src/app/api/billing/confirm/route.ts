import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import {
  COOKIE_NAME,
  getOrCreateWalletId,
  grantCredits,
} from "@/lib/wallet";

/**
 * Confirm a Checkout session after redirect (works without webhook locally).
 * Idempotent with the webhook path.
 */
export async function GET(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const cookieWalletId = await getOrCreateWalletId();

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Payment not completed",
          paymentStatus: session.payment_status,
        },
        { status: 402 },
      );
    }

    const metaWallet =
      session.metadata?.walletId || session.client_reference_id || cookieWalletId;
    const videos = Number(session.metadata?.videos || 0);
    if (!metaWallet || !Number.isFinite(videos) || videos < 1) {
      return NextResponse.json(
        { error: "Invalid session metadata" },
        { status: 400 },
      );
    }

    // Credit the wallet recorded at checkout (idempotent on session id).
    const paid = await grantCredits({
      walletId: metaWallet,
      videos,
      sessionId: session.id,
    });

    let walletId = metaWallet;
    let credits = paid.credits;
    let alreadyGranted = paid.alreadyGranted;

    if (cookieWalletId !== metaWallet) {
      if (cookieWalletId.startsWith("user_")) {
        // Signed-in user opened success in a different browser context —
        // also attach this session's credits to their account wallet.
        const userGrant = await grantCredits({
          walletId: cookieWalletId,
          videos,
          sessionId: session.id,
        });
        walletId = cookieWalletId;
        credits = userGrant.credits;
        alreadyGranted = userGrant.alreadyGranted;
      } else {
        // Guest cookie drifted (localhost ↔ prod). Adopt the paying wallet.
        const jar = await cookies();
        jar.set(COOKIE_NAME, metaWallet, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      credits,
      videosGranted: videos,
      alreadyGranted,
      walletId,
      cookieWalletId,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Confirm failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
