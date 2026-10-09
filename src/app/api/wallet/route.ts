import { NextResponse } from "next/server";
import { auth, isGoogleAuthConfigured } from "@/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { storeBackend } from "@/lib/store";
import { getOrCreateWalletId, getWalletBalance } from "@/lib/wallet";

export async function GET() {
  const session = await auth();
  const walletId = await getOrCreateWalletId();
  const credits = await getWalletBalance(walletId);
  return NextResponse.json({
    credits,
    stripeReady: isStripeConfigured(),
    googleReady: isGoogleAuthConfigured(),
    store: await storeBackend(),
    user: session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }
      : null,
  });
}
