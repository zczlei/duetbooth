"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthControls() {
  const { data: session, status } = useSession();
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/wallet", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled) setGoogleReady(Boolean(data.googleReady));
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!googleReady || status === "loading") {
    return null;
  }

  const user = session?.user;
  if (user) {
    return (
      <div className="auth-controls">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="auth-avatar"
            referrerPolicy="no-referrer"
          />
        ) : null}
        <span className="auth-name" title={user.email || user.name || ""}>
          {user.name?.split(" ")[0] || user.email || "Account"}
        </span>
        <button
          type="button"
          className="ghost-btn auth-btn"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="ghost-btn auth-btn auth-google"
      onClick={() => signIn("google", { callbackUrl: "/" })}
    >
      Sign in with Google
    </button>
  );
}
