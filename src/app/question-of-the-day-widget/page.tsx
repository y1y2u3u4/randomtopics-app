import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WidgetBuilder from "@/components/generators/WidgetBuilder";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/question-of-the-day-widget";
const TITLE = "Free Question of the Day Widget & Spin Wheel Embed";
const DESCRIPTION =
  "Free question of the day widget and spin-the-wheel embed for teachers. Copy one iframe code into Google Sites, Canvas, Notion or a class blog — a new question every day, no signup.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "question of the day widget", "question of the day embed", "qotd widget", "spin the wheel embed", "random topic widget",
    "google sites question of the day", "notion question of the day", "canvas question of the day", "classroom widget",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "Is the question of the day widget free?",
    answer: "Yes. Both widgets are free with no account, no API key and no limit on views. The only thing we ask is that you keep the small “Powered by Random Topics” link inside the widget.",
  },
  {
    question: "Does the question change every day by itself?",
    answer: "Yes. The widget picks today’s question from the viewer’s local date, so it changes at midnight with no updates from you. Everyone who opens your page on the same day sees the same question, and an “Another question” button gives a bonus one.",
  },
  {
    question: "How do I add it to Google Sites?",
    answer: "In the Google Sites editor choose Insert → Embed, open the “Embed code” tab, paste the code from this page and press Next → Insert. Drag the box to about 260 pixels tall for the question widget or 420 for the wheel.",
  },
  {
    question: "Can I embed it in Notion?",
    answer: "Yes. Press “Copy link (Notion)”, type /embed on a Notion page, paste the link and press Embed link. Notion shows the live widget; resize it from the corner handle.",
  },
  {
    question: "Does it work in Canvas, Schoology or Google Classroom?",
    answer: "Canvas and Schoology accept the iframe: open a Page in the Rich Content Editor, switch to the HTML editor (the </> icon) and paste the code. Google Classroom does not allow embeds, so post the link to the question of the day page there instead.",
  },
  {
    question: "Are the questions safe for students?",
    answer: "Yes. Pick the Kids or Classroom audience for school-friendly questions. The wheel uses eight neutral categories — science, technology, history, food and travel, entertainment, sports, nature and weird facts — and never politics. The widgets show no ads.",
  },
];

export default function QotdWidgetPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="Question of the Day Widget"
      heading={["Question of the Day", "Widget & Wheel Embed"]}
      intro="Put a daily question or a topic wheel on your class site. Pick a widget, copy the code, paste it into Google Sites, Canvas or Notion. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-07"
      faq={FAQ}
      related={[
        { href: "/question-of-the-day", label: "Question of the Day" },
        { href: "/spin-the-wheel", label: "Spin the Wheel" },
        { href: "/teacher-warm-ups", label: "Teacher warm-ups" },
        { href: "/classroom", label: "Classroom topics" },
      ]}
      inShort={
        <>
          A free <strong>question of the day widget</strong> and <strong>spin-the-wheel embed</strong> for teachers and community sites. The question widget shows
          one new question every day (for everyone, kids, classroom, work, deep or funny), and the wheel spins to a random discussion topic. Each is a single
          iframe you paste into Google Sites, Canvas, Schoology, WordPress or any HTML page, or a link you paste into Notion. No account, no ads inside the widget,
          no limits.
        </>
      }
      content={
        <>
          <SectionTitle>How to embed it, step by step</SectionTitle>
          <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">Google Sites</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Choose the widget, audience and theme above, then press <strong>Copy embed code</strong>.</li>
            <li>In Google Sites click <strong>Insert → Embed → Embed code</strong> and paste.</li>
            <li>Press <strong>Next → Insert</strong>, then drag the box to 260 px (question) or 420 px (wheel) tall.</li>
          </ol>
          <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">Notion</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Press <strong>Copy link (Notion)</strong>.</li>
            <li>On your Notion page type <code>/embed</code>, paste the link and press <strong>Embed link</strong>.</li>
          </ol>
          <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">Canvas, Schoology, WordPress</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Open a page in the editor and switch to the HTML view (<code>&lt;/&gt;</code> in Canvas, “Custom HTML” block in WordPress).</li>
            <li>Paste the embed code and save.</li>
          </ol>
          <p>
            Google Classroom and Google Slides do not allow embeds — post a link to the{" "}
            <Link prefetch={false} href="/question-of-the-day" className={linkClass}>question of the day</Link> or{" "}
            <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel</Link> page instead, or put the page on the projector.
          </p>

          <SectionTitle>Ways teachers use it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Bell ringer:</strong> the question widget on the class homepage gives students something to answer as they sit down.</li>
            <li><strong>Morning meeting:</strong> pick the Kids audience and go around the circle; pair it with{" "}
              <Link prefetch={false} href="/morning-meeting-questions" className={linkClass}>morning meeting questions</Link>.</li>
            <li><strong>Discussion or speaking practice:</strong> set the wheel to Debate or Speech and let a student spin; more in{" "}
              <Link prefetch={false} href="/teacher-warm-ups" className={linkClass}>teacher warm-ups</Link>.</li>
            <li><strong>Team pages and newsletters:</strong> the Work audience gives a light daily icebreaker for a staff portal or intranet.</li>
          </ul>

          <SectionTitle>What the widgets do and don&apos;t do</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Same question for everyone on the same day; it rolls over at the viewer&apos;s midnight.</li>
            <li>No ads and no sign-in inside the widget.</li>
            <li>You can&apos;t add your own questions yet — for your own list, use the{" "}
              <Link prefetch={false} href="/picker-wheel" className={linkClass}>picker wheel</Link> and share its link.</li>
          </ul>
        </>
      }
    >
      <WidgetBuilder />
    </GeneratorPageShell>
  );
}
