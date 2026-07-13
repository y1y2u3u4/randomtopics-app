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
    default: "Random Topic Generator | 500+ Free Topics for Any Occasion",
    template: "%s | Random Topic Generator",
  },
  description:
    "Free random topic generator with 500+ curated topics. Get instant conversation starters, writing prompts, debate topics & icebreakers across 16 categories. No signup needed — just click and go!",
  keywords: [
    "random topic generator",
    "topic generator",
    "random topics",
    "conversation starters",
    "writing prompts",
    "debate topics",
    "icebreaker questions",
    "funny topic generator",
    "random discussion topics",
    "speech topics",
  ],
  openGraph: {
    title: "Random Topic Generator | 500+ Free Topics for Any Occasion",
    description:
      "Free random topic generator with 500+ curated topics. Instant conversation starters, writing prompts, debate topics & icebreakers. No signup needed!",
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
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C23RTYX4QS"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C23RTYX4QS');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1513206179290827"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Structured data — Organization + WebSite + WebApplication.
            Bing reads these for rich results and entity understanding. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://randomtopics.app/#organization",
                  name: "Random Topics",
                  url: "https://randomtopics.app",
                  logo: "https://randomtopics.app/icon-512.png",
                  sameAs: [],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://randomtopics.app/#website",
                  name: "Random Topics",
                  alternateName: "Random Topic Generator",
                  url: "https://randomtopics.app",
                  publisher: { "@id": "https://randomtopics.app/#organization" },
                  inLanguage: "en",
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://randomtopics.app/#webapp",
                  name: "Random Topic Generator",
                  url: "https://randomtopics.app",
                  applicationCategory: "EducationApplication",
                  operatingSystem: "Any (web-based)",
                  browserRequirements: "Requires JavaScript. Runs in any modern browser.",
                  description:
                    "Free random topic generator with 500+ curated topics across 16 categories. Generate conversation starters, writing prompts, debate topics, speech ideas and icebreaker questions instantly.",
                  featureList: [
                    "500+ curated random topics",
                    "16 categories",
                    "5 modes: conversation, writing, debate, speech, icebreaker",
                    "Built-in speech practice timer",
                    "AI-powered topic generation",
                    "No signup required",
                  ],
                  isAccessibleForFree: true,
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  publisher: { "@id": "https://randomtopics.app/#organization" },
                },
              ],
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
