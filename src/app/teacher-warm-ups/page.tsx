import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import FactTable from "@/components/FactTable";
import LandingView from "@/components/subs/LandingView";
import TeacherWarmups from "@/components/subs/TeacherWarmups";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { SUB_PRODUCTS, usd } from "@/lib/subs/products";

const PATH = "/teacher-warm-ups";
const TITLE = "Daily Warm-Ups for Students — Bell Ringer Questions by Grade";
const m = usd(SUB_PRODUCTS.teacher.monthly);
const y = usd(SUB_PRODUCTS.teacher.yearly);
const DESCRIPTION = `A new classroom warm-up every school day for K–5, 6–8 or 9–12: question of the day, debate, would you rather and ethics prompts. Present fullscreen free; week planner and Google Classroom copy for ${m}/month.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["daily warm ups for students", "bell ringer questions", "bell ringers for middle school", "warm up questions for high school", "question of the day for students", "classroom warm ups"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  { question: "What is a daily warm-up for students?", answer: "A short question or task students answer in the first 3–5 minutes of class, often called a bell ringer or do-now. Here you get one for every school day, matched to your grade band, ready to put on the projector." },
  { question: "Is today's warm-up free?", answer: "Yes. Today's warm-up for any grade band is free, with no account, and so are fullscreen presenting and copying it for Google Classroom. Free generators on the rest of the site stay unlimited." },
  { question: "Do warm-ups repeat during the school year?", answer: "No. Each grade band follows its own order through the school year (August to July), so a class sees each prompt once per year. Monday is question of the day, Tuesday debate, Wednesday would you rather, Thursday ethics and Friday a fun prompt." },
  { question: "How much does the Teacher plan cost?", answer: `${m} per month or ${y} per year, in USD. It adds the week planner (any week or date), one-click copy of a whole week for Google Classroom, printing, and no ads on randomtopics.app. The week planner is free to try for 3 days.` },
  { question: "How do I cancel?", answer: "Cancel any time from the billing link in your receipt email. The plan stays active until the end of the period you paid for, and today's warm-up stays free afterwards." },
  { question: "How do I use it with Google Classroom?", answer: "Click Copy for Google Classroom, then paste into a new Question or Announcement. The text includes the date, the prompt and a one-line task, so it reads cleanly without editing." },
  { question: "Which grades is it for?", answer: "Three grade bands: K–5, 6–8 and 9–12. Prompts come from the site's question of the day, debate topics, would you rather and ethical dilemma collections, filtered so younger grades get simpler, kid-friendly prompts." },
];

export default function TeacherWarmupsPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Daily Warm-Ups for Students"
      heading={["Daily Warm-Ups", "for Students"]}
      intro="A bell ringer for every school day, by grade band. Put it on the projector in one click."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      inShort={`Teacher Warm-ups gives you a new classroom warm-up every school day for K–5, 6–8 or 9–12, drawn from question of the day, debate, would you rather and ethics prompts, with no repeats in a school year. Today's warm-up, fullscreen presenting and Google Classroom copy are free. The Teacher plan (${m}/month or ${y}/year) adds a week planner, week copy and print, and removes ads.`}
      related={[
        { href: "/topics/ethical-dilemma-questions", label: "Ethical dilemma questions" },
        { href: "/impromptu-speech-topics", label: "Impromptu speech topics" },
        { href: "/random-subject-generator", label: "Random subject generator" },
      ]}
      afterTool={
        <FactTable
          heading="Free vs Teacher plan"
          columns={["", "Free", `Teacher plan (${m}/month)`]}
          rows={[
            ["Today's warm-up, any grade band", "Yes", "Yes"],
            ["Fullscreen for the projector", "Yes", "Yes"],
            ["Copy today for Google Classroom", "Yes", "Yes"],
            ["Plan any week or date", "3-day trial", "Yes"],
            ["Copy or print a whole week", "3-day trial", "Yes"],
            ["Ads on randomtopics.app", "Yes", "No"],
          ]}
        />
      }
      content={
        <>
          <LandingView product="teacher" />
          <SectionTitle>The weekly rhythm</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Monday</strong> — question of the day</li>
            <li><strong>Tuesday</strong> — debate: pick a side and give one reason</li>
            <li><strong>Wednesday</strong> — would you rather</li>
            <li><strong>Thursday</strong> — ethics: what is the right thing to do?</li>
            <li><strong>Friday</strong> — a fun prompt to end the week</li>
          </ul>
        </>
      }
    >
      <TeacherWarmups />
    </GeneratorPageShell>
  );
}
