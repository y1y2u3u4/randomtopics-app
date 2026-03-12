import type { Metadata } from "next";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <div className="relative z-1 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
