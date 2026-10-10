import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {
  mergeGuestWalletIntoUser,
  touchRegisteredUser,
  userWalletId,
} from "@/lib/wallet";

const googleConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID?.trim() && process.env.AUTH_GOOGLE_SECRET?.trim(),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: googleConfigured
    ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
    : [],
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        const sub =
          (profile as { sub?: string } | undefined)?.sub ||
          (token.sub as string | undefined);
        if (sub) token.userId = sub;
      }
      if (!token.userId && token.sub) {
        token.userId = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId || token.sub || "");
      }
      return session;
    },
  },
  events: {
    async signIn({ account, profile, user }) {
      if (account?.provider !== "google") return;
      const sub =
        (profile as { sub?: string } | undefined)?.sub ||
        (user as { id?: string } | undefined)?.id;
      if (!sub) return;
      try {
        await mergeGuestWalletIntoUser(userWalletId(sub));
        await touchRegisteredUser({
          userId: sub,
          email:
            user.email ||
            (profile as { email?: string } | undefined)?.email ||
            null,
          name:
            user.name ||
            (profile as { name?: string } | undefined)?.name ||
            null,
        });
      } catch {
        // Best-effort merge / profile; login should still succeed.
      }
    },
  },
});

export function isGoogleAuthConfigured() {
  return Boolean(
    process.env.AUTH_GOOGLE_ID?.trim() &&
      process.env.AUTH_GOOGLE_SECRET?.trim() &&
      process.env.AUTH_SECRET?.trim(),
  );
}
