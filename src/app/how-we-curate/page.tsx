import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import type { Metadata } from "next";
import { topics } from "@/data/topics";
import { topicWorkshops } from "@/data/topicWorkshops";

export const metadata: Metadata = {
  title: "How We Curate — Topic Selection and Practice Guides",
  description: "How the RandomTopics collection works: actual topic counts, selection and depth filters, worked practice examples, limitations and corrections.",
  alternates: { canonical: "/how-we-curate" },
};

export default function HowWeCuratePage() {
  const total = topics.length;
  const deepCount = topics.filter(t => t.depth === "deep").length;
  const withPoints = topics.filter(t => t.talkingPoints.length >= 3).length;
  return <><Navbar /><main className="flex-1">
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "How We Curate" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <header className="space-y-4"><h1 className="text-4xl sm:text-5xl font-bold">How We <span className="gradient-text">Curate</span></h1>
        <p className="text-lg text-[var(--text-secondary)]">RandomTopics selects prompts from a fixed collection. This page explains what the collection contains, how to use its labels and where a prompt needs further research.</p>
        <p className="text-sm text-[var(--text-muted)]">Updated October 3, 2026</p>
      </header>
      <section aria-label="Current collection" className="grid grid-cols-3 gap-3">
        {[[total, "Topics in the collection"], [withPoints, "With 3+ talking points"], [deepCount, "Labelled Deep"]].map(([value, label]) => <div key={label} className="glass-card p-3 sm:p-5 text-center"><p className="text-2xl sm:text-3xl font-extrabold gradient-text">{value}</p><p className="text-xs text-[var(--text-muted)] mt-2">{label}</p></div>)}
      </section>
      <section className="glass-card p-5 sm:p-8 space-y-4"><h2 className="text-2xl font-semibold">What a topic draw does</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">Each topic has a category, one or more uses such as writing or conversation, a depth label and talking points. Choosing filters narrows that collection. The count beside Generate is the matching pool, which can be much smaller than the whole database. The generator avoids repeats within a round, then begins a new cycle when the pool is exhausted.</p>
        <p className="text-[var(--text-secondary)] leading-relaxed">Ordinary topic draws do not ask an AI model to invent a new result. Optional speech transcription and feedback use AI after you submit a recording; that private feedback is separate from this public collection. Read the <Link href="/privacy" className="underline text-[var(--neon-cyan)]">privacy policy</Link> before using recording or saved practice.</p>
      </section>
      <section className="glass-card p-5 sm:p-8 space-y-4"><h2 className="text-2xl font-semibold">How to judge a prompt before using it</h2>
        <ul className="list-disc pl-5 space-y-3 text-[var(--text-secondary)] leading-relaxed">
          <li><strong>Match the task.</strong> A conversation question invites experiences; a debate needs a defined motion and fair opposing positions; an essay needs a claim or scene. The same subject can support different tasks, but it needs a different approach.</li>
          <li><strong>Check the setting.</strong> Light, Medium and Deep are guidance, not age ratings or guarantees of comfort. Some politics, ethics and personal topics need preparation. Facilitators should preview questions and let participants pass or choose an invented example.</li>
          <li><strong>Use talking points as leads.</strong> They suggest angles to investigate, not verified findings or citations. A scientific claim, current law or statistic needs a traceable source and date before it belongs in a factual speech or essay.</li>
          <li><strong>Make the task concrete.</strong> Define the audience, an output and a stopping point: a three-paragraph argument, a two-minute speech or one question with two follow-ups. Judge the result against that goal.</li>
        </ul>
      </section>
      <section className="glass-card p-5 sm:p-8 space-y-4"><h2 className="text-2xl font-semibold">Worked examples in the collection</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">The following pages pair a real generator prompt with an original worked example, steps, self-checks and a second attempt. Their English and Spanish versions cover the same exercise. Fictional scenes and proposed debate rules are marked as examples, rather than presented as research findings or current law.</p>
        <ul className="space-y-3">{Object.entries(topicWorkshops).map(([path, guide]) => <li key={path}><Link href={`/${path}#topic-workshop`} className="underline text-[var(--neon-cyan)]">{guide.en.title}</Link></li>)}</ul>
        <p className="text-sm text-[var(--text-secondary)]">In the October 3 update, psychology writing grew from one prompt to six, adding exercises on attention, habits, memory, belonging and confidence. Collection counts above reflect the current data. These examples illustrate a method; they do not certify every prompt as suitable for every group.</p>
      </section>
      <section className="glass-card p-5 sm:p-8 space-y-4"><h2 className="text-2xl font-semibold">Corrections and separate collections</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed">Party games, drawing exercises and other specialist tools have their own collections and controls. Their prompts are not included in the topic count above. Check the instructions on the tool you choose and agree on boundaries before a group activity.</p>
        <p className="text-[var(--text-secondary)] leading-relaxed">If a prompt is misleading, dated, unclear or unsuitable for its label, <Link href="/contact" className="underline text-[var(--neon-cyan)]">send the page and the exact prompt</Link>, explain the problem and include a source where relevant. Do not send private recordings or another person’s personal information. A concrete report helps identify the entry that needs correction.</p>
      </section>
      <nav aria-label="Explore the collection" className="flex flex-wrap gap-5 text-[var(--neon-cyan)]"><Link className="underline" href="/categories">Browse categories</Link><Link className="underline" href="/topics">Topic lists</Link><Link className="underline" href="/about">About RandomTopics</Link></nav>
    </div>
  </main><Footer /></>;
}
