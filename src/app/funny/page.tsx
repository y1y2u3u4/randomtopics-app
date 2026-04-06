import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funny Random Topic Generator | Hilarious Questions & Weird Discussion Topics",
  description:
    "Generate funny, weird, and bizarre random topics guaranteed to make everyone laugh. Hilarious conversation starters, would-you-rather questions, and absurd discussion topics for parties, games, and groups.",
};

export default function FunnyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Funny Topics" },
          ]}
        />
        <TopicGenerator
          initialCategory="weird-fun"
          title="Funny Topic Generator"
          subtitle="Hilarious, weird, and wonderfully bizarre topics that'll make everyone crack up."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Why Funny Topics Work
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Laughter is the fastest way to connect with someone. <strong>Funny conversation
                topics</strong> work because they lower defenses, create shared experiences, and make
                people feel comfortable being themselves. When someone asks &quot;If animals could talk,
                which species would be the rudest?&quot; the room instantly lights up — not because the
                question is profound, but because it invites playfulness and creativity.
              </p>
              <p>
                Humor also makes conversations more memorable. Research shows people remember
                information presented with humor significantly better than information delivered
                straight. That&apos;s why the best parties, podcasts, and group hangouts lean into
                absurd, <strong>weird topics</strong> and <strong>hilarious questions</strong> that
                give everyone permission to be silly. Our generator specializes in exactly this kind
                of conversation fuel — questions that are unexpected, slightly ridiculous, and
                impossible to answer with a boring response.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                When to Use Funny Conversation Topics
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Parties & Social Gatherings</h4>
              <p>
                Funny topics are the engine of a great party. Use them as a game — go around the room
                and have each person answer a random question from the generator. The weirder the
                question, the better the answers. &quot;What conspiracy theory would you invent?&quot;
                and &quot;What&apos;s the worst superpower you can think of?&quot; consistently produce
                laugh-out-loud responses. For more party-ready
                material, browse <Link href="/topics/funny-conversation-topics" className="text-[var(--neon-cyan)] hover:underline">funny conversation topics</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Road Trips & Long Hangouts</h4>
              <p>
                Nothing kills a road trip faster than silence. Funny random topics keep energy high
                during long drives, flights, or lazy afternoons. They&apos;re also perfect for
                camping trips and sleepovers where you have time to let conversations wander into
                beautifully absurd territory.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Breaking Awkward Silences</h4>
              <p>
                When conversation stalls, a well-timed absurd question can rescue the entire evening.
                &quot;If you had to eat one food for the rest of your life, but it was always slightly
                wrong — like warm salad or cold pizza — what would you pick?&quot; The specificity of
                funny topics makes them impossible to ignore.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Would You Rather & Hypotheticals</h4>
              <p>
                The &quot;would you rather&quot; format is one of the most reliable conversation
                generators ever invented. The best ones present two options that are equally absurd
                or equally terrible, forcing hilariously passionate debates. Our generator includes
                dozens of these — check
                out <Link href="/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">would you rather questions</Link> for
                a dedicated collection.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tips for Landing Funny Topics
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Commit to the bit.</strong> Deliver the question with a straight face. The contrast between your serious delivery and the absurd question makes it funnier.</li>
                <li><strong>Give your own answer first.</strong> Modeling a funny, genuine response encourages others to match your energy and take creative risks.</li>
                <li><strong>Build on answers.</strong> The best funny conversations happen when people riff off each other. Follow up with &quot;Wait, but what about...&quot; to keep the momentum going.</li>
                <li><strong>Read the audience.</strong> Not every group appreciates the same humor. Start with universally safe absurdity before testing edgier territory.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What makes a topic &quot;funny&quot; versus just random?</h4>
              <p>
                Funny topics have an element of surprise, absurdity, or impossible choice. A random
                topic might be &quot;Talk about space exploration&quot; — interesting, but not
                inherently funny. A funny topic takes it further: &quot;If you were the first
                person on Mars and could only bring three completely useless items, what would they
                be?&quot; The constraint creates comedy.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Are these appropriate for work settings?</h4>
              <p>
                Many of our funny topics are workplace-safe — think hypothetical scenarios and
                preference questions rather than anything edgy. However, always read the room. What
                works at a casual team lunch may not fly in a formal all-hands meeting. Our generator
                lets you filter by category to find the right tone.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Can I use these for party games?</h4>
              <p>
                Absolutely — that&apos;s one of the most popular uses. Set up a round-robin where
                each person generates a topic and everyone answers, then vote on the funniest
                response. You can also use them as prompts for improvisational storytelling or
                as conversation starters for speed-friending events.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How are funny topics different from icebreakers?</h4>
              <p>
                There&apos;s overlap, but funny topics prioritize humor and absurdity, while
                icebreakers prioritize connection and getting people to share. An icebreaker might
                be &quot;What&apos;s your hidden talent?&quot; while a funny topic would be
                &quot;What&apos;s a talent that sounds impressive but is completely useless?&quot;
                Both start conversations, but the energy is different.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How many funny topics do you have?</h4>
              <p>
                Our curated collection includes hundreds of funny, weird, and bizarre topics across
                multiple categories. With AI generation enabled, you get fresh, unique topics every
                time — so you&apos;ll never repeat the same question twice.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
