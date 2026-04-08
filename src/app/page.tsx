import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { MODES, CATEGORIES } from "@/data/types";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <TopicGenerator />

        {/* Social proof / stats bar */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>500+</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Curated Topics</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>16</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Categories</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>100%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Free, No Signup</p>
            </div>
          </div>
        </section>

        {/* Mode cards section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Choose Your <span className="gradient-text">Mode</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODES.map((mode) => (
              <Link
                key={mode.slug}
                href={`/${mode.slug}`}
                className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group
                  hover:border-[var(--neon-pink)]/40
                  hover:shadow-[0_0_20px_rgba(255,45,120,0.15)]
                  hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
              >
                <span className="text-4xl mb-4 block drop-shadow-lg">{mode.emoji}</span>
                <h3
                  className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {mode.label}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{mode.description}</p>
              </Link>
            ))}
            <Link
              href="/funny"
              className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group
                hover:border-[var(--neon-pink)]/40
                hover:shadow-[0_0_20px_rgba(255,45,120,0.15)]
                hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
            >
              <span className="text-4xl mb-4 block drop-shadow-lg">😂</span>
              <h3
                className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Funny Topics
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Hilarious and bizarre topics guaranteed to make everyone laugh
              </p>
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* Categories section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Browse by <span className="gradient-text">Category</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="glass-card p-4 sm:p-5 text-center transition-all duration-300 hover:translate-y-[-4px] group
                  hover:border-[var(--neon-cyan)]/40
                  hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]
                  hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.06)] hover:to-transparent"
              >
                <span className="text-3xl mb-2 block drop-shadow-lg">{cat.emoji}</span>
                <span
                  className="text-sm font-medium group-hover:text-[var(--neon-cyan)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* Topic Collections CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-4">
            Curated <span className="gradient-text">Topic Lists</span>
          </h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8 max-w-lg mx-auto">
            Browse our hand-picked collections of topics for debates, conversations, writing, speeches, and more.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: "75 Best Debate Topics for Students", href: "/topics/debate-topics-for-students" },
              { title: "50 Ethical Dilemma Questions", href: "/topics/ethical-dilemma-questions" },
              { title: "65 Presentation Ideas for School", href: "/topics/presentation-ideas-for-school" },
              { title: "70 Toastmasters Table Topics", href: "/topics/toastmasters-table-topics" },
              { title: "60 Deep Questions for Your Partner", href: "/topics/deep-questions-to-ask-your-partner" },
              { title: "55 Virtual Meeting Icebreakers", href: "/topics/icebreaker-questions-for-virtual-meetings" },
              { title: "75 Speech Topics for College", href: "/topics/speech-topics-for-college-students" },
              { title: "60 Random Essay Topics for College", href: "/topics/random-essay-topics-for-college" },
              { title: "65 Get to Know You Questions", href: "/topics/get-to-know-you-questions-for-adults" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-card p-5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] transition-all hover:translate-y-[-2px] hover:border-[var(--neon-cyan)]/30"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title} →
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/topics"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
            >
              View all topic collections →
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Random Topic Generator",
              url: "https://randomtopics.app",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description:
                "Generate random topics for conversations, writing prompts, debates, speeches, and icebreakers. 500+ curated topics across 15+ categories.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is a random topic generator?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A random topic generator is an online tool that instantly provides conversation starters, writing prompts, debate topics, speech ideas, and icebreaker questions from a curated database of 500+ topics across 15+ categories.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does the random topic generator work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Select a mode (conversation, writing, debate, speech, or icebreaker), optionally filter by category and depth, choose how many topics you want, and click Generate. The tool uses AI and a curated database to deliver relevant random topics instantly.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is the random topic generator free to use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, the random topic generator is completely free. No signup, no login, and no limits. Generate as many random topics as you need for conversations, writing, debates, speeches, and icebreakers.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What categories of random topics are available?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The generator includes 15+ categories: Science & Technology, Philosophy, History, Arts & Culture, Psychology, Society, Nature, Health, Business, Education, Sports, Food, Travel, Relationships, Ethics, and Miscellaneous.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I use random topics for classroom activities?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely! Teachers use the random topic generator for classroom discussions, debate practice, essay prompts, and group activities. Filter by category and depth level to match your students' grade and subject area.",
                  },
                },
              ],
            }),
          }}
        />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-8 text-[var(--text-primary)]">
              What is a Random Topic Generator?
            </h2>
            <div className="space-y-5 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                A <strong>random topic generator</strong> is an online tool that instantly provides
                you with conversation starters, writing prompts, debate topics, speech ideas, and
                icebreaker questions. Whether you&apos;re stuck in a creative rut, preparing for a
                presentation, or just looking for something interesting to talk about, our random
                topic generator has you covered with over 500 hand-curated topics.
              </p>
              <p>
                Unlike simple random word generators, a dedicated <strong>random topic generator</strong>{" "}
                gives you fully-formed discussion ideas complete with talking points, depth levels,
                and category tags. Each topic is designed to spark meaningful conversation, inspire
                creative writing, or fuel a lively debate. Our tool also uses AI to generate fresh,
                unique topics on the fly — so you&apos;ll never see the same result twice.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How to Use the Random Topic Generator
              </h3>
              <p>
                Using our random topic generator is simple and takes just a few seconds. Follow
                these steps to get started:
              </p>
              <ol className="space-y-3 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                  <span><strong>Choose a mode</strong> — Pick from conversation, writing, debate, speech, or icebreaker mode to tailor the random topics to your specific need.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                  <span><strong>Filter by category</strong> — Optionally narrow results to a specific category like science, philosophy, history, or technology.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                  <span><strong>Set the depth</strong> — Choose between casual, moderate, or deep topics to match your audience and context.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">4</span>
                  <span><strong>Select a count</strong> — Generate 1, 3, 5, or 10 random topics at once.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">5</span>
                  <span><strong>Click Generate</strong> — Get instant random topics with talking points you can copy and share with one click.</span>
                </li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Why Use a Random Topic Generator?
              </h3>
              <p>
                Coming up with interesting topics on the spot is harder than it sounds. Whether
                you&apos;re a teacher preparing for class, a writer facing a blank page, or a team
                leader planning a meeting, a random topic generator saves time and eliminates the
                mental overhead of brainstorming from scratch.
              </p>
              <p>
                Our random topic generator is especially useful because it combines AI-powered
                generation with a curated database of 500+ topics. This means you get both the
                reliability of expert-written prompts and the novelty of AI-generated ideas. Every
                topic includes multiple talking points to help you explore the subject in depth.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Random Topic Generator for Conversations
              </h3>
              <p>
                Stuck in small talk? Use the random topic generator in conversation mode to discover
                thought-provoking discussion starters. Whether you&apos;re on a first date, at a
                networking event, or just hanging out with friends, a well-chosen topic transforms
                an awkward silence into an engaging exchange. Our conversation topics span casual
                icebreakers to deep philosophical questions, so there&apos;s always something that
                matches the mood.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Random Topics for Writing Prompts
              </h3>
              <p>
                Writers of all levels use our random topic generator to overcome writer&apos;s block
                and spark creativity. Switch to writing mode and generate prompts for essays, blog
                posts, short stories, journal entries, or creative nonfiction. Each writing topic
                comes with angle suggestions and talking points to help you develop your piece.
                Whether you&apos;re a student looking for essay ideas or a professional content
                creator seeking fresh angles, the generator delivers inspiration instantly.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Random Debate Topics
              </h3>
              <p>
                Debate teams, classroom instructors, and discussion group leaders rely on random
                topic generators to keep practice sessions fresh and unpredictable. Our debate mode
                focuses on topics with clear pro/con angles and multiple perspectives. From ethical
                dilemmas to policy questions, technology controversies to social issues — the random
                topic generator provides balanced topics that encourage critical thinking and
                structured argumentation.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Speech Topics & Presentation Ideas
              </h3>
              <p>
                Need a topic for your next speech or presentation? The random topic generator in
                speech mode delivers presentation-ready ideas across every category imaginable.
                Each topic includes talking points you can use as an outline for your speech.
                Public speaking students, Toastmasters members, and corporate presenters all
                benefit from having a reliable source of fresh, engaging presentation topics at
                their fingertips.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                15+ Categories of Random Topics
              </h3>
              <p>
                Our random topic generator covers a wide range of subject areas to match any
                interest or occasion. Browse topics across Science &amp; Technology, Philosophy,
                History, Arts &amp; Culture, Psychology, Society &amp; Politics, Nature &amp;
                Environment, Health &amp; Wellness, Business &amp; Economics, Education, Sports
                &amp; Recreation, Food &amp; Cooking, Travel &amp; Geography, Relationships,
                Ethics &amp; Morality, and more. Each category contains dozens of carefully
                crafted topics at varying depth levels.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who Uses a Random Topic Generator?
              </h3>
              <ul className="space-y-2.5 list-none pl-0">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Teachers and educators</strong> — Generate discussion topics for classrooms, assign random essay prompts, or run debate exercises with fresh topics every session.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Writers and content creators</strong> — Overcome writer&apos;s block with AI-powered writing prompts across every genre and category.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Debate teams and forensics competitors</strong> — Practice impromptu speaking with unpredictable random debate topics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Public speakers and presenters</strong> — Find unique presentation ideas and speech topics that stand out from the crowd.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Friends and social groups</strong> — Discover fun conversation starters for parties, road trips, game nights, and casual hangouts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Team leaders and HR professionals</strong> — Run engaging icebreaker activities for meetings, onboarding, and team-building events.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>Podcasters and YouTubers</strong> — Generate episode ideas and discussion topics to keep your content pipeline full.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)]" />
                  <span><strong>ESL/EFL students</strong> — Practice English conversation with structured topics and talking points at appropriate difficulty levels.</span>
                </li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    Is the random topic generator free?
                  </p>
                  <p>
                    Yes! Our random topic generator is 100% free to use. No signup, no login, and
                    no usage limits. Generate as many topics as you need, whenever you need them.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    How many topics can I generate at once?
                  </p>
                  <p>
                    You can generate 1, 3, 5, or 10 random topics at a time. Each generation
                    pulls from our database of 500+ topics or creates fresh ones using AI, so
                    you&apos;ll always get unique results.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    What makes this random topic generator different?
                  </p>
                  <p>
                    Unlike basic random generators, our tool combines a curated database of 500+
                    expert-written topics with AI-powered generation for unlimited variety. Every
                    topic includes talking points, category tags, and depth levels — giving you
                    everything you need to start a great conversation, essay, debate, or speech.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    Can I filter topics by subject or difficulty?
                  </p>
                  <p>
                    Absolutely. Filter by 15+ categories (science, philosophy, history, etc.) and
                    three depth levels (casual, moderate, deep) to get random topics perfectly
                    suited to your audience and purpose.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">
                    Do I need to create an account?
                  </p>
                  <p>
                    No. The random topic generator works instantly without any registration. Just
                    visit the page, set your preferences, and click Generate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
