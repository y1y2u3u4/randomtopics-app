import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import FactTable from "@/components/FactTable";
import LandingView from "@/components/subs/LandingView";
import WritingJournal from "@/components/subs/WritingJournal";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { SUB_PRODUCTS, usd } from "@/lib/subs/products";

const PATH = "/writing-journal";
const TITLE = "Daily Writing Prompts Journal — A New Prompt Every Day";
const DESCRIPTION = "A daily writing prompts journal: get a fresh prompt every day, write it down, and keep a writing streak. 3 free entries, then " + usd(SUB_PRODUCTS.journal.monthly) + "/month. Private, syncs across devices.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["daily writing prompts journal", "daily journal prompts", "writing journal app", "journal with daily prompts", "writing streak", "online journal"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const m = usd(SUB_PRODUCTS.journal.monthly);
const y = usd(SUB_PRODUCTS.journal.yearly);

const FAQ = [
  { question: "What is a daily writing prompts journal?", answer: "It is a journal that gives you one writing prompt a day. You write your answer, save it, and the entry stays in your journal by date. A new prompt appears the next day, and a writing streak counts the days in a row you wrote." },
  { question: "Is the daily prompt free?", answer: "Yes. Today’s prompt is always free to see, with no account. You can also save your first 3 entries free. Reading and editing entries you already saved stays free after that." },
  { question: `How much does the journal cost?`, answer: `After 3 free entries, saving new days takes a plan: ${m} per month or ${y} per year, in USD. It adds unlimited saved entries, the writing streak, and exporting any month as a PDF.` },
  { question: "How do I cancel?", answer: "You can cancel any time from the billing link in your receipt email or on your account page. The plan stays active until the end of the period you paid for, and your entries stay saved and readable afterwards." },
  { question: "Are my journal entries private?", answer: "Yes. Entries are private: only you can read them. They are stored in our database, tied to your account, so they sync across devices once you add your email. We do not show them to anyone or use them for ads." },
  { question: "Do I need an account to start writing?", answer: "No. Your first save starts a private guest journal in this browser. To keep it on your phone and laptop, or if you clear your browser data, add your email. You get a sign-in link, no password." },
  { question: "How does the writing streak work?", answer: "Your streak is the number of days in a row you saved an entry, counting back from today. If you have not written yet today, the streak still shows until the day ends. You can add or edit an entry for any of the last 7 days to keep it going." },
  { question: "Can I export my journal?", answer: "With a plan you can export any month as a PDF: it opens a clean print view of that month’s entries and their prompts, which you can save as a PDF from your browser’s print dialog." },
];

export default function WritingJournalPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Daily Writing Prompts Journal"
      heading={["Daily Writing Prompts", "Journal"]}
      intro="One writing prompt a day, a private place to answer it, and a streak that keeps you coming back. Start writing now, no signup."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      inShort={`This daily writing prompts journal gives you a new prompt every day and saves your answers by date, with a writing streak and a monthly PDF export. Today’s prompt is free, and so are your first 3 saved entries. After that, a plan (${m}/month or ${y}/year) adds unlimited saved entries. Entries are private, and sync across devices once you add your email. Cancel any time.`}
      related={[
        { href: "/journal-prompts", label: "Journal prompts" },
        { href: "/writing", label: "Story writing prompts" },
      ]}
      afterTool={
        <FactTable
          heading="Free vs plan"
          columns={["", "Free", `Plan (${m}/month)`]}
          rows={[
            ["Today’s prompt", "Yes", "Yes"],
            ["Saved entries", "First 3", "Unlimited"],
            ["Read and edit saved entries", "Yes", "Yes"],
            ["Writing streak", "Yes", "Yes"],
            ["Sync across devices", "With your email", "With your email"],
            ["Export a month as PDF", "No", "Yes"],
          ]}
        />
      }
      content={
        <>
          <LandingView product="journal" />
          <SectionTitle>How the daily journal works</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Read today’s prompt</strong> — it is the same all day, and different every day of the year.</li>
            <li><strong>Write your answer</strong> — a line or a page. Your draft is kept on this device while you type.</li>
            <li><strong>Save it</strong> — your entry is stored by date and your streak goes up.</li>
            <li><strong>Add your email</strong> — optional, so your journal follows you to any device.</li>
          </ol>
        </>
      }
    >
      <WritingJournal />
    </GeneratorPageShell>
  );
}
