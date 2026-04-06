import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Conversation Starters & Discussion Topics | Free Generator",
  description:
    "Generate random conversation starters and discussion topics for any situation. 200+ things to talk about on dates, at work, with friends, and at parties. Never run out of things to say.",
};

export default function ConversationPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Conversation Topics" },
          ]}
        />
        <TopicGenerator
          initialMode="conversation"
          title="Conversation Starter Generator"
          subtitle="Generate random conversation topics to break the ice and keep discussions flowing."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              What Are Conversation Starters?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
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
                Our database includes over 200 hand-curated conversation topics across 15+ categories,
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
      </main>
      <Footer />
    </>
  );
}
