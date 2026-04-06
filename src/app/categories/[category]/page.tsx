import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import { CATEGORIES } from "@/data/types";
import { categorySeoContent } from "@/data/categorySeoContent";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    category: cat.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  const label = cat?.label ?? "Topics";

  return {
    title: `Random ${label} Topics - ${label} Discussion Ideas & Prompts`,
    description: `Generate random ${label.toLowerCase()} topics for conversations, writing, debates, and more. ${cat?.description ?? "Explore interesting topics."}`,
    alternates: {
      canonical: `/categories/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  const label = cat?.label ?? "Topics";
  const seoContent = categorySeoContent[category as keyof typeof categorySeoContent];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: label },
          ]}
        />
        <TopicGenerator
          initialCategory={category as any}
          title={`${label} Topic Generator`}
          subtitle={cat?.description ?? "Explore interesting topics in this category."}
        />

        {seoContent && (
          <>
            {/* Intro Section */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
              <div className="glass-card p-8 sm:p-10">
                <h2
                  className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  About {label} Topics
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {seoContent.intro}
                </p>
              </div>
            </section>

            {/* Popular Topics Section */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
              <div className="glass-card p-8 sm:p-10">
                <h2
                  className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Popular {label} Topics
                </h2>
                <ul className="space-y-4">
                  {seoContent.sampleTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {topic}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
              <div className="glass-card p-8 sm:p-10">
                <h2
                  className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {seoContent.faqs.map((faq, i) => (
                    <div key={i}>
                      <h3
                        className="text-base font-semibold text-[var(--text-primary)] mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {faq.question}
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ JSON-LD Structured Data */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: seoContent.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: faq.answer,
                    },
                  })),
                }),
              }}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
