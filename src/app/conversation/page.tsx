import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import EditorsPicks from "@/components/EditorsPicks";
import { ModeIllustration } from "@/components/CategoryIllustration";
import { pickModeTopics } from "@/lib/editorial";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Conversation Topic Generator: 300+ Starters | RandomTopics" },
  description:
    "Free random conversation topic generator with 300+ starters for dates, friends, work, parties, and ESL. Pick a category and get a topic instantly.",
  keywords: [
    "conversation starters",
    "conversation topics",
    "conversation topic generator",
    "random conversation starters",
    "things to talk about",
    "questions to ask",
    "deep conversation topics",
    "conversation starters for adults",
  ],
  alternates: {
    canonical: "/conversation",
    languages: hreflangAlternates("/conversation"),
  },
  openGraph: {
    title: "Conversation Topic Generator: 300+ Free Starters",
    description:
      "Generate a random conversation topic instantly, then explore curated starters for dates, friends, work, parties, and ESL practice.",
    url: `${SITE_URL}/conversation`,
    siteName: "Random Topics",
    type: "website",
  },
};

const CONVERSATION_COLLECTIONS = [
  { title: "Deep Conversation Question Generator", detail: "50 original questions with relationship and setting filters", href: "/deep-conversation-question-generator" },
  { title: "Conversation Starters for Couples", detail: "Questions for dates and relationships", href: "/topics/conversation-starters-for-couples" },
  { title: "Conversation Topics for Teens", detail: "School-friendly prompts that feel natural", href: "/topics/conversation-topics-for-teens" },
  { title: "ESL Conversation Topics", detail: "Speaking practice by level and situation", href: "/topics/esl-conversation-topics" },
  { title: "Funny Conversation Topics", detail: "Light prompts for friends and parties", href: "/topics/funny-conversation-topics" },
  { title: "Questions to Ask Friends", detail: "Fresh questions for closer conversations", href: "/topics/random-questions-to-ask-friends" },
  { title: "First-Date Conversation Topics", detail: "Low-pressure ways to keep a date flowing", href: "/topics/first-date-conversation-topics" },
] as const;

const FAQ_ITEMS = [
  {
    question: "What are good conversation starters for shy people?",
    answer:
      "Start with low-pressure, universal topics like favorite movies, recent travel, or food preferences. Compliment something specific to create a natural entry point. Our generator lets you pick lighter categories if you prefer a gentler approach.",
  },
  {
    question: "How do I keep a conversation going when it stalls?",
    answer:
      "Use the thread-pulling technique: pick up on something the other person mentioned earlier and ask a deeper question about it. You can also switch senses — asking what something sounded, felt, or tasted like — to re-engage their imagination.",
  },
  {
    question: "Are random topics better than planned ones?",
    answer:
      "Both have their place. Random topics add spontaneity and surprise, which can lead to more authentic exchanges. Planned topics work well for structured settings like networking events. Our tool bridges both — generate a random prompt, then steer it wherever feels natural.",
  },
  {
    question: "How many conversation starters does this generator have?",
    answer:
      "Our database includes over 300 hand-curated conversation topics across 15+ categories, and we add new ones regularly. You can also enable AI-powered generation for virtually unlimited unique topics.",
  },
  {
    question: "Can I use these for ESL or language practice?",
    answer:
      "Absolutely. Many English teachers and language exchange partners use random conversation topics to practice fluency. The variety of subjects helps learners build vocabulary across multiple domains while keeping practice sessions engaging.",
  },
];

export default function ConversationPage() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Conversation Topics" },
          ]}
        />
        <ModeIllustration mode="conversation" />
        <TopicGenerator
          initialMode="conversation"
          title="Conversation Topic Generator"
          subtitle="Generate random conversation topics to break the ice and keep discussions flowing."
        />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Popular Conversation Starter Collections
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2 mb-5">
              Generate a random conversation topic above, or choose a focused list for your group and situation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONVERSATION_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.href}
                  href={collection.href}
                  className="rounded-xl border border-[rgba(255,255,255,0.06)] p-4 transition-all hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.04)]"
                >
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">{collection.title}</span>
                  <span className="block text-xs text-[var(--text-muted)] mt-1">{collection.detail}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Free Random Conversation Topic Generator
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Use this <strong>random conversation generator</strong> whenever you need something to talk
                about. Choose a category and depth, generate one or several prompts, then save or share the
                topics that fit. There is no account required, so it works for a quick date-night question,
                a classroom speaking activity, a team meeting, or a party.
              </p>
              <p>
                Conversation starters are questions or topics designed to spark meaningful dialogue between
                people. Whether you&apos;re meeting someone new, reconnecting with an old friend, or trying to
                liven up a dinner party, having a few good <strong>conversation topics</strong> ready can make
                all the difference. Our generator provides hundreds of curated prompts across categories like
                personal growth, travel, culture, technology, and more.
              </p>
              <p>
                Great conversations don&apos;t happen by accident. They start with the right question at the
                right time. A well-chosen <strong>discussion topic</strong> can transform an awkward silence
                into a memorable exchange. That&apos;s why we built this free tool — to give you an endless
                supply of interesting things to talk about, no matter the occasion.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Best Conversation Topics by Situation
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">On a Date</h4>
              <p>
                First dates can be nerve-wracking, but having a few thoughtful questions ready helps both
                people relax. Ask about travel dreams, favorite childhood memories, or what they&apos;d do
                with a surprise day off. Avoid overly personal or controversial subjects early on — focus
                on topics that reveal personality and values without feeling like an interrogation. Looking
                for more date-specific ideas? Check out our guide
                to <Link href="/topics/conversation-starters-for-couples" className="text-[var(--neon-cyan)] hover:underline">conversation starters for couples</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">At Work</h4>
              <p>
                Professional settings call for topics that are engaging but appropriate. Ask colleagues about
                recent projects they&apos;re excited about, industry trends, or weekend plans. Water-cooler
                conversations build rapport and trust, which research shows directly improves team
                collaboration and job satisfaction.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">With Friends</h4>
              <p>
                Even close friends can fall into conversational ruts. Break the pattern with hypothetical
                questions (&quot;If you could live in any era, when?&quot;), nostalgia prompts, or deep
                questions about life goals. For fresh ideas,
                explore <Link href="/topics/random-questions-to-ask-friends" className="text-[var(--neon-cyan)] hover:underline">random questions to ask friends</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">With Family</h4>
              <p>
                Family gatherings benefit from topics everyone can participate in. Try asking about family
                history, sharing &quot;remember when&quot; stories, or discussing upcoming plans. Steer toward
                inclusive subjects that bridge generational gaps and help everyone feel heard.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tips for Better Conversations
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Listen actively.</strong> The best conversationalists are great listeners. Show genuine interest by asking follow-up questions based on what the other person says.</li>
                <li><strong>Share, don&apos;t monologue.</strong> Aim for a balanced exchange. After answering a question yourself, turn it back to the other person.</li>
                <li><strong>Read the room.</strong> Pay attention to body language and energy. If someone seems uncomfortable with a topic, gracefully pivot to something lighter.</li>
                <li><strong>Be curious, not judgmental.</strong> Approach differing opinions with genuine curiosity. &quot;That&apos;s interesting — what made you think that?&quot; goes further than disagreeing.</li>
                <li><strong>Use open-ended questions.</strong> Questions that start with &quot;what,&quot; &quot;how,&quot; or &quot;why&quot; invite longer, more thoughtful responses than yes/no questions.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What are good conversation starters for shy people?</h4>
              <p>
                Start with low-pressure, universal topics like favorite movies, recent travel, or food
                preferences. Compliment something specific (&quot;That&apos;s a great jacket — where&apos;d you
                get it?&quot;) to create a natural entry point. Our generator lets you pick lighter categories
                if you prefer a gentler approach.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How do I keep a conversation going when it stalls?</h4>
              <p>
                Use the &quot;thread-pulling&quot; technique: pick up on something the other person mentioned
                earlier and ask a deeper question about it. You can also switch senses — &quot;What did that
                sound/feel/taste like?&quot; — to re-engage their imagination.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Are random topics better than planned ones?</h4>
              <p>
                Both have their place. Random topics add spontaneity and surprise, which can lead to more
                authentic exchanges. Planned topics work well for structured settings like networking events.
                Our tool bridges both — generate a random prompt, then steer it wherever feels natural.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How many conversation starters does this generator have?</h4>
              <p>
                Our database includes over 300 hand-curated conversation topics across 15+ categories,
                and we add new ones regularly. You can also enable AI-powered generation for virtually
                unlimited unique topics.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Can I use these for ESL or language practice?</h4>
              <p>
                Absolutely. Many English teachers and language exchange partners use random conversation
                topics to practice fluency. The variety of subjects helps learners build vocabulary across
                multiple domains while keeping practice sessions engaging.
              </p>
            </div>
          </div>
        </section>
        <EditorsPicks
          heading="Conversation Starters with Talking Points"
          intro="Eight picks from the conversation pool, spread across Light, Medium, and Deep. Each shows the talking points our editors attached — copy one for your next dinner, date, or meeting, or save it for later."
          topics={pickModeTopics("conversation")}
        />
      </main>
      <Footer />
    </>
  );
}
