import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import type { Metadata } from "next";
import CopyBlock from "./CopyBlock";

export const metadata: Metadata = {
  title: "Press & Media Kit - Random Topics",
  description:
    "Press kit, embed widget, and media resources for Random Topics — the free AI-powered topic generator.",
  robots: { index: true, follow: true },
};

const SITE_URL = "https://randomtopics.app";

const ABOUT_DESCRIPTION = `Random Topics is a free AI-powered topic generator that delivers instant conversation starters, writing prompts, debate motions, speech ideas, and icebreaker questions from a curated library of 500+ topics across 16 categories. No signup, no ads, no paywall — just one click and you have a fresh topic ready to use.`;

const EMBED_CODE = `<iframe
  src="${SITE_URL}/embed"
  width="400"
  height="500"
  style="border:none;border-radius:12px"
  title="Random Topics Generator"
></iframe>`;

const BADGE_CODE = `<a href="${SITE_URL}" target="_blank" rel="noopener noreferrer"
  style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
         background:#0d0f17;border:1px solid rgba(255,255,255,0.08);
         border-radius:8px;font-family:sans-serif;font-size:13px;
         color:#c4cbde;text-decoration:none;"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06d6a0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
  Powered by Random Topics
</a>`;

const QUICK_FACTS = [
  { label: "Tool", value: "Random Topics" },
  { label: "URL", value: "randomtopics.app", href: SITE_URL },
  { label: "Launched", value: "April 2026" },
  { label: "Price", value: "Free" },
  { label: "Categories", value: "16" },
  { label: "Topics", value: "500+" },
  { label: "Modes", value: "5" },
  { label: "Articles", value: "22 collections" },
];

const KEY_FEATURES = [
  "500+ hand-curated topics across 16 diverse categories",
  "5 specialized modes: Conversation, Writing, Debate, Speech, and Icebreaker",
  "AI-powered topic generation via Gemini 2.5 Flash for unlimited fresh ideas",
  "Built-in speech timer with customizable duration",
  "Embeddable widget for blogs and websites",
  "22 curated collection articles for deep-dive browsing",
  "Completely free — no signup, no ads, no paywall",
  "Mobile-friendly, fast, and accessible",
  "Social sharing built in (Twitter, Facebook, LinkedIn, WhatsApp)",
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Press & Media" },
          ]}
        />

        {/* Hero */}
        <div className="text-center pt-12 sm:pt-20 pb-8 max-w-4xl mx-auto px-4">
          <h1
            className="section-heading text-4xl sm:text-5xl font-extrabold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Press &amp; <span className="gradient-text">Media Kit</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-lg mx-auto">
            Everything you need to write about Random Topics. Grab descriptions,
            stats, embed codes, and badges below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 pb-16">
          {/* Quick Facts */}
          <section className="glass-card p-8">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quick Facts
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {QUICK_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-center"
                >
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                    {fact.label}
                  </p>
                  {fact.href ? (
                    <a
                      href={fact.href}
                      className="text-lg font-bold text-[var(--neon-cyan)] hover:underline"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {fact.value}
                    </a>
                  ) : (
                    <p
                      className="text-lg font-bold text-[var(--text-primary)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {fact.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* About — Copyable Description */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What is Random Topics?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {ABOUT_DESCRIPTION}
            </p>
            <CopyBlock code={ABOUT_DESCRIPTION} label="Copy description" />
          </section>

          {/* Key Features */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Key Features
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              {KEY_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--neon-pink)" }}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Embed Widget */}
          <section className="glass-card p-8 space-y-6">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Embed Widget
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Add a random topic generator directly to your website or blog.
              Just paste the iframe code below.
            </p>
            <div className="flex justify-center">
              <div
                className="rounded-xl overflow-hidden border border-white/10"
                style={{ width: 400, height: 500 }}
              >
                <iframe
                  src="/embed"
                  width="400"
                  height="500"
                  style={{ border: "none" }}
                  title="Random Topics Generator Preview"
                />
              </div>
            </div>
            <CopyBlock code={EMBED_CODE} label="Embed code" />
          </section>

          {/* Badge / Button */}
          <section className="glass-card p-8 space-y-6">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              &ldquo;Powered by&rdquo; Badge
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Show your readers where the topics come from. Drop this badge
              anywhere on your page and it links back to Random Topics.
            </p>
            <div className="flex justify-center py-4">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: "#0d0f17",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  fontFamily: "sans-serif",
                  fontSize: 13,
                  color: "#c4cbde",
                  textDecoration: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06d6a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
                Powered by Random Topics
              </a>
            </div>
            <CopyBlock code={BADGE_CODE} label="Badge HTML" />
          </section>

          {/* Contact */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Press Inquiries
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Writing about Random Topics or want to collaborate? We&apos;d love
              to hear from you.
            </p>
            <p className="text-[var(--text-secondary)]">
              Email us at{" "}
              <a
                href="mailto:press@randomtopics.app"
                className="text-[var(--neon-cyan)] hover:underline"
              >
                press@randomtopics.app
              </a>
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              We typically respond within 24 hours. Feel free to use any
              information on this page without prior approval &mdash; a link
              back to{" "}
              <a
                href={SITE_URL}
                className="text-[var(--neon-cyan)] hover:underline"
              >
                randomtopics.app
              </a>{" "}
              is always appreciated.
            </p>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 pb-4">
            <p className="text-[var(--text-secondary)]">
              Want to try it yourself?
            </p>
            <a href="/" className="btn-generate inline-block">
              Generate a Topic
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
