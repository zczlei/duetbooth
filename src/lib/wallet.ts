import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { storeGet, storePut } from "@/lib/store";

const COOKIE_NAME = "duetbooth_wallet";

export type WalletRecord = {
  id: string;
  credits: number;
  /** Stripe Checkout session IDs already credited (idempotent). */
  grantedSessions: string[];
  updatedAt: string;
};

function walletKey(id: string) {
  return `wallet:${id}`;
}

function emptyWallet(id: string): WalletRecord {
  return {
    id,
    credits: 0,
    grantedSessions: [],
    updatedAt: new Date().toISOString(),
  };
}

/** Stable wallet id for a Google (or Auth.js) user subject. */
export function userWalletId(userId: string) {
  return `user_${userId}`;
}

export async function getGuestWalletId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) {
    return existing;
  }
  const id = randomUUID();
  jar.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}

/**
 * Prefer logged-in Google user wallet; otherwise guest cookie wallet.
 * Dynamic import avoids a circular dependency with src/auth.ts.
 */
export async function getOrCreateWalletId(): Promise<string> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (session?.user?.id) {
    const id = userWalletId(session.user.id);
    await ensureWallet(id);
    return id;
  }
  return getGuestWalletId();
}

export async function readWallet(walletId: string): Promise<WalletRecord> {
  return (
    (await storeGet<WalletRecord>(walletKey(walletId))) ?? emptyWallet(walletId)
  );
}

export async function getWalletBalance(walletId: string): Promise<number> {
  const wallet = await readWallet(walletId);
  return wallet.credits;
}

async function writeWallet(wallet: WalletRecord) {
  wallet.updatedAt = new Date().toISOString();
  await storePut(walletKey(wallet.id), wallet);
}

/** Ensure a user wallet row exists (so logins are visible in storage). */
export async function ensureWallet(walletId: string): Promise<WalletRecord> {
  const existing = await storeGet<WalletRecord>(walletKey(walletId));
  if (existing) return existing;
  const wallet = emptyWallet(walletId);
  await writeWallet(wallet);
  return wallet;
}

/**
 * Move guest-cookie credits into the signed-in user wallet.
 */
export async function mergeGuestWalletIntoUser(
  targetWalletId: string,
): Promise<{ mergedCredits: number }> {
  const user = await ensureWallet(targetWalletId);

  const jar = await cookies();
  const guestId = jar.get(COOKIE_NAME)?.value;
  if (!guestId || !/^[0-9a-f-]{36}$/i.test(guestId)) {
    return { mergedCredits: 0 };
  }
  if (guestId === targetWalletId) {
    return { mergedCredits: 0 };
  }

  const guest = await readWallet(guestId);
  if (guest.credits <= 0 && guest.grantedSessions.length === 0) {
    return { mergedCredits: 0 };
  }

  const mergedCredits = guest.credits;
  user.credits += guest.credits;
  guest.credits = 0;

  for (const sessionId of guest.grantedSessions) {
    if (!user.grantedSessions.includes(sessionId)) {
      user.grantedSessions.push(sessionId);
    }
  }
  if (user.grantedSessions.length > 200) {
    user.grantedSessions = user.grantedSessions.slice(-200);
  }

  await writeWallet(user);
  await writeWallet(guest);
  return { mergedCredits };
}

/**
 * Grant credits after a paid Stripe session. Idempotent on sessionId.
 */
export async function grantCredits(opts: {
  walletId: string;
  videos: number;
  sessionId: string;
}): Promise<{ credits: number; alreadyGranted: boolean }> {
  const wallet = await readWallet(opts.walletId);

  if (wallet.grantedSessions.includes(opts.sessionId)) {
    return { credits: wallet.credits, alreadyGranted: true };
  }

  wallet.credits += opts.videos;
  wallet.grantedSessions.push(opts.sessionId);
  if (wallet.grantedSessions.length > 200) {
    wallet.grantedSessions = wallet.grantedSessions.slice(-200);
  }
  await writeWallet(wallet);
  return { credits: wallet.credits, alreadyGranted: false };
}

/** Atomically consume 1 credit. Returns false if balance is 0. */
export async function consumeCredit(
  walletId: string,
): Promise<{ ok: true; credits: number } | { ok: false; credits: number }> {
  const wallet = await readWallet(walletId);
  if (wallet.credits < 1) {
    return { ok: false, credits: wallet.credits };
  }
  wallet.credits -= 1;
  await writeWallet(wallet);
  return { ok: true, credits: wallet.credits };
}

/** Refund 1 credit after a failed generation. */
export async function refundCredit(walletId: string): Promise<number> {
  const wallet = await readWallet(walletId);
  wallet.credits += 1;
  await writeWallet(wallet);
  return wallet.credits;
}

export { COOKIE_NAME };
