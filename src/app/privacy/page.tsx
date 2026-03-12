import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for randomtopics.app - Random Topic Generator.",
};

export default function PrivacyPage() {
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
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Last updated: March 2026
            </p>
          </section>

          {/* Introduction */}
          <section className="glass-card p-8 space-y-4">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              At <strong className="text-[var(--text-primary)]">randomtopics.app</strong>,
              your privacy matters. This policy explains what data we collect
              (spoiler: very little), how we use it, and what choices you
              have.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Information We Collect
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We do <strong className="text-[var(--text-primary)]">not</strong> collect
              any personal information. There are no user accounts, no
              registration forms, and no email collection on this website.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The only data we gather is anonymous, aggregated usage
              analytics through Google Analytics (see below). This helps us
              understand how people use the tool so we can make it better.
            </p>
          </section>

          {/* Cookies */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cookies
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We use cookies only through third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Google Analytics</strong>{" "}
                &mdash; Uses cookies to collect anonymous usage data such as
                page views, session duration, and approximate geographic
                region. No personally identifiable information is collected.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Google AdSense</strong>{" "}
                &mdash; May use cookies to serve relevant advertisements.
                These cookies do not identify you personally.
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              You can disable cookies in your browser settings at any time.
            </p>
          </section>

          {/* Local Storage */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Local Storage
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We use your browser&apos;s local storage to save your favorite
              topics and topic history. This data stays entirely on your
              device &mdash; it is never sent to our servers or shared with
              anyone. You can clear it at any time through your browser
              settings.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Third-Party Services
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Google Analytics</strong>{" "}
                &mdash; For anonymous website usage analytics.{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-blue)] hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Google AdSense</strong>{" "}
                &mdash; For displaying advertisements.{" "}
                <a
                  href="https://policies.google.com/technologies/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-blue)] hover:underline"
                >
                  Google Ads Policy
                </a>
              </li>
            </ul>
          </section>

          {/* No Personal Data */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No Personal Data Collection
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              To be clear: we do not collect, store, or process any personal
              data. There are no user accounts, no login systems, no email
              lists, and no contact forms that collect personal information.
              We have no database of user data.
            </p>
          </section>

          {/* Changes */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Changes to This Policy
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We may update this privacy policy from time to time. Any
              changes will be posted on this page with an updated &quot;Last
              updated&quot; date.
            </p>
          </section>

          {/* Contact */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              If you have any questions about this privacy policy, please
              reach out to us through our website at{" "}
              <a
                href="https://randomtopics.app"
                className="text-[var(--accent-blue)] hover:underline"
              >
                randomtopics.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
