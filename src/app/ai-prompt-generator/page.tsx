import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AiPromptGenerator from "@/components/generators/AiPromptGenerator";
import { MODES, buildPrompt, combos } from "@/lib/generators/aiPrompt";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/ai-prompt-generator";
const TITLE = "AI Prompt Generator — Free Image, Video & ChatGPT Prompts";
const DESCRIPTION =
  "Free AI prompt generator: build prompts for images (ChatGPT, Midjourney, Stable Diffusion, Gemini), video (Veo, Sora, Kling, Runway) and ChatGPT writing by tapping style, lighting, camera, tone and format options. Copy in one click. Unlimited, no signup.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "ai prompt generator", "free ai prompt generator", "prompt generator", "ai image prompt generator", "ai video prompt generator",
    "chatgpt prompt generator", "midjourney prompt generator", "stable diffusion prompt generator", "ai art prompt generator", "prompt maker",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const [IMAGE, VIDEO, WRITING] = MODES;
const fmt = (n: number) => (n >= 1e9 ? `${Math.floor(n / 1e9).toLocaleString("en-US")} billion` : n >= 1e6 ? `${Math.floor(n / 1e6).toLocaleString("en-US")} million` : n.toLocaleString("en-US"));
const MIN_COMBOS = fmt(Math.min(...MODES.map((m) => combos(m.id))));

// Real output of the generator for a few presets, rendered on the server.
const EXAMPLES = [
  { mode: IMAGE, id: "product", target: "chatgpt" },
  { mode: IMAGE, id: "anime", target: "midjourney" },
  { mode: IMAGE, id: "fantasy", target: "sd" },
  { mode: VIDEO, id: "drone", target: "sound" },
  { mode: WRITING, id: "cold", target: "structured" },
].map(({ mode, id, target }) => ({ mode, target, preset: mode.presets.find((p) => p.id === id)! })).map(({ mode, preset, target }) => ({
  title: `${mode.label}: ${preset.label} (${mode.targets.find((t) => t.id === target)!.label})`,
  text: buildPrompt(mode.id, preset.idea, preset.picks, target),
}));

const FAQ = [
  {
    question: "Is this AI prompt generator free?",
    answer: "Yes — free and unlimited, with no signup and no credits. The prompt is built in your browser from the options you tap, so there is nothing to wait for and no daily limit. Copy it into ChatGPT, Midjourney, Gemini, Veo or any other AI tool.",
  },
  {
    question: "How do I write a good AI image prompt?",
    answer: "Say what the image shows first (subject + action + place), then the style (photo, anime, watercolor), framing or lens, lighting, mood and colors, and finally the aspect ratio and anything to avoid. Short, concrete words beat long lists of adjectives. The Image tab writes prompts in exactly that order.",
  },
  {
    question: "Does it make Midjourney prompts?",
    answer: "Yes. Choose Image, then the Midjourney format: you get comma-separated phrases with --ar for the aspect ratio and --no for anything you want left out, ready to paste after /imagine.",
  },
  {
    question: "Can it write ChatGPT prompts for emails, essays and blog posts?",
    answer: "Yes. The ChatGPT writing tab builds a prompt with a role, the task, the audience, tone, format and length, plus optional extras like “ask me questions first” or “give 3 versions”. It works the same in ChatGPT, Claude and Gemini.",
  },
  {
    question: "What video models does it support?",
    answer: "The Video tab writes prompts for Veo 3, Sora 2, Kling, Runway, Pika and similar models: shot, camera move, lighting, mood, pacing, length and aspect ratio. The Veo / Sora format adds a sound line because those models generate audio; the Kling / Runway / Pika format leaves it out.",
  },
  {
    question: "Does this tool use AI to write the prompt?",
    answer: "No. It assembles the prompt from hand-written building blocks, so the result is instant, repeatable and exactly what you picked — nothing is invented and nothing you type leaves your browser. If you want an AI to polish it further, paste it into ChatGPT and ask it to improve the prompt.",
  },
  {
    question: "AI prompt generator vs story prompt generator — which one do I need?",
    answer: "This page writes instructions for AI tools (what to draw, film or write). The story prompt generator gives you story ideas to write yourself — a premise, a character and a twist. For MiniMax Hailuo videos with timed beats and references, use the MiniMax H3 prompt generator.",
  },
];

export default function AiPromptGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="AI Prompt Generator"
      heading={["AI Prompt", "Generator"]}
      intro="Free prompts for AI images, video and ChatGPT writing. Tap options, copy, paste. Unlimited, no signup."
      description={DESCRIPTION}
      updated="2026-11-07"
      faq={FAQ}
      related={[
        { href: "/story-prompt-generator", label: "Story prompt generator" },
        { href: "/minimax-h3-prompt-generator", label: "MiniMax H3 prompt generator" },
        { href: "/writing", label: "Writing prompt generator" },
        { href: "/random-character-generator", label: "Random character generator" },
      ]}
      inShort={
        <>
          A free AI prompt generator for three jobs: <strong>images</strong> (ChatGPT / GPT Image, Midjourney, Stable Diffusion, Flux, Gemini),{" "}
          <strong>video</strong> (Veo, Sora, Kling, Runway, Pika) and <strong>ChatGPT writing</strong> (emails, posts, essays, summaries). Type your idea,
          tap any mix of style, lighting, camera, tone and format options, and copy a prompt formatted for the model you use. Every tab has at least{" "}
          {MIN_COMBOS} option combinations. No signup, no credits, no limit.
        </>
      }
      content={
        <>
          <SectionTitle>How to use the AI prompt generator</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pick what you are making: Image, Video or ChatGPT writing.</li>
            <li>Type your idea in a few plain words — or tap an example to start from.</li>
            <li>Tap options to add them; tap again to remove. Rows marked “pick any” combine.</li>
            <li>Choose the format for your tool (for example Midjourney or Stable Diffusion) and press Copy prompt.</li>
          </ol>

          <SectionTitle>Example prompts made with this generator</SectionTitle>
          {EXAMPLES.map((ex) => (
            <div key={ex.title}>
              <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{ex.title}</h3>
              <pre className="mt-1 whitespace-pre-wrap break-words rounded-lg bg-black/30 p-3 text-xs leading-relaxed text-[var(--text-primary)]">{ex.text}</pre>
            </div>
          ))}

          <SectionTitle>The prompt formula for each tab</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[var(--text-primary)]"><th className="py-2 pr-3">Tab</th><th className="py-2 pr-3">Order of the prompt</th><th className="py-2">Formats</th></tr>
              </thead>
              <tbody>
                {MODES.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 align-top">
                    <td className="py-2 pr-3 font-semibold text-[var(--text-primary)]">{m.emoji} {m.label}</td>
                    <td className="py-2 pr-3">{[m.id === "writing" ? "Topic" : "Idea", ...m.fields.map((f) => f.label)].join(" → ")}</td>
                    <td className="py-2">{m.targets.map((t) => t.label).join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>What makes this prompt generator different</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Instant and unlimited.</strong> Many prompt generators send your idea to an AI model, ask you to sign up and count credits. This one builds the prompt in your browser, so there is no account, no wait and no limit.</li>
            <li><strong>You choose every word.</strong> Each option adds a fixed, tested phrase — the prompt never drifts away from what you picked, and the same choices always give the same prompt.</li>
            <li><strong>Formatted for your model.</strong> Midjourney gets <code>--ar</code> and <code>--no</code>, Stable Diffusion gets a separate negative prompt, ChatGPT and Gemini get plain sentences, and video prompts add sound only for models that make audio.</li>
            <li><strong>What it does not do:</strong> it does not generate the image, video or text itself — paste the prompt into the AI tool you already use.</li>
          </ul>

          <SectionTitle>Which prompt generator should I use?</SectionTitle>
          <p>
            Use this page for prompts that tell an AI tool what to make. For story ideas you write yourself, use the{" "}
            <Link prefetch={false} href="/story-prompt-generator" className={linkClass}>story prompt generator</Link>. For MiniMax Hailuo 3 clips with timed action beats,
            image/video/audio references and dialogue, use the <Link prefetch={false} href="/minimax-h3-prompt-generator" className={linkClass}>MiniMax H3 prompt generator</Link>.
            Writing practice topics live in the <Link prefetch={false} href="/writing" className={linkClass}>writing prompt generator</Link>.
          </p>
        </>
      }
    >
      <AiPromptGenerator />
    </GeneratorPageShell>
  );
}
