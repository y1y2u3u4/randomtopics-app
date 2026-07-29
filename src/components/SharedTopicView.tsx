import Link from "next/link";
import type { Topic } from "@/data/types";
import type { Locale } from "@/i18n/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicCard from "@/components/TopicCard";

export default function SharedTopicView({ topic, locale }: { topic: Topic; locale: Locale }) {
  const isEs = locale === "es";
  const home = isEs ? "/es" : "/";

  return (
    <>
      <Navbar locale={locale} showLocaleSwitcher={false} />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: isEs ? "Inicio" : "Home", href: home },
            { label: isEs ? "Tema compartido" : "Shared Topic" },
          ]}
        />
        <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)] mb-3">
            {isEs ? "Tema compartido" : "Shared random topic"}
          </p>
          <h1 className="section-heading text-3xl sm:text-5xl font-extrabold">
            {isEs ? "Aquí tienes un tema para explorar" : "Here’s a topic worth exploring"}
          </h1>
        </header>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <TopicCard topic={topic} locale={locale} />
        </section>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-6 sm:p-8 text-center">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {isEs
                ? "Genera más temas gratis, sin registro y con puntos para iniciar la conversación."
                : "Generate more free topics—no signup, with talking points included."}
            </p>
            <Link href={home} className="btn-generate inline-flex px-6 py-3 text-sm">
              🎲 {isEs ? "Generar otro tema" : "Generate another topic"}
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </>
  );
}
