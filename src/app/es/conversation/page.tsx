import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas de Conversación: 300+ Ideas | RandomTopics" },
  description:
    "Generador de temas de conversación gratis con más de 300 ideas para citas, amigos, trabajo, fiestas y clases. Elige una categoría y recibe un tema al instante.",
  keywords: [
    "iniciadores de conversación",
    "temas de conversación",
    "generador de temas de conversación",
    "iniciadores de conversación al azar",
    "de qué hablar",
    "preguntas para hacer",
    "temas de conversación profundos",
    "iniciadores de conversación para adultos",
  ],
  alternates: {
    canonical: "/es/conversation",
    languages: hreflangAlternates("/conversation"),
  },
  openGraph: {
    title: "Generador de Temas de Conversación: Más de 300 Ideas Gratis",
    description:
      "Genera al instante temas de conversación para citas, amigos, trabajo, fiestas y clases. Más de 300 ideas seleccionadas, sin registro.",
    url: `${SITE_URL}/es/conversation`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const CONVERSATION_COLLECTIONS_ES = [
  { title: "Temas de conversación para adolescentes", detail: "Preguntas naturales y aptas para clase", href: "/es/topics/conversation-topics-for-teens" },
  { title: "Conversaciones para parejas", detail: "Ideas para citas y relaciones", href: "/es/topics/conversation-starters-for-couples" },
  { title: "Temas para practicar idiomas", detail: "Conversación por nivel y situación", href: "/es/topics/esl-conversation-topics" },
  { title: "Temas de conversación divertidos", detail: "Preguntas ligeras para amigos y fiestas", href: "/es/topics/funny-conversation-topics" },
  { title: "Preguntas para una fiesta", detail: "Rompe el hielo y anima al grupo", href: "/es/topics/questions-to-ask-at-a-party" },
  { title: "Temas controversiales para debatir", detail: "Debates respetuosos para grupos", href: "/es/topics/controversial-topics-to-discuss" },
] as const;

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son buenos iniciadores de conversación para personas tímidas?",
    answer:
      "Empieza con temas universales y de baja presión, como películas favoritas, viajes recientes o preferencias de comida. Halaga algo concreto para crear un punto de entrada natural. Nuestro generador te permite elegir categorías más ligeras si prefieres un enfoque más suave.",
  },
  {
    question: "¿Cómo mantengo viva una conversación cuando se estanca?",
    answer:
      "Usa la técnica de tirar del hilo: retoma algo que la otra persona mencionó antes y hazle una pregunta más profunda al respecto. También puedes cambiar de sentido —preguntar a qué sonaba, cómo se sentía o a qué sabía algo— para volver a activar su imaginación.",
  },
  {
    question: "¿Son mejores los temas al azar que los planificados?",
    answer:
      "Ambos tienen su lugar. Los temas al azar aportan espontaneidad y sorpresa, lo que puede dar lugar a intercambios más auténticos. Los temas planificados funcionan bien en contextos estructurados, como eventos de networking. Nuestra herramienta une lo mejor de ambos: genera un tema al azar y luego llévalo hacia donde te resulte más natural.",
  },
  {
    question: "¿Cuántos iniciadores de conversación tiene este generador?",
    answer:
      "Nuestra base de datos incluye más de 300 temas de conversación seleccionados a mano en más de 15 categorías, y añadimos nuevos con regularidad. También puedes activar la generación con IA para conseguir temas únicos prácticamente ilimitados.",
  },
  {
    question: "¿Puedo usarlos para practicar idiomas o clases de español como lengua extranjera?",
    answer:
      "Por supuesto. Muchos profesores de idiomas y parejas de intercambio usan temas de conversación al azar para practicar la fluidez. La variedad de asuntos ayuda a quienes aprenden a ampliar vocabulario en múltiples ámbitos mientras mantienen las sesiones de práctica interesantes.",
  },
];

export default function ConversationPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Conversación" },
          ]}
        />
        <TopicGenerator
          initialMode="conversation"
          locale="es"
          title="Generador de Temas de Conversación"
          subtitle="Genera temas de conversación al azar para romper el hielo y mantener la charla fluida."
        />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-4">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Colecciones populares de conversación
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2 mb-5">
              Genera un tema al azar arriba o elige una lista específica para tu grupo y situación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONVERSATION_COLLECTIONS_ES.map((collection) => (
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
              ¿Qué Son los Iniciadores de Conversación?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Los iniciadores de conversación son preguntas o temas pensados para provocar un diálogo con
                sentido entre las personas. Ya conozcas a alguien nuevo, retomes el contacto con un viejo amigo o
                intentes animar una cena, tener a mano unos cuantos buenos <strong>temas de conversación</strong>{" "}
                puede marcar la diferencia. Nuestro generador te ofrece cientos de propuestas seleccionadas en
                categorías como crecimiento personal, viajes, cultura, tecnología y muchas más.
              </p>
              <p>
                Las buenas conversaciones no surgen por casualidad. Empiezan con la pregunta adecuada en el
                momento adecuado. Un <strong>tema de discusión</strong> bien elegido puede transformar un silencio
                incómodo en un intercambio memorable. Por eso creamos esta herramienta gratuita: para darte un
                suministro infinito de cosas interesantes de qué hablar, sea cual sea la ocasión.
              </p>
              <p>
                ¿Necesitas otro tipo de propuesta? Prueba nuestro <Link href="/es/writing" className="text-[var(--neon-cyan)] hover:underline">generador de ideas para escribir</Link>,
                el <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">generador de temas de debate</Link>,
                nuevas <Link href="/es/icebreaker" className="text-[var(--neon-cyan)] hover:underline">preguntas rompehielos</Link> para reuniones,
                o <Link href="/es/speech" className="text-[var(--neon-cyan)] hover:underline">temas para discursos</Link> con un cronómetro de práctica integrado.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Los Mejores Temas de Conversación Según la Situación
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">En una Cita</h4>
              <p>
                Las primeras citas pueden poner nervioso, pero tener a mano unas cuantas preguntas bien pensadas
                ayuda a que ambas personas se relajen. Pregunta por sueños de viaje, recuerdos favoritos de la
                infancia o qué haría con un día libre inesperado. Evita al principio los temas demasiado
                personales o polémicos: céntrate en asuntos que revelen personalidad y valores sin que parezca un
                interrogatorio. ¿Buscas más ideas específicas para citas? Echa un vistazo a nuestra guía de{" "}
                <Link href="/es/topics/conversation-starters-for-couples" className="text-[var(--neon-cyan)] hover:underline">iniciadores de conversación para parejas</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">En el Trabajo</h4>
              <p>
                Los entornos profesionales piden temas que sean interesantes pero apropiados. Pregunta a tus
                colegas por proyectos recientes que les entusiasmen, tendencias del sector o planes para el fin de
                semana. Las conversaciones de pasillo generan confianza y buena sintonía, algo que, según los
                estudios, mejora directamente la colaboración en equipo y la satisfacción laboral.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Con Amigos</h4>
              <p>
                Incluso los amigos más cercanos pueden caer en rutinas de conversación. Rompe el patrón con
                preguntas hipotéticas («Si pudieras vivir en cualquier época, ¿cuál elegirías?»), propuestas
                nostálgicas o preguntas profundas sobre metas de vida. Para ideas frescas,
                explora <Link href="/es/topics/random-questions-to-ask-friends" className="text-[var(--neon-cyan)] hover:underline">preguntas al azar para hacer a los amigos</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Con la Familia</h4>
              <p>
                Las reuniones familiares se benefician de temas en los que todos puedan participar. Prueba a
                preguntar por la historia familiar, compartir anécdotas del tipo «¿te acuerdas de cuando…?» o
                hablar de planes próximos. Orienta la charla hacia asuntos que incluyan a todos, que tiendan
                puentes entre generaciones y que hagan que cada persona se sienta escuchada.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Consejos para Mejores Conversaciones
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Escucha de forma activa.</strong> Los mejores conversadores son grandes oyentes. Muestra interés genuino haciendo preguntas de seguimiento basadas en lo que dice la otra persona.</li>
                <li><strong>Comparte, no monologues.</strong> Busca un intercambio equilibrado. Después de responder tú mismo a una pregunta, devuélvesela a la otra persona.</li>
                <li><strong>Lee el ambiente.</strong> Presta atención al lenguaje corporal y a la energía. Si alguien parece incómodo con un tema, cambia con elegancia a algo más ligero.</li>
                <li><strong>Sé curioso, no juzgues.</strong> Aborda las opiniones distintas con curiosidad genuina. «Qué interesante, ¿qué te hizo pensar eso?» llega mucho más lejos que llevar la contraria.</li>
                <li><strong>Usa preguntas abiertas.</strong> Las preguntas que empiezan por «qué», «cómo» o «por qué» invitan a respuestas más largas y reflexivas que las de sí o no.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuáles son buenos iniciadores de conversación para personas tímidas?</h4>
              <p>
                Empieza con temas universales y de baja presión, como películas favoritas, viajes recientes o
                preferencias de comida. Halaga algo concreto («¡Qué buena chaqueta! ¿Dónde la conseguiste?») para
                crear un punto de entrada natural. Nuestro generador te permite elegir categorías más ligeras si
                prefieres un enfoque más suave.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cómo mantengo viva una conversación cuando se estanca?</h4>
              <p>
                Usa la técnica de «tirar del hilo»: retoma algo que la otra persona mencionó antes y hazle una
                pregunta más profunda al respecto. También puedes cambiar de sentido —«¿A qué sonaba, cómo se
                sentía o a qué sabía?»— para volver a activar su imaginación.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Son mejores los temas al azar que los planificados?</h4>
              <p>
                Ambos tienen su lugar. Los temas al azar aportan espontaneidad y sorpresa, lo que puede dar lugar
                a intercambios más auténticos. Los temas planificados funcionan bien en contextos estructurados,
                como eventos de networking. Nuestra herramienta une lo mejor de ambos: genera un tema al azar y
                luego llévalo hacia donde te resulte más natural.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuántos iniciadores de conversación tiene este generador?</h4>
              <p>
                Nuestra base de datos incluye más de 300 temas de conversación seleccionados a mano en más de 15
                categorías, y añadimos nuevos con regularidad. También puedes activar la generación con IA para
                conseguir temas únicos prácticamente ilimitados.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usarlos para practicar idiomas o clases de español como lengua extranjera?</h4>
              <p>
                Por supuesto. Muchos profesores de idiomas y parejas de intercambio usan temas de conversación al
                azar para practicar la fluidez. La variedad de asuntos ayuda a quienes aprenden a ampliar
                vocabulario en múltiples ámbitos mientras mantienen las sesiones de práctica interesantes.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
