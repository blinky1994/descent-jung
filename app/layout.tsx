import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});

const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--ff-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--ff-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Descent",
  description:
    "An initiation into the psychology of C.G. Jung, in five acts: persona, shadow, the dark night of the soul, anima, dreams, archetypes, the Self, and individuation.",
};

export const viewport: Viewport = {
  themeColor: "#050404",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Mark JS as available before paint so reveal states don't flash.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
