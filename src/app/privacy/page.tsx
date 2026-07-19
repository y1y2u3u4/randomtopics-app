import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for randomtopics.app - Random Topic Generator.",
  alternates: { canonical: "/privacy" },
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
              Last updated: July 2026
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

          {/* Advertising */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Advertising
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              randomtopics.app is free to use, and advertising is what pays for it.
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on
                your prior visits to this website or other websites.
              </li>
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to
                serve ads to you based on your visit to this site and/or other sites on
                the Internet.
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              You can opt out of personalized advertising in{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                Google Ads Settings
              </a>
              , or opt out of third-party vendors&apos; use of cookies for personalized
              advertising at{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                aboutads.info
              </a>
              .
            </p>
          </section>

          {/* GDPR & CCPA */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Rights (GDPR &amp; CCPA)
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">
                If you are in the EEA or UK (GDPR):
              </strong>{" "}
              analytics and personalized advertising are processed on the basis of your
              consent, which you may withdraw at any time through your browser or the
              advertising controls above. You have the right to access, correct, delete
              or restrict processing of personal data relating to you, and to complain to
              your local supervisory authority. Because we operate no accounts and store
              no personal records, in most cases we simply hold nothing to return.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              <strong className="text-[var(--text-primary)]">
                If you are a California resident (CCPA/CPRA):
              </strong>{" "}
              we do not sell your personal information for money. Serving personalized
              advertising may be treated as &quot;sharing&quot; under California law; the
              opt-out links above stop it. We will not treat you differently for
              exercising these rights.
            </p>
          </section>

          {/* Children */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Children&apos;s Privacy
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Our topics and party questions are written to be classroom- and
              family-friendly, and teachers use them with students. The site is intended
              for a general audience and is not directed at children under 13, and we do
              not knowingly collect personal information from anyone — there are no
              accounts, forms or sign-ups anywhere on the site. If you believe a child
              has somehow provided personal information to us, contact us and we will
              delete it.
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
              Questions about this policy, or a request relating to your data, can be
              sent to{" "}
              <a
                href="mailto:zhanggongqing1314007@gmail.com"
                className="text-[var(--accent-blue)] hover:underline"
              >
                zhanggongqing1314007@gmail.com
              </a>
              . You can also reach us through our{" "}
              <Link href="/contact" className="text-[var(--accent-blue)] hover:underline">
                contact page
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
