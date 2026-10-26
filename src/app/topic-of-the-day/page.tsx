import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import FactSheet from "@/components/FactSheet";
import KeepPlaying from "@/components/KeepPlaying";
import TryNext from "@/components/TryNext";
import PublicAdPlacement from "@/components/PublicAdPlacement";
import TopicOfTheDay from "@/components/TopicOfTheDay";
import { DAY, topicIndexForDay } from "@/lib/topicOfTheDay";
import { topics } from "@/data/topics";
import { SITE_URL } from "@/i18n/config";

// The pick changes at midnight; refresh the server copy hourly.
export const revalidate = 3600;

const path = "/topic-of-the-day";
const UPDATED = "2026-10-18";
const title = "Topic of the Day: A New Discussion Topic Every Day";
const description = `Today's discussion topic with talking points, the same for everyone and new at midnight. Picked from ${topics.length} conversation topics for classes, meetings and family dinners. Free.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const faqs = [
  { question: "What is the topic of the day?", answer: `One conversation topic, picked each day from ${topics.length} topics written by our editors, with two or three talking points. Everyone who opens the page on the same date sees the same topic, so a class or team can discuss it together.` },
  { question: "When does the topic change?", answer: "At midnight in your own time zone. The page also lets you step back through previous days if you missed one." },
  { question: "How is the topic of the day different from the question of the day?", answer: "The question of the day is a single question to answer quickly, often as a warm-up. The topic of the day is a broader subject with talking points, meant for a 5–15 minute discussion, debate or writing prompt." },
  { question: "How can teachers use it?", answer: "Project the page at the start of class, give students one minute to think, then two minutes in pairs using the talking points, then share with the room. It also works as a daily journal or speaking prompt." },
  { question: "Can I pick a different topic?", answer: "Yes. For a random topic at any time, use the random topic generator, which lets you filter by category, depth and use (conversation, debate, speech, writing, icebreaker)." },
];

// Server render time; the page is regenerated hourly (revalidate) and the client corrects to the local date.
const currentDay = () => Math.floor(Date.now() / DAY);

export default function TopicOfTheDayPage() {
  const today = currentDay();
  const week = Array.from({ length: 7 }, (_, i) => today - 1 - i).map(day => ({ day, topic: topics[topicIndexForDay(day, topics.length)] }));
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Topic of the Day" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Topic of the Day</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">One discussion topic for today, with talking points. The same for everyone, new at midnight.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">Picked from {topics.length} topics · 16 categories · Talking points included · Free</p>
      </header>
      <TopicOfTheDay topics={topics} initialDay={today} />
      <TryNext path={path} />
      <PublicAdPlacement path={path} placement="result" />
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What the topic of the day is</h2>
        <p className="mt-3 text-[var(--text-muted)]">The topic of the day is one conversation topic chosen for each calendar date from {topics.length} editor-written topics, shown with talking points. Everyone on the same date gets the same topic, so a classroom, team stand-up or family dinner can talk about it together. It changes at midnight your time, and you can look back at earlier days.</p>
      </section>
    </div>
    <FactSheet heading="Topic of the day facts" updated={UPDATED} rows={[
      ["Topic pool", `${topics.length} topics in 16 categories, from science to weird and fun`],
      ["Changes", "Once a day, at midnight in your time zone"],
      ["Same for everyone", "Yes, on the same calendar date"],
      ["Talking points", "Two or three per topic"],
      ["Repeats", `The cycle covers all ${topics.length} topics before any repeats`],
      ["Cost and data", "Free, no account, nothing stored"],
    ]} stepsName="A 10-minute topic of the day routine" steps={[
      "Read today's topic aloud (1 minute).",
      "Everyone thinks quietly or jots one idea (1 minute).",
      "Discuss in pairs using the talking points (3 minutes).",
      "Share the best point with the whole group (4 minutes).",
      "Close with a one-sentence takeaway (1 minute).",
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Topics from the past 7 days</h2>
        <ol className="mt-4 space-y-3">{week.map(({ day, topic }) => <li key={day} className="border-t border-white/10 pt-3">
          <p className="text-xs text-[var(--text-secondary)]">{new Date(day * DAY).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })}</p>
          <p className="font-semibold mt-1">{topic.text}</p>
        </li>)}</ol>
      </section>
      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Topic of the day FAQ</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">More daily and random prompts</h2>
        <p className="mt-3 text-[var(--text-muted)]">Answer the <Link prefetch={false} href="/question-of-the-day" className="text-[var(--neon-cyan)] underline">question of the day</Link>, get any topic with the <Link prefetch={false} href="/" className="text-[var(--neon-cyan)] underline">random topic generator</Link>, browse <Link prefetch={false} href="/categories" className="text-[var(--neon-cyan)] underline">topics by category</Link>, or go deeper with <Link prefetch={false} href="/philosophical-questions" className="text-[var(--neon-cyan)] underline">philosophical questions</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Topic of the Day", url: `${SITE_URL}${path}`, description, applicationCategory: "EducationalApplication", operatingSystem: "Any", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
