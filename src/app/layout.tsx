import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import { Providers } from "@/components/Providers";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://duetbooth.co"),
  title: {
    default:
      "Photo to Video AI Generator — Turn 2 Photos into a Video | DuetBooth",
    template: "%s | DuetBooth",
  },
  description:
    "Turn two photos into an AI video. Upload portraits, pick a trend style, download a 10-second clip — no prompt writing, pay per video from $4.90.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "DuetBooth",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          strategy="afterInteractive"
          data-key="lIhTBNOBkWhZDIvMtCDPQw"
        />
        <Providers>
          <SiteHeader />
          {children}
          <footer className="site-footer">
            <div className="shell footer-inner">
              <p>DuetBooth — AI photo-to-video generator.</p>
              <p>
                Create short videos from your photos. New styles added regularly.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
