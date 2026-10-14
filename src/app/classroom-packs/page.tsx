import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import ClassroomBuyButtons from "@/components/ClassroomBuyButtons";
import ClassroomLandingView from "@/components/ClassroomLandingView";
import { CLASSROOM_PACKS, CLASSROOM_PRICES, classroomPreviews } from "@/lib/classroom/catalog";
import { classroomSlides } from "@/lib/classroom/content";

export const metadata: Metadata = {
  title: { absolute: "Classroom Packs for Teachers — Question of the Day, Debate & Speech Topics" },
  description:
    "Ready-to-teach slide decks for teachers: 180 days of Question of the Day, 60 classroom debate topics with pro and con prompts, and 102 impromptu speech topics. Editable PPTX, printable PDF, ad-free presenter.",
  alternates: { canonical: "/classroom-packs" },
  openGraph: {
    title: "Classroom Packs for Teachers — RandomTopics",
    description: "Question of the Day for the whole school year, classroom debate topics and impromptu speech topics as editable slides and printable PDFs.",
    url: "/classroom-packs",
    images: [{ url: "/classroom/previews/question-of-the-day-slide-a.png", width: 1200, height: 675 }],
  },
};

const FAQ_ITEMS = [
  {
    question: "Is this a subscription?",
    answer: `No. Each pack is a one-time payment of ${CLASSROOM_PRICES.single.label}, or ${CLASSROOM_PRICES.all.label} for every classroom pack. Nothing renews.`,
  },
  {
    question: "Can I use the slides in Google Slides?",
    answer: "Yes. Download the PPTX, open Google Slides, choose File → Import slides, upload the file and import all slides. It also opens in PowerPoint and Keynote, and every slide stays editable.",
  },
  {
    question: "What grades are the packs for?",
    answer: "The Question of the Day pack rotates weekly between questions for all grades, grades 6+ and grades 9+. The debate pack has starter motions for grades 6–8, core motions for grades 9–12 and advanced motions for grades 11–12 and debate clubs. The speech pack suits ages 10 and up.",
  },
  {
    question: "Are the questions appropriate for students?",
    answer: "Yes. Every question was written or reviewed for school use, and topics that do not suit a mixed-age classroom were left out. You know your class best: every slide can be edited or skipped.",
  },
  {
    question: "What is the ad-free presenter mode?",
    answer: "A full-screen view at randomtopics.app/classroom/present with large text, arrow-key navigation and an optional timer. Buying any pack also removes ads on RandomTopics for the browser or account you bought with.",
  },
  {
    question: "What does “all classroom packs” include?",
    answer: "All three current packs plus every classroom pack we add later, at no extra cost.",
  },
  {
    question: "How do I download the files on another computer?",
    answer: "Your downloads are on the account page. After paying, we email a sign-in link to the address you gave at checkout; open it on any device to get your files again.",
  },
  {
    question: "Can I share the files?",
    answer: "Share them with your own students and classes: project, print and hand out as much as you like. Please do not resell or publicly re-upload them.",
  },
  {
    question: "Are the generators still free?",
    answer: "Yes. The Question of the Day, debate topic and impromptu speech generators stay free. The packs are for teachers who want a ready-made, ordered set for the whole year.",
  },
];

export default function ClassroomPacksPage() {
  const samples = Object.fromEntries(CLASSROOM_PACKS.map((p) => [p.id, classroomSlides(p.id).slice(0, 3)]));
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <ClassroomLandingView />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Classroom Packs" }]} />
        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)] mb-3">For teachers · one-time purchase</p>
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-5">Classroom Packs for Teachers</h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Question of the Day for the whole school year, classroom debate topics with both sides, and impromptu speech topics with timing rules.
            Editable slides, printable PDFs and an ad-free presenter, ready for tomorrow&apos;s lesson.
          </p>
        </header>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/30 space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">All classroom packs · {CLASSROOM_PRICES.all.label}</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              All three packs ({CLASSROOM_PACKS.reduce((n, p) => n + p.count, 0)} slides) and every pack we add later. One payment, no subscription.
            </p>
            <ClassroomBuyButtons page="/classroom-packs" />
          </div>
        </section>

        {CLASSROOM_PACKS.map((pack) => (
          <section key={pack.id} id={pack.id} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-20">
            <div className="glass-card p-6 sm:p-8 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">{pack.countLabel} · {CLASSROOM_PRICES.single.label}</p>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{pack.title}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">{pack.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {classroomPreviews(pack.id).slice(0, 2).map((p) => (
                  <Image key={p.src} src={p.src} alt={`${pack.short}: ${p.alt}`} width={1200} height={675} sizes="(max-width: 640px) 50vw, 360px"
                    className="w-full h-auto rounded-lg border border-white/10" />
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-[180px_1fr] items-start">
                <Image src={classroomPreviews(pack.id)[2].src} alt={`${pack.short}: printable PDF page`} width={900} height={1165} sizes="180px"
                  className="w-full h-auto rounded-lg border border-white/10" />
                <div className="space-y-3">
                  <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                    {pack.includes.map((t) => <li key={t}>✓ {t}</li>)}
                    <li>✓ Editable PPTX · opens in Google Slides, PowerPoint and Keynote</li>
                    <li>✓ Ad-free full-screen presenter with timer</li>
                  </ul>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">First questions in the pack</h3>
                    <ol className="mt-1 list-decimal pl-5 text-sm text-[var(--text-secondary)] space-y-1">
                      {samples[pack.id].map((s) => <li key={s.text}>{s.text}</li>)}
                    </ol>
                  </div>
                </div>
              </div>
              <ClassroomBuyButtons pack={pack.id} page="/classroom-packs" />
              <p className="text-sm">
                <Link href={`/classroom/present?pack=${pack.id}`} rel="nofollow" className="text-[var(--neon-cyan)] underline-offset-4 hover:underline">Try 5 free slides in presenter mode</Link>
                <span className="text-[var(--text-muted)]"> · </span>
                <Link href={pack.page} className="text-[var(--neon-cyan)] underline-offset-4 hover:underline">Free generator</Link>
              </p>
            </div>
          </section>
        ))}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">How it works</h2>
            <ol className="grid gap-4 sm:grid-cols-3 text-sm text-[var(--text-secondary)]">
              {[
                ["1", "Buy once", "Secure checkout with Stripe. No account or subscription needed."],
                ["2", "Download", "PPTX and PDF are on your account page straight away, and we email you a sign-in link."],
                ["3", "Teach", "Project the slides, import them into Google Slides, print the cards, or use the ad-free presenter."],
              ].map(([n, title, body]) => (
                <li key={n} className="rounded-xl border border-white/10 p-4">
                  <span className="text-[var(--neon-pink)] font-bold">{n}</span>
                  <h3 className="font-semibold text-[var(--text-primary)] mt-1">{title}</h3>
                  <p className="mt-1 leading-relaxed">{body}</p>
                </li>
              ))}
            </ol>
            <h3 className="font-semibold text-[var(--text-primary)] mt-6">Import into Google Slides</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              Open slides.google.com → Blank presentation → File → Import slides → Upload → choose the PPTX → Select all → Import slides.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Frequently asked questions</h2>
            <div className="space-y-5">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-[var(--text-primary)]">{item.question}</h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
