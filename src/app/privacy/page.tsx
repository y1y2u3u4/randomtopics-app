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
              Last updated: September 19, 2026
            </p>
          </section>

          {/* Introduction */}
          <section className="glass-card p-8 space-y-4">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              At <strong className="text-[var(--text-primary)]">randomtopics.app</strong>,
              your privacy matters. This policy explains what data we collect
              when you use our tools, how we use it, and what choices you
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
              Topic generation does not require an account. If you choose speech
              coaching, we create a guest account to keep your attempts private and
              track your allowance. You may add an email to recover your history.
              Submitted topics, transcripts, feedback, attempt duration and service
              usage are stored with that account. Subscription records, when
              subscriptions are available, include payment-provider identifiers and status.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We collect website usage analytics through Google Analytics. Speech
              interaction events describe actions such as starting practice; we do
              not include your recording, transcript or email in those events.
              A keyed network-address hash helps limit abuse and excessive AI usage.
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
              Third-party services may use cookies:
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
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Speech coaching also stores a sign-in session in your browser. This
              session accesses private records on our servers. Clearing it can make
              guest practice unrecoverable unless you have verified an email first.
              Recordings stay in browser memory until you choose to submit them.
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
              Speech Recordings and Your Choices
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Microphone access starts only after you choose to record. Submitting
              sends your audio through our server to OpenRouter and its selected
              model provider for transcription. Feedback uses your topic and reviewed
              transcript; comparison also uses the earlier attempt. Our application
              does not persist the raw audio. Provider processing is subject to their
              policies; we do not promise zero provider retention. Avoid including
              sensitive or third-party personal information in recordings.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Supabase provides authentication and private record storage; Vercel
              hosts the application. Stripe processes payments when enabled, and
              we do not receive your full card details. Your practice content is
              retained until you delete it from your history or request deletion.
              Deleting practice removes its topic, transcript and feedback from the
              active database; minimal attempt and usage records remain to enforce
              allowances. Service backups may retain earlier copies temporarily.
              Contact us below for account deletion or other data requests.
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
              Our topic tools are free. Advertising and optional paid features support the service.
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
              your local supervisory authority. For speech practice records or account
              requests, use the history controls or contact us below.
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
              not knowingly collect personal information from children under 13.
              Children under 13 should not use recording, account or payment features.
              If you believe a child has provided personal information to us, contact us and we will
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
