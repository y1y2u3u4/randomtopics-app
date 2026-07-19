import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with randomtopics.app — report a bad topic, suggest a generator, ask about embedding the widget, or make a privacy request.",
  alternates: { canonical: "/contact" },
};

const reasons = [
  {
    emoji: "🚩",
    title: "Report a topic",
    body: "If a generator served something inappropriate, unclear, or plain wrong, tell us which generator and what it showed. We review every report and remove or rewrite the entry.",
  },
  {
    emoji: "💡",
    title: "Suggest a generator or topic",
    body: "Teachers, Toastmasters clubs and party hosts send us most of our best ideas. If you keep wishing a list existed, describe it and we will look at building it.",
  },
  {
    emoji: "🔗",
    title: "Embedding and licensing",
    body: "Want the widget on your school, club or team site? Our embed code is free — see the press page for the snippet and rules.",
  },
  {
    emoji: "🔒",
    title: "Privacy questions",
    body: "Questions about cookies, advertising or your data, including GDPR and CCPA requests. We hold no accounts and no personal data, but we will answer any request.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Header */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              randomtopics.app is run by a small independent team. A person reads every
              message — we aim to reply within two business days.
            </p>
          </section>

          {/* Primary contact */}
          <section className="glass-card p-8 space-y-4 text-center">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Email
            </h2>
            <p>
              <a
                href="mailto:zhanggongqing1314007@gmail.com"
                className="text-xl font-semibold text-[var(--accent-blue)] hover:underline"
              >
                zhanggongqing1314007@gmail.com
              </a>
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              For press and media enquiries, use{" "}
              <a
                href="mailto:press@randomtopics.app"
                className="text-[var(--accent-blue)] hover:underline"
              >
                press@randomtopics.app
              </a>{" "}
              instead — details and assets are on our{" "}
              <Link href="/press" className="text-[var(--accent-blue)] hover:underline">
                press page
              </Link>
              .
            </p>
          </section>

          {/* What to write about */}
          {reasons.map((reason) => (
            <section key={reason.title} className="glass-card p-8 space-y-4">
              <h2
                className="text-2xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {reason.emoji} {reason.title}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{reason.body}</p>
            </section>
          ))}

          {/* Pointers */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Before you write
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              How we handle data and advertising is set out in our{" "}
              <Link href="/privacy" className="text-[var(--accent-blue)] hover:underline">
                Privacy Policy
              </Link>
              , and the rules for using the generators are in our{" "}
              <Link href="/terms" className="text-[var(--accent-blue)] hover:underline">
                Terms of Service
              </Link>
              . More about who builds this is on the{" "}
              <Link href="/about" className="text-[var(--accent-blue)] hover:underline">
                about page
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
