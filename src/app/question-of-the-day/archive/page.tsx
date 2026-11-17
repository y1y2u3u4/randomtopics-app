import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QOTD_QUESTIONS, qotdIndexForDate } from "@/data/questionOfTheDay";

export const revalidate = 3600;
export const metadata: Metadata = {
  title: { absolute: "Question of the Day Archive – 30 Daily QOTDs" },
  description: "Browse 30 daily questions with dates. Revisit a free QOTD for your classroom, team, family or journal, and open today's question for more ideas.",
  alternates: { canonical: "/question-of-the-day/archive" },
};

export default function QotdArchivePage() {
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, offset) => {
    const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset));
    const calendarDate = new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
    return { date: utc.toISOString().slice(0, 10), question: QOTD_QUESTIONS[qotdIndexForDate(calendarDate)].q };
  });
  return <>
    <Navbar />
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Question of the Day Archive</h1>
      <p className="mb-4">Browse the last 30 daily questions, free. Dates use UTC and the default all-categories rotation; your local date and chosen category may show a different question.</p>
      <Link prefetch={false} href="/question-of-the-day" className="text-[var(--neon-cyan)] hover:underline">Open today&apos;s QOTD and all 120 ideas</Link>
      <ol className="mt-6 space-y-4">{days.map(({ date, question }) => <li key={date} id={date} className="glass-card p-4">
        <h2 className="font-bold"><time dateTime={date}>{date}</time></h2>
        <p>{question}</p>
        <Link prefetch={false} href={`#${date}`} className="text-sm text-[var(--neon-cyan)] hover:underline">Link to this date</Link>
      </li>)}</ol>
    </main>
    <Footer />
  </>;
}
