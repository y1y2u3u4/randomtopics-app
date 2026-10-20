import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { QOTD_ES } from "@/data/esExtraPages";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

// Hourly ISR so the server-rendered question of the day (UTC) stays current.
export const revalidate = 3600;

const COUNT = QOTD_ES.length;

function todayEs() {
  return new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

function todayIndex() {
  const now = new Date();
  const days = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000);
  return days % COUNT;
}

export function generateMetadata(): Metadata {
  const day = todayEs();
  return {
    title: { absolute: `Pregunta del Día para el ${day} + ${COUNT} Ideas` },
    description: `La pregunta del día de hoy (${day}) lista para copiar en clase, en el equipo o en el chat del grupo. ${COUNT} preguntas del día en español, nueva cada medianoche. Gratis.`,
    alternates: { canonical: "/es/question-of-the-day", languages: hreflangAlternates("/question-of-the-day") },
    openGraph: {
      title: "Pregunta del día en español",
      description: `Una pregunta nueva cada día y ${COUNT} ideas para clase, trabajo y familia.`,
      url: `${SITE_URL}/es/question-of-the-day`,
      siteName: "Random Topics",
      locale: "es_ES",
      images: ["/es/opengraph-image"],
      type: "website",
    },
  };
}

const FAQ_ITEMS = [
  {
    question: "¿Qué es la pregunta del día?",
    answer:
      "Es una sola pregunta abierta que se plantea una vez al día para empezar una conversación: en la asamblea de clase, en el canal del equipo, en la cena familiar o en un diario. Lo importante es el ritual: misma hora, una pregunta, todos responden.",
  },
  {
    question: "¿Cada cuánto cambia la pregunta?",
    answer: "Cada medianoche (hora UTC). Todos los que visitan la página el mismo día ven la misma pregunta, así que sirve para toda la clase o todo el equipo.",
  },
  {
    question: "¿Cómo la usan los profesores?",
    answer:
      "Proyecta la pregunta, da un minuto para pensar, comentad en parejas y que dos o tres alumnos respondan en voz alta. En menos de cinco minutos trabaja la expresión oral y el clima de grupo. También sirve como calentamiento de escritura o ticket de salida.",
  },
  {
    question: "¿Puedo sacar otra pregunta si la de hoy no encaja?",
    answer: `Sí. Debajo de la pregunta de hoy tienes un generador con las ${COUNT} preguntas: un clic por pregunta y sin repeticiones hasta terminar el mazo.`,
  },
];

export default function QuestionOfTheDayPageEs() {
  const day = todayEs();
  const today = QOTD_ES[todayIndex()];
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Pregunta del Día" }]} />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 text-center">
          <h1 className="section-heading text-3xl sm:text-4xl text-[var(--text-primary)]">Pregunta del Día</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Hoy, {day}</p>
          <div className="glass-card mt-6 p-6 sm:p-8" data-qotd-today>
            <p className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">{today}</p>
          </div>
        </section>
        <PartyGenerator
          questions={QOTD_ES}
          title="Más preguntas del día"
          subtitle={`${COUNT} preguntas en español para clase, trabajo y familia — un clic por pregunta, sin repeticiones.`}
          emoji="☀️"
          locale="es"
        />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-8 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="section-heading text-2xl sm:text-3xl text-[var(--text-primary)]">Cómo usar la pregunta del día</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li><strong>A la misma hora</strong>: al empezar la clase, la reunión o la cena.</li>
              <li><strong>Un minuto para pensar</strong> antes de que nadie conteste.</li>
              <li><strong>Todos responden</strong>, aunque sea en una frase.</li>
              <li><strong>Sin juicios</strong>: no hay respuestas incorrectas.</li>
            </ol>
            <p>
              ¿Quieres más? Prueba los{" "}
              <Link href="/es/conversation" className="text-[var(--neon-cyan)] hover:underline">temas de conversación</Link>, las{" "}
              <Link href="/es/icebreaker" className="text-[var(--neon-cyan)] hover:underline">preguntas rompehielos</Link> o los{" "}
              <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">temas de debate</Link>.
            </p>
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Las {COUNT} preguntas del día</h2>
            <ol className="list-decimal pl-5 space-y-1">
              {QOTD_ES.map((q) => <li key={q}>{q}</li>)}
            </ol>
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Preguntas frecuentes</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
