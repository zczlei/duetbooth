import Link from "next/link";
import { AuthControls } from "@/components/AuthControls";
import { CreditsBadge } from "@/components/CreditsBadge";
import { EFFECTS } from "@/lib/effects";

function navLabel(keyword: string, title: string) {
  if (title.toLowerCase().includes("hotel lobby")) return "Hotel Lobby";
  if (title.toLowerCase().includes("burning bridges")) return "Burning Bridges";
  if (title.toLowerCase().includes("bulin")) return "Bulin 47";
  if (title.toLowerCase().includes("rain dance")) return "Rain Dance";
  if (title.toLowerCase().includes("zombie")) return "Zombie";
  return keyword
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

/** Sync server component — no auth() here (avoids cacheComponents prerender block). */
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          DuetBooth
        </Link>
        <nav className="nav">
          <Link href="/">Generator</Link>
          {EFFECTS.map((effect) => (
            <Link key={effect.slug} href={`/effects/${effect.slug}`}>
              {navLabel(effect.keyword, effect.title)}
            </Link>
          ))}
          <Link href="/#pricing">Pricing</Link>
          <CreditsBadge />
        </nav>
        <div className="header-auth">
          <span className="header-credits-mobile">
            <CreditsBadge />
          </span>
          <AuthControls />
        </div>
      </div>
    </header>
  );
}
