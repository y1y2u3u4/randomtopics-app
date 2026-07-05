import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";
import { WOULD_YOU_RATHER_ES } from "@/data/partyQuestions.es";

export const metadata: Metadata = {
  title: { absolute: "Generador de ¿Qué Prefieres? — Más de 60 Preguntas, Sin Repetir | Random Topics" },
  description:
    "Generador gratuito de preguntas de ¿Qué prefieres?: más de 60 dilemas limpios y aptos para fiestas con mazo sin repeticiones. Un clic por pregunta, perfecto para fiestas, viajes en carretera, aulas y rompehielos.",
  alternates: {
    canonical: "/es/would-you-rather",
    languages: hreflangAlternates("/would-you-rather"),
  },
  openGraph: {
    title: "Generador de ¿Qué Prefieres? — Más de 60 Preguntas, Sin Repetir",
    description:
      "Generador gratuito de ¿Qué prefieres?: más de 60 dilemas limpios y aptos para fiestas con mazo sin repeticiones. Perfecto para fiestas, viajes, aulas y rompehielos.",
    url: `${SITE_URL}/es/would-you-rather`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Qué es el juego de ¿Qué prefieres?",
    answer:
      "¿Qué prefieres? es un juego de conversación en el que los jugadores eligen entre dos opciones —a menudo igual de atractivas, igual de horribles o desternillantemente absurdas— y defienden su elección. La gracia no está en la elección en sí, sino en el razonamiento y los argumentos que vienen después.",
  },
  {
    question: "¿Cómo se juega a ¿Qué prefieres?",
    answer:
      "Genera una pregunta, haz que todos respondan (¡no vale decir 'ninguna'!) y luego deja que cada persona defienda su elección en una o dos frases. En grupo, votad primero y haced que la minoría defienda su postura: debate amistoso al instante.",
  },
  {
    question: "¿Estas preguntas de ¿Qué prefieres? son apropiadas?",
    answer:
      "Sí: todas las preguntas de este mazo son aptas para fiestas y adecuadas para grupos mixtos, aulas y noches de juegos en familia. Sin temas para adultos.",
  },
  {
    question: "¿Pueden usarlo los profesores en clase?",
    answer:
      "Por supuesto. ¿Qué prefieres? funciona como actividad de inicio de clase, como calentamiento de escritura persuasiva (elige un bando y defiéndelo en un párrafo) y como ejercicio de expresión oral para aprender idiomas. El mazo sin repeticiones te permite usarlo a diario sin duplicados.",
  },
  {
    question: "¿En qué se diferencia esto de tus otros generadores?",
    answer:
      "Este es un mazo específico de más de 60 dilemas de tipo o/o seleccionados, con rotación sin repeticiones. Para propuestas abiertas, prueba el generador de preguntas al azar; para afirmaciones discutibles con puntos a favor y en contra, usa los generadores de debate o de argumentos.",
  },
];

export default function WouldYouRatherPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "¿Qué Prefieres?" },
          ]}
        />
        <PartyGenerator
          questions={WOULD_YOU_RATHER_ES}
          locale="es"
          title="Generador de ¿Qué Prefieres?"
          subtitle="Más de 60 dilemas limpios de o/o: un clic por pregunta, sin repetir hasta que hayas visto el mazo entero."
          emoji="🤔"
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El Juego de Preguntas Perfecto para Cualquier Grupo
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>¿Qué prefieres?</strong> funciona porque obliga a elegir. Las preguntas abiertas dejan
                que la gente se encoja de hombros; un dilema de o/o exige una postura, y las posturas exigen
                razones. Por eso el juego llena silencios incómodos en las fiestas, despierta aulas
                adormecidas y sobrevive a viajes en carretera de doce horas. Este generador reparte de un mazo
                seleccionado a mano de más de 60 <strong>preguntas limpias de ¿qué prefieres?</strong> —hipótesis
                disparatadas, dilemas vitales e imposibles elecciones de comida— sin repetir hasta que se agote
                el mazo.
              </p>
              <p>
                ¿Prefieres una lista imprimible? Consulta nuestra colección de{" "}
                <Link href="/es/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">80 preguntas de ¿qué prefieres?</Link>.
                Para más munición para fiestas, prueba{" "}
                <Link href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Yo Nunca</Link>,
                el <Link href="/es/question-generator" className="text-[var(--neon-cyan)] hover:underline">generador de preguntas al azar</Link>{" "}
                o los <Link href="/es/funny" className="text-[var(--neon-cyan)] hover:underline">temas divertidos</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Formas de Jugar
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Círculo clásico:</strong> todos responden la misma pregunta y luego el grupo interroga a quien haya hecho la elección más polémica.</li>
                <li><strong>Manda la mayoría:</strong> votad a la vez a la de tres; la minoría debe defender su elección durante 30 segundos.</li>
                <li><strong>Adivina a tu amigo:</strong> intenta acertar qué elegirá la persona de al lado antes de que lo revele. Suma un punto por cada predicción correcta.</li>
                <li><strong>Semilla de debate en clase:</strong> usa una pregunta como mini propuesta de escritura persuasiva —un párrafo defendiendo tu bando. Genial como continuación con nuestro <Link href="/es/debate/middle-school" className="text-[var(--neon-cyan)] hover:underline">generador de debate para secundaria</Link>.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
