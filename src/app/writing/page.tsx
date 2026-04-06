import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Writing Prompt Generator | Creative Writing Ideas & Essay Topics",
  description:
    "Generate random writing prompts for stories, essays, and creative writing exercises. 500+ narrative, persuasive, descriptive, and expository prompts for kids, students, and adults. Overcome writer's block instantly.",
};

export default function WritingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Writing Prompts" },
          ]}
        />
        <TopicGenerator
          initialMode="writing"
          title="Writing Prompt Generator"
          subtitle="Spark your creativity with random writing prompts across every genre and topic."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              What Are Writing Prompts?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A <strong>writing prompt</strong> is a starting point — a question, scenario, or idea
                designed to spark your imagination and get words flowing onto the page. Writers of all
                levels use prompts to overcome blank-page anxiety, practice new genres, and develop their
                craft. Professional authors use them for warm-up exercises, teachers assign them to build
                students&apos; writing skills, and hobbyists use them to explore <strong>creative writing
                ideas</strong> they might never have considered on their own.
              </p>
              <p>
                Our generator provides over 500 curated <strong>writing prompts</strong> spanning fiction,
                non-fiction, poetry, and academic writing. Each prompt is designed to be open-ended enough
                for personal interpretation while specific enough to give your writing direction and focus.
                Whether you need an <strong>essay topic</strong> for class or a story seed for your next
                novel, you&apos;ll find it here.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Types of Writing Prompts
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Narrative Prompts</h4>
              <p>
                Narrative prompts ask you to tell a story. They might give you a character, a setting, or
                a conflict to build from. Examples include &quot;Write about a person who discovers a door
                in their house they&apos;ve never noticed before&quot; or &quot;Tell the story of the worst
                day of someone&apos;s life that turned out to be the best.&quot; These prompts develop
                plot construction, character development, and storytelling instincts.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Persuasive Prompts</h4>
              <p>
                Persuasive prompts challenge you to take a position and defend it with logic and evidence.
                They&apos;re ideal for practicing argumentative essays, opinion pieces, and critical
                thinking. Strong persuasive writing requires understanding both sides of an issue — a
                skill that translates directly to academic and professional success.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Descriptive Prompts</h4>
              <p>
                These prompts focus on painting vivid pictures with words. You might be asked to describe
                a place using only sounds and smells, or capture the feeling of a specific moment in time.
                Descriptive writing builds your sensory vocabulary and teaches you to show rather than tell —
                a fundamental skill in all creative writing.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Expository Prompts</h4>
              <p>
                Expository prompts ask you to explain, inform, or analyze. They&apos;re the backbone of
                academic writing and include tasks like &quot;Explain how a specific technology has changed
                daily life&quot; or &quot;Compare two approaches to solving a social problem.&quot; These
                develop clarity, organization, and the ability to communicate complex ideas simply.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Use Writing Prompts Effectively
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Set a timer.</strong> Give yourself 10-20 minutes and write without stopping. The goal is to silence your inner editor and let ideas flow freely.</li>
                <li><strong>Don&apos;t aim for perfection.</strong> Prompts are practice, not publication. Let yourself write badly — you can always revise later. The act of writing matters more than the result.</li>
                <li><strong>Twist the prompt.</strong> If a prompt says &quot;Write about a hero,&quot; try writing from the villain&apos;s perspective instead. Making prompts your own builds creative confidence.</li>
                <li><strong>Write regularly.</strong> The biggest benefit of prompts comes from consistency. Even 15 minutes of daily writing dramatically improves fluency and voice over time.</li>
                <li><strong>Use prompts as warm-ups.</strong> Many professional writers spend 10 minutes on a prompt before switching to their main project. It loosens up the creative muscles.</li>
              </ul>
              <p>
                For younger writers, our collection
                of <Link href="/topics/writing-prompts-for-kids" className="text-[var(--neon-cyan)] hover:underline">writing prompts for kids</Link> offers
                age-appropriate scenarios that make writing fun rather than intimidating.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How do writing prompts help with writer&apos;s block?</h4>
              <p>
                Writer&apos;s block often comes from the pressure of choosing what to write. Prompts
                remove that decision entirely — you simply respond to what&apos;s given. This lowers
                the barrier to starting, and once you&apos;re writing, momentum takes over. Many
                writers find that prompt-based sessions lead them to ideas they use in their main work.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Can I use these prompts for school assignments?</h4>
              <p>
                Yes. Our prompts cover narrative, persuasive, descriptive, and expository writing —
                the four main types taught in schools. Teachers are welcome to use the generator in
                classrooms, and students can use it for practice or to brainstorm essay ideas.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What if I don&apos;t like the prompt I get?</h4>
              <p>
                Simply generate another one. However, we encourage trying prompts that feel
                uncomfortable — writing outside your comfort zone is where the most growth happens.
                Some of the best stories come from prompts writers initially wanted to skip.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Are these prompts good for journaling?</h4>
              <p>
                Many of our prompts work beautifully for journal entries, especially those in the
                personal reflection and self-discovery categories. Journaling with prompts adds
                structure to the practice and helps you explore topics you might not think of on
                your own.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How many writing prompts are available?</h4>
              <p>
                Our curated database contains over 500 writing prompts across 15+ categories. With
                AI-powered generation enabled, you can access virtually unlimited unique prompts
                tailored to any genre, age group, or difficulty level.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
