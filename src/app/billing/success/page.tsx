import Link from "next/link";
import { BillingSuccessClient } from "@/components/BillingSuccessClient";

/** Stripe redirects here with session_id — must not be statically prerendered. */
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string; effect?: string }>;
};

export default async function BillingSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id || "";
  const effect = params.effect || "";
  const backHref = effect ? `/effects/${effect}` : "/";

  return (
    <main className="shell billing-page">
      <p className="brand-mark">DuetBooth</p>
      <h1>Payment received</h1>
      <p className="muted">
        We are confirming your Stripe checkout and adding video credits to this
        browser.
      </p>
      <BillingSuccessClient sessionId={sessionId} backHref={backHref} />
      <p className="billing-links">
        <Link href={backHref}>Back to generator</Link>
        {" · "}
        <Link href="/#pricing">Buy more credits</Link>
      </p>
    </main>
  );
}
