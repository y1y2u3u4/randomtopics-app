import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";
import { NEVER_HAVE_I_EVER_ES } from "@/data/partyQuestions.es";

export const metadata: Metadata = {
  title: { absolute: "Generador de Yo Nunca — Más de 60 Preguntas Limpias | Random Topics" },
  description:
    "Generador gratuito de preguntas de Yo Nunca: más de 60 propuestas limpias y divertidas con mazo sin repeticiones. Perfecto para fiestas, rompehielos, viajes en carretera y noche de juegos en familia, sin registro.",
  alternates: {
    canonical: "/es/never-have-i-ever",
    languages: hreflangAlternates("/never-have-i-ever"),
  },
  openGraph: {
    title: "Generador de Yo Nunca — Más de 60 Preguntas Limpias",
    description:
      "Generador gratuito de Yo Nunca: más de 60 propuestas limpias y divertidas con mazo sin repeticiones. Perfecto para fiestas, rompehielos, viajes y noche de juegos.",
    url: `${SITE_URL}/es/never-have-i-ever`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a Yo Nunca?",
    answer:
      "Todos empiezan con diez dedos levantados (o diez puntos). Un jugador lee una frase de 'Yo nunca...'; quien SÍ lo haya hecho baja un dedo. Lo mejor son las historias: quien baja un dedo suele deberle al grupo la anécdota. Gana el último jugador que le queden dedos levantados.",
  },
  {
    question: "¿Estas preguntas de Yo Nunca son apropiadas?",
    answer:
      "Sí: este mazo es deliberadamente limpio y apto para fiestas: momentos vergonzosos pero inocentes, manías graciosas y confesiones cotidianas. Funciona con compañeros de trabajo, aulas, familias y grupos mixtos.",
  },
  {
    question: "¿Cuántos jugadores se necesitan?",
    answer:
      "Funciona con 3 jugadores y escala hasta 30. Para grupos grandes, usa puntos en lugar de dedos y haz que la gente siga de pie mientras le queden puntos: la multitud que mengua genera tensión.",
  },
  {
    question: "¿Puedo usarlo como rompehielos en el trabajo?",
    answer:
      "Sí: este mazo limpio está diseñado para ser apropiado en la oficina. Para un calentamiento rápido de equipo, haz tres rondas e invita (nunca obligues) a la gente a compartir la historia detrás de un dedo bajado. Consulta también nuestro generador de rompehielos para preguntas específicas de reuniones.",
  },
  {
    question: "¿Qué pasa si nos quedamos sin preguntas?",
    answer:
      "El mazo contiene más de 60 propuestas y no se repite hasta que las hayas visto todas. Después baraja de nuevo, o puedes cambiar a ¿Qué prefieres? o al generador de preguntas al azar para que la noche siga.",
  },
];

export default function NeverHaveIEverPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Yo Nunca" },
          ]}
        />
        <PartyGenerator
          questions={NEVER_HAVE_I_EVER_ES}
          locale="es"
          title="Generador de Yo Nunca"
          subtitle="Más de 60 propuestas limpias y divertidas: diez dedos arriba y que empiecen las confesiones."
          emoji="🙈"
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              El Juego de Confesiones que Nunca Pasa de Moda
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                <strong>Yo Nunca</strong> es en realidad una máquina de recopilar historias disfrazada de
                juego. Cada dedo bajado es una anécdota que el grupo puede exigir, y las frases de este mazo
                están calibradas para eso: <strong>propuestas limpias y divertidas</strong> sobre las cosas
                vergonzosas y reconocibles que casi todo el mundo ha hecho en secreto: mandar un mensaje a la
                persona equivocada, reírse por compromiso de un chiste, aplaudir cuando aterriza el avión.
              </p>
              <p>
                El generador reparte una propuesta por clic sin repetir hasta usar las más de 60, así que
                nadie puede acusarte de elegir preguntas con intención. Combínalo con{" "}
                <Link href="/es/would-you-rather" className="text-[var(--neon-cyan)] hover:underline">¿Qué prefieres?</Link>{" "}
                para una noche de juegos completa, o mantén la conversación viva con{" "}
                <Link href="/es/topics/questions-to-ask-at-a-party" className="text-[var(--neon-cyan)] hover:underline">preguntas para fiestas</Link>{" "}
                y el <Link href="/es/question-generator" className="text-[var(--neon-cyan)] hover:underline">generador de preguntas al azar</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Reglas de la Casa que Vale la Pena Probar
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Impuesto de historia:</strong> bajar un dedo te cuesta la anécdota que hay detrás. Esta única regla convierte un juego de contar dedos en la mejor hora de la noche.</li>
                <li><strong>Ronda inversa:</strong> una vez por partida, un jugador puede cantar &quot;inversa&quot;: quien NO lo haya hecho baja un dedo. Salva a los inocentes de ganar siempre.</li>
                <li><strong>Modo por equipos:</strong> las parejas comparten una mano de diez dedos; parejas y mejores amigos discuten sobre de quién cuenta el historial.</li>
                <li><strong>Modo rompehielos:</strong> solo tres rondas, compartir es opcional, sin eliminación: perfecto para sesiones de incorporación y <Link href="/es/icebreaker" className="text-[var(--neon-cyan)] hover:underline">rompehielos de equipo</Link>.</li>
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
