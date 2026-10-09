import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripe) {
    stripe = new Stripe(key);
  }
  return stripe;
}

/**
 * Public site origin for Stripe success/cancel redirects.
 * Prefer runtime secrets (APP_URL / AUTH_URL) — Next.js inlines NEXT_PUBLIC_*
 * at build time from .env.local, which would otherwise bake localhost into prod.
 */
export function getAppUrl() {
  const raw =
    process.env.APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3005";
  return raw.replace(/\/$/, "");
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
