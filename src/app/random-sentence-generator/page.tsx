import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomSentenceGenerator from "@/components/generators/RandomSentenceGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-sentence-generator";
const TITLE = "Random Sentence Generator — Funny, Everyday and Story Sentences";
const DESCRIPTION =
  "Generate random sentences instantly: everyday, funny, story and question sentences built from grammatical templates. Draw 1, 5 or 10, copy with a tap, and share a link. Free.";

const SOCIAL = generatorSocial({ card: "random-sentence-generator", title: TITLE, description: DESCRIPTION, alt: "Random Sentence Generator" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random sentence generator", "random sentence", "sentence generator", "funny random sentences", "random sentences for writing", "random sentence starter", "random question generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "What is a random sentence generator?",
    answer: "A tool that builds a complete, grammatical sentence by filling a template with randomly chosen words. Each result is a sentence you can use as a writing prompt, a speaking exercise, a typing test line or just a laugh.",
  },
  {
    question: "Are the sentences grammatically correct?",
    answer: "Yes. Every sentence follows one of 21 hand-written templates and the word lists are matched by role (people, places, verbs, adjectives), so the grammar holds even when the meaning is silly.",
  },
  {
    question: "How many different sentences can it make?",
    answer: "More than half a million combinations. The pool counter under the tool updates with your filters.",
  },
  {
    question: "How can I use random sentences for writing practice?",
    answer: "Take a story sentence as your opening line, or a funny one as a constraint: you must justify it. Ten minutes of writing from one random sentence is a classic warm-up.",
  },
  {
    question: "Can I get random sentences for English practice or kids' lessons?",
    answer: "Choose the everyday type for simple present-tense sentences and the question type for speaking practice. Teachers can show one sentence and ask students to rewrite it, translate it or continue it.",
  },
  {
    question: "Can I share a sentence I got?",
    answer: "Yes. Use the share button to copy a link that reopens exactly that sentence.",
  },
];

export default function RandomSentenceGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Sentence Generator"
      heading={["Random Sentence", "Generator"]}
      intro="Instant grammatical sentences, from everyday to ridiculous. Pick a type, draw a few and copy."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort="Choose a sentence type (everyday, funny, story or question), draw 1, 5 or 10 random sentences and tap one to copy it. Each sentence is built from a grammatical template with random words, so there are over half a million possible results. Free, instant, no signup."
      related={[
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/random-word-generator", label: "Random word generator" },
        { href: "/random-noun-generator", label: "Random noun generator" },
        { href: "/random-name-generator", label: "Random name generator" },
        { href: "/writing-topic-generator", label: "Writing topic generator" },
      ]}
      content={
        <>
          <SectionTitle>What you can do with a random sentence</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Writing warm-ups</strong> — start a story from a story sentence, or defend a funny one as if it were true.</li>
            <li><strong>Speaking and English practice</strong> — read the everyday sentences aloud, or answer the question sentences in full.</li>
            <li><strong>Typing and handwriting practice</strong> — fresh lines every time instead of the same drill text.</li>
            <li><strong>Games</strong> — sentence-chain storytelling, &lsquo;use it in conversation&rsquo; challenges and party icebreakers.</li>
            <li><strong>Testing</strong> — realistic dummy text for fonts, forms and layouts.</li>
          </ul>
          <SectionTitle>The four sentence types</SectionTitle>
          <p>
            <strong>Everyday</strong> sentences are short, plain statements. <strong>Funny</strong> sentences pair unlikely subjects with confident verbs. <strong>Story</strong> sentences
            read like the opening line of a scene. <strong>Question</strong> sentences ask something you can answer out loud. Switch the type and the same tool becomes a different exercise.
          </p>
          <SectionTitle>Turn one sentence into a lesson</SectionTitle>
          <p>
            Draw five sentences, pick the one you like least and rewrite it three ways: shorter, more vivid, from another point of view. For single words instead of whole sentences, try the{" "}
            <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link> or the{" "}
            <Link prefetch={false} href="/random-noun-generator" className={linkClass}>random noun generator</Link>; for longer prompts, use the{" "}
            <Link prefetch={false} href="/writing" className={linkClass}>writing prompt generator</Link>.
          </p>
        </>
      }
    >
      <RandomSentenceGenerator />
    </GeneratorPageShell>
  );
}
