import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Random Topic Generator - Instant Conversation, Writing & Debate Topics",
    template: "%s | Random Topic Generator",
  },
  description:
    "Generate random topics for conversations, writing prompts, debates, speeches, and icebreakers. 500+ curated topics across 15+ categories. Free, instant, no signup required.",
  keywords: [
    "random topic generator",
    "conversation starters",
    "writing prompts",
    "debate topics",
    "icebreaker questions",
    "random discussion topics",
    "speech topics",
  ],
  openGraph: {
    title: "Random Topic Generator - Never Run Out of Things to Talk About",
    description:
      "Generate random topics for conversations, writing, debates, speeches & icebreakers. 500+ topics, 15+ categories. Free & instant.",
    url: "https://randomtopics.app",
    siteName: "Random Topics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Topic Generator",
    description:
      "Generate random topics for conversations, writing, debates & more. Free & instant.",
  },
  metadataBase: new URL("https://randomtopics.app"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <Script
          src="https://analytics.flashcardmaker.me/script.js"
          data-website-id="15509cd4-881c-4ed8-8dd6-bb64822993ee"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Random Topics",
              url: "https://randomtopics.app",
              logo: "https://randomtopics.app/icon.svg",
              sameAs: [],
            }),
          }}
        />
        {/* Animated gradient orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="orb orb-pink" />
          <div className="orb orb-blue" />
          <div className="orb orb-purple" />
        </div>
        <div className="relative z-[1] flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
