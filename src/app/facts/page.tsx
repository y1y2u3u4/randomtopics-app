import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import { topics } from "@/data/topics";
import { CATEGORIES, MODES } from "@/data/types";
import { QOTD_QUESTIONS, QOTD_CATEGORIES } from "@/data/questionOfTheDay";
import { CHARADES_WORDS } from "@/data/charades";
import { CLASSROOM_PRICES } from "@/lib/classroom/catalog";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const path = "/facts";
const title = "RandomTopics Facts: Price, Privacy & Topic Counts";
const description = `Key facts about RandomTopics: ${topics.length} curated topics in ${CATEGORIES.length} categories, free with no signup, editor-written (not live AI), what is paid, and how your data is handled.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path, languages: hreflangAlternates(path) },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const UPDATED = "2026-10-18";
const sections: { h: string; rows: [string, string][] }[] = [
  { h: "What RandomTopics is", rows: [
    ["Site", "RandomTopics (randomtopics.app), a free collection of random generators and question banks."],
    ["Main tool", `Random Topic Generator: ${topics.length} curated topics across ${CATEGORIES.length} categories and ${MODES.length} uses (conversation, writing, debate, speech, icebreaker), each with a depth label and talking points.`],
    ["Daily tools", `Question of the Day (${QOTD_QUESTIONS.length} questions in ${QOTD_CATEGORIES.length} categories, changes at local midnight) and Topic of the Day.`],
    ["Party games", `Charades (${CHARADES_WORDS.length} words with a timer), Would You Rather, This or That, Truth or Dare, Most Likely To, Never Have I Ever, Hot Seat and Paranoia questions.`],
    ["How results are made", "Picked at random from fixed, editor-written lists. Ordinary generators do not call an AI model, so the same list is shown to everyone and can be browsed in full on each page."],
    ["Repeats", "Generators avoid repeats within a round in your browser tab, then start a new cycle once the pool is used up."],
  ] },
  { h: "Who it is for", rows: [
    ["Teachers", "Morning-meeting questions, debate motions, writing prompts and printable lists for class."],
    ["Speakers", "Impromptu, Table Topics and persuasive speech topics with a practice timer."],
    ["Teams", "Icebreakers and a question of the day for Slack or Teams stand-ups."],
    ["Friends and families", "Party and road-trip games that work on one phone, no app download."],
    ["Writers", "Story, essay, journal and writing-topic generators."],
  ] },
  { h: "Price", rows: [
    ["Generators and question banks", "Free. No account, no signup. Selected content pages show Google ads; pages made for children or classrooms show none."],
    ["Classroom packs (optional)", `One-time purchase: ${CLASSROOM_PRICES.single.label} per pack or ${CLASSROOM_PRICES.all.label} for all packs (PPTX + PDF and an ad-free presenter mode).`],
    ["AI speech feedback (optional)", "First two attempts free. Then 5 feedback rounds for $2.99 or 20 for $6.99 one-time, or a $12/month subscription."],
  ] },
  { h: "Privacy", rows: [
    ["Generators", "Run in your browser. Saved topics, filters and rounds stay in local or session storage on your device."],
    ["Accounts", "Only used for speech practice, which starts with a guest account. Saved practice can be deleted from its history controls."],
    ["Recordings", "Sent for transcription only when you submit; the app does not keep the raw audio as a saved recording."],
    ["Ads and analytics", "Google AdSense on selected public pages and Google Analytics, with consent choices where the law requires them. Details are in the privacy policy."],
  ] },
  { h: "How it differs from other topic generators", rows: [
    ["Curated, not generated", "Every topic and question is written and checked by editors, so results are classroom-safe and consistent."],
    ["Talking points", "Topics include angles to discuss, not just a one-line prompt."],
    ["Filters", "Choose category, use (debate, speech, writing…) and depth (light, medium, deep)."],
    ["Full lists on the page", "Each tool shows its whole list for reading, copying or printing, not only one result at a time."],
  ] },
];

const faqs = [
  { question: "Is RandomTopics free?", answer: "Yes. All generators and question banks are free to use with no account or signup. Optional paid extras are classroom packs (one-time) and AI speech feedback after two free attempts." },
  { question: "Does RandomTopics use AI to make topics?", answer: `No. Ordinary generators pick at random from fixed, editor-written lists: ${topics.length} topics, ${QOTD_QUESTIONS.length} daily questions and ${CHARADES_WORDS.length} charades words, among others. Only the optional speech feedback uses AI, after you submit a recording or text.` },
  { question: "Do I need an account?", answer: "No. Accounts are only used for speech practice history. Saved topics stay in your browser." },
];

export default function FactsPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Facts" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <header className="py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>RandomTopics facts</h1>
        <p className="mt-3 text-[var(--text-secondary)]">RandomTopics is a free website of random topic generators and question banks for classrooms, teams, parties and speaking practice. It has {topics.length} editor-written topics in {CATEGORIES.length} categories, a daily question of the day, and party games like charades. Everything works in the browser with no signup; results come from curated lists, not live AI.</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">Updated <time dateTime={UPDATED}>October 18, 2026</time> · Maintained by the RandomTopics editors · <Link prefetch={false} href="/how-we-curate" className="underline">How we curate</Link> · <Link prefetch={false} href="/about" className="underline">About</Link></p>
      </header>
      {sections.map(s => <section key={s.h} className="glass-card p-5 sm:p-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold">{s.h}</h2>
        <table className="w-full mt-4 text-sm text-left"><tbody>{s.rows.map(([k, v]) => <tr key={k} className="border-t border-white/10 align-top"><th scope="row" className="py-2 pr-4 font-semibold w-1/3">{k}</th><td className="py-2 text-[var(--text-secondary)]">{v}</td></tr>)}</tbody></table>
      </section>)}
      <section className="glass-card p-5 sm:p-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold">Common questions</h2>
        {faqs.map(f => <div key={f.question} className="mt-4"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-secondary)]">{f.answer}</p></div>)}
        <p className="mt-6 text-sm text-[var(--text-muted)]">More detail: <Link prefetch={false} href="/privacy" className="underline">privacy policy</Link>, <Link prefetch={false} href="/terms" className="underline">terms</Link>, <Link prefetch={false} href="/classroom-packs" className="underline">classroom packs</Link>, <Link prefetch={false} href="/stats" className="underline">site stats</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "AboutPage", name: title, url: `${SITE_URL}${path}`, dateModified: UPDATED, about: { "@type": "Organization", name: "RandomTopics", url: SITE_URL } }) }} />
  </main><Footer /></>;
}
