import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
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
  title: {
    default: "DuetBooth — AI Video Generator",
    template: "%s | DuetBooth",
  },
  description:
    "Turn photos into short AI videos. Upload portraits, pick a style, and download a ready-to-share clip in minutes.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
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
