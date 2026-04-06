import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Speech Topic Generator - Public Speaking Ideas & Practice Timer",
  description:
    "Generate random speech topics for presentations, public speaking practice, and Toastmasters. Built-in speech timer for impromptu speaking practice. Find your next great speech idea instantly.",
};

export default function SpeechPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Speech Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="speech"
          title="Speech Topic Generator"
          subtitle="Discover the perfect topic for your next presentation, speech, or public speaking practice."
        />

        {/* Speech Timer Section */}
        <section className="max-w-md mx-auto px-4 sm:px-6 py-10">
          <SpeechTimer />
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Practice Impromptu Speaking with Our Timer
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Our built-in <strong>speech practice timer</strong> helps you develop impromptu speaking skills.
                Generate a random speech topic, start the timer, and practice delivering a 1, 2, 3, or 5-minute
                speech on the spot. This is the same technique used by Toastmasters Table Topics and speech
                competitions worldwide.
              </p>
              <p>
                Regular impromptu speaking practice builds confidence, improves your ability to organize thoughts
                quickly, and makes you a more effective communicator in meetings, presentations, and everyday
                conversations. Whether you&apos;re preparing for a speech competition, a job interview, or just
                want to become a better speaker, combining random topics with timed practice is one of the most
                effective methods available.
              </p>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Practice Impromptu Speaking
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Generate a random speech topic using the generator above</li>
                <li>Set the timer to your desired duration (start with 1 minute)</li>
                <li>Take 10-15 seconds to organize your thoughts</li>
                <li>Deliver your speech until the timer runs out</li>
                <li>Gradually increase the duration as you improve</li>
              </ol>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
