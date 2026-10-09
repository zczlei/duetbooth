import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { grantCredits } from "@/lib/wallet";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not set" },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const walletId =
        session.metadata?.walletId || session.client_reference_id || "";
      const videos = Number(session.metadata?.videos || 0);

      if (
        session.payment_status === "paid" &&
        walletId &&
        Number.isFinite(videos) &&
        videos >= 1
      ) {
        await grantCredits({
          walletId,
          videos,
          sessionId: session.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
