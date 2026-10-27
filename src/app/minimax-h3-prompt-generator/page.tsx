import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MinimaxH3PromptGenerator from "@/components/generators/MinimaxH3PromptGenerator";
import { SCENARIOS, CAMERAS, combos } from "@/lib/generators/minimaxH3";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/minimax-h3-prompt-generator";
const TITLE = "MiniMax H3 Prompt Generator — Free Hailuo 3 Video Prompts";
const DESCRIPTION = `Free MiniMax H3 (Hailuo 3) prompt generator: pick one of ${SCENARIOS.length} scenarios and get a ready-to-paste video prompt with camera, timed action beats, dialogue, sound effects, music and limits. Lock and re-roll any part. No signup.`;

const SOCIAL = generatorSocial({ card: "minimax-h3-prompt-generator", title: TITLE, description: DESCRIPTION, alt: "MiniMax H3 prompt generator — clapperboard, camera, film and headphones" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["minimax h3 prompt generator", "minimax h3 prompt", "minimax h3", "minimaxh3", "hailuo 3 prompt", "hailuo 03 prompt", "hailuo prompt generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const PER_SCENARIO = Math.min(...SCENARIOS.map(combos));

const FAQ = [
  {
    question: "What is MiniMax H3?",
    answer: "MiniMax H3 (also called Hailuo 3) is MiniMax's open-weight video model. It makes clips of about 5 to 15 seconds at up to 2K with native stereo sound, and it can take image, video and audio references in the same prompt.",
  },
  {
    question: "How do I write a good MiniMax H3 prompt?",
    answer: "Give each reference one job (\"use Image 1 for the face\"), describe the clip in one sentence with length and aspect ratio, split the action into timed beats (0–3s, 3–7s, 7–10s), then add dialogue, sound, look and limits. This generator writes prompts in exactly that order.",
  },
  {
    question: "Is there a free MiniMax H3 prompt generator?",
    answer: `Yes — this page. Pick a scenario, press Generate, then lock the parts you like and re-roll the rest. Every scenario has at least ${PER_SCENARIO.toLocaleString("en-US")} combinations before you change length, ratio or references. No signup and nothing to install.`,
  },
  {
    question: "Does it work for Hailuo 02 or other video models?",
    answer: "The prompts are plain English with camera, beats and sound, so they also work in Hailuo 02, Kling, Veo, Sora-style models and most text-to-video tools. Remove the reference and sound lines if a model doesn't support them.",
  },
  {
    question: "How long can a MiniMax H3 clip be?",
    answer: "A single generation tops out at about 15 seconds. Choose 5, 6, 10 or 15 seconds above and the action beats are re-timed to fit. For longer scenes, generate several shots and edit them together.",
  },
  {
    question: "Is this an official MiniMax tool?",
    answer: "No. Random Topics is an unofficial, free prompt helper and is not affiliated with MiniMax or Hailuo AI. It writes text prompts only; you paste them into whichever app or API you use to run the model.",
  },
];

export default function MinimaxH3PromptGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="MiniMax H3 Prompt Generator"
      heading={["MiniMax H3", "Prompt Generator"]}
      intro={`Random, ready-to-paste MiniMax H3 / Hailuo 3 video prompts — split into camera, timed action, dialogue, sound effects and music.`}
      description={DESCRIPTION}
      hero={{ src: "/generators/hero/h3.webp", alt: "A clapperboard, a small cinema camera on a tripod, film strips and studio headphones" }}
      heroHideOnShort
      updated="2026-10-27"
      faq={FAQ}
      inShort={
        <p>
          <strong>In short:</strong> a free MiniMax H3 prompt generator. Choose one of {SCENARIOS.length} scenarios (cinematic, product ad, music video,
          dialogue, anime, nature, horror, food, travel, sports), set 5–15 seconds and an aspect ratio, and get a structured Hailuo 3 prompt with camera,
          timed beats, dialogue, sound and limits. Lock any field, re-roll the rest, copy in one click. No signup; not affiliated with MiniMax.
        </p>
      }
      related={[
        { href: "/random-idea-generator", label: "Random idea generator" },
        { href: "/story-prompt-generator", label: "Story prompt generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/headcanon-generator", label: "Headcanon generator" },
      ]}
      content={
        <>
          <SectionTitle>The H3 prompt structure this tool follows</SectionTitle>
          <ol className="list-decimal space-y-1 pl-5">
            <li><strong>References</strong> — one job per file: Image 1 for identity, Video 1 only for camera movement, Audio 1 for voice. H3 accepts up to nine images, three videos and three audio files.</li>
            <li><strong>Brief</strong> — one sentence with length, aspect ratio, subject and setting.</li>
            <li><strong>Camera</strong> — a single clear move. The generator picks from {CAMERAS.length} camera moves such as a slow dolly-in, an orbit or a crane up.</li>
            <li><strong>Timed beats</strong> — three beats re-timed to your clip length (for 10 seconds: 0–3s, 3–7s, 7–10s).</li>
            <li><strong>Dialogue</strong> — a short quoted line, a voice-over, or none. Short lines lip-sync better.</li>
            <li><strong>Sound and music</strong> — H3 generates native stereo audio, so name the effects and the music (or say &quot;no music&quot;).</li>
            <li><strong>Look and limits</strong> — lighting and grade, then what must not change: faces, labels, no on-screen text.</li>
          </ol>
          <SectionTitle>Tips for better Hailuo 3 results</SectionTitle>
          <ul className="list-disc space-y-1 pl-5">
            <li>Start with no references, get the motion right, then add an image for identity.</li>
            <li>Keep one camera move per clip; two competing moves often blur.</li>
            <li>Quote any text that must appear exactly, and keep it short.</li>
            <li>When a clip works, lock everything and re-roll only one field to make variations.</li>
          </ul>
          <p>
            Need the story first? Try the <Link prefetch={false} href="/story-prompt-generator" className={linkClass}>story prompt generator</Link>, or
            build a cast with the <Link prefetch={false} href="/random-character-generator" className={linkClass}>random character generator</Link>.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Model facts from MiniMax&apos;s public H3 announcement and launch coverage (checked October 2026). Unofficial tool — not affiliated with
            MiniMax or Hailuo AI; names are used only to describe compatibility.
          </p>
        </>
      }
    >
      <MinimaxH3PromptGenerator />
    </GeneratorPageShell>
  );
}
