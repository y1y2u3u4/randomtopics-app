import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Ideas para Escribir — Más de 500 Propuestas y Temas de Ensayo | Random Topics" },
  description:
    "Supera el bloqueo del escritor con un clic: más de 500 ideas para escribir gratis —narrativas, persuasivas, descriptivas y expositivas— para niños, estudiantes y adultos. Sin registro, sin anuncios y generación ilimitada con IA.",
  keywords: [
    "generador de ideas para escribir",
    "ideas para escribir",
    "ideas para escribir al azar",
    "ideas para relatos",
    "temas de ensayo",
    "ideas de escritura creativa",
    "ideas para el diario",
    "generador de temas de ensayo al azar",
  ],
  alternates: {
    canonical: "/es/writing",
    languages: hreflangAlternates("/writing"),
  },
  openGraph: {
    title: "Generador de Ideas para Escribir — Más de 500 Propuestas y Temas de Ensayo",
    description:
      "Supera el bloqueo del escritor con un clic: más de 500 ideas para escribir gratis —narrativas, persuasivas, descriptivas y expositivas— para niños, estudiantes y adultos. Sin registro.",
    url: `${SITE_URL}/es/writing`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo ayudan las ideas para escribir con el bloqueo del escritor?",
    answer:
      "El bloqueo del escritor suele venir de la presión de decidir sobre qué escribir. Las propuestas eliminan esa decisión por completo: solo tienes que responder a lo que se te da. Eso rebaja la barrera para empezar, y una vez que escribes, el impulso hace el resto.",
  },
  {
    question: "¿Puedo usar estas propuestas para trabajos de clase?",
    answer:
      "Sí. Nuestras propuestas cubren la escritura narrativa, persuasiva, descriptiva y expositiva, los cuatro tipos principales que se enseñan en clase. Los profesores pueden usar el generador en el aula y los estudiantes pueden usarlo para practicar o para tener ideas de ensayo.",
  },
  {
    question: "¿Y si no me gusta la propuesta que me toca?",
    answer:
      "Simplemente genera otra. Aun así, te animamos a probar propuestas que te resulten incómodas: escribir fuera de tu zona de confort es donde más se crece.",
  },
  {
    question: "¿Sirven estas propuestas para llevar un diario?",
    answer:
      "Muchas de nuestras propuestas funcionan de maravilla como entradas de diario, sobre todo las de las categorías de reflexión personal y autoconocimiento. Escribir un diario a partir de propuestas aporta estructura a la práctica.",
  },
  {
    question: "¿Cuántas ideas para escribir hay disponibles?",
    answer:
      "Nuestra base de datos seleccionada contiene más de 500 ideas para escribir en más de 15 categorías. Con la generación con IA activada, puedes acceder a propuestas únicas prácticamente ilimitadas y adaptadas a cualquier género, edad o nivel de dificultad.",
  },
];

export default function WritingPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Ideas para Escribir" },
          ]}
        />
        <TopicGenerator
          initialMode="writing"
          locale="es"
          title="Generador de Ideas para Escribir"
          subtitle="Despierta tu creatividad con ideas para escribir al azar de cualquier género y tema."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              ¿Qué Son las Ideas para Escribir?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Una <strong>idea para escribir</strong> es un punto de partida: una pregunta, un escenario o un
                concepto pensado para encender tu imaginación y hacer que las palabras fluyan sobre la página. Los
                escritores de todos los niveles usan estas propuestas para superar el miedo a la página en blanco,
                practicar nuevos géneros y desarrollar su oficio. Los autores profesionales las usan como ejercicio
                de calentamiento, los profesores las asignan para desarrollar las habilidades de escritura de los
                estudiantes y los aficionados las usan para explorar <strong>ideas de escritura creativa</strong>{" "}
                que quizá nunca se les habrían ocurrido por sí solos.
              </p>
              <p>
                Nuestro generador ofrece más de 500 <strong>ideas para escribir</strong> seleccionadas que abarcan
                ficción, no ficción, poesía y escritura académica. Cada propuesta está pensada para ser lo bastante
                abierta como para permitir una interpretación personal y, a la vez, lo bastante concreta como para
                dar rumbo y foco a tu escritura. Tanto si necesitas un <strong>tema de ensayo</strong> para clase
                como una semilla de historia para tu próxima novela, aquí lo encontrarás.
              </p>
              <p>
                ¿Buscas otros tipos de propuestas? Combina esta herramienta con nuestro <Link href="/es/debate" className="text-[var(--neon-cyan)] hover:underline">generador de temas de debate</Link> para
                ensayos argumentativos, el <Link href="/es/conversation" className="text-[var(--neon-cyan)] hover:underline">generador de temas de conversación</Link> para
                practicar diálogos, o explora <Link href="/es/topics/random-essay-topics-for-college" className="text-[var(--neon-cyan)] hover:underline">temas de ensayo para la universidad</Link> ya preparados.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Tipos de Ideas para Escribir
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Propuestas Narrativas</h4>
              <p>
                Las propuestas narrativas te piden que cuentes una historia. Pueden darte un personaje, un
                escenario o un conflicto sobre el que construir. Algunos ejemplos son «Escribe sobre una persona
                que descubre una puerta en su casa que nunca había visto» o «Cuenta la historia del peor día de la
                vida de alguien que acabó siendo el mejor». Estas propuestas desarrollan la construcción de la
                trama, el desarrollo de personajes y el instinto narrativo.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Propuestas Persuasivas</h4>
              <p>
                Las propuestas persuasivas te retan a tomar una postura y defenderla con lógica y pruebas. Son
                ideales para practicar ensayos argumentativos, artículos de opinión y pensamiento crítico. Una
                escritura persuasiva sólida exige entender ambos lados de una cuestión, una habilidad que se
                traslada directamente al éxito académico y profesional.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Propuestas Descriptivas</h4>
              <p>
                Estas propuestas se centran en pintar imágenes vívidas con palabras. Puede que te pidan describir
                un lugar usando solo sonidos y olores, o captar la sensación de un momento concreto. La escritura
                descriptiva desarrolla tu vocabulario sensorial y te enseña a mostrar en lugar de contar, una
                habilidad fundamental en toda la escritura creativa.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Propuestas Expositivas</h4>
              <p>
                Las propuestas expositivas te piden explicar, informar o analizar. Son la columna vertebral de la
                escritura académica e incluyen tareas como «Explica cómo una tecnología concreta ha cambiado la
                vida diaria» o «Compara dos formas de resolver un problema social». Desarrollan la claridad, la
                organización y la capacidad de comunicar ideas complejas de forma sencilla.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Usar las Ideas para Escribir con Eficacia
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Pon un cronómetro.</strong> Concédete de 10 a 20 minutos y escribe sin parar. El objetivo es silenciar a tu editor interior y dejar que las ideas fluyan con libertad.</li>
                <li><strong>No busques la perfección.</strong> Las propuestas son práctica, no publicación. Permítete escribir mal: siempre puedes revisar después. El acto de escribir importa más que el resultado.</li>
                <li><strong>Dale la vuelta a la propuesta.</strong> Si una propuesta dice «Escribe sobre un héroe», prueba a escribir desde la perspectiva del villano. Hacer tuyas las propuestas fortalece la confianza creativa.</li>
                <li><strong>Escribe con regularidad.</strong> El mayor beneficio de las propuestas viene de la constancia. Incluso 15 minutos de escritura diaria mejoran enormemente la fluidez y la voz con el tiempo.</li>
                <li><strong>Úsalas como calentamiento.</strong> Muchos escritores profesionales dedican 10 minutos a una propuesta antes de pasar a su proyecto principal. Sirve para desentumecer los músculos creativos.</li>
              </ul>
              <p>
                Para los más pequeños, nuestra colección
                de <Link href="/es/topics/writing-prompts-for-kids" className="text-[var(--neon-cyan)] hover:underline">ideas para escribir para niños</Link> ofrece
                escenarios adecuados a su edad que hacen que escribir sea divertido en lugar de intimidante.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cómo ayudan las ideas para escribir con el bloqueo del escritor?</h4>
              <p>
                El bloqueo del escritor suele venir de la presión de decidir sobre qué escribir. Las propuestas
                eliminan esa decisión por completo: solo tienes que responder a lo que se te da. Eso rebaja la
                barrera para empezar, y una vez que escribes, el impulso hace el resto. Muchos escritores descubren
                que las sesiones basadas en propuestas les llevan a ideas que luego usan en su trabajo principal.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usar estas propuestas para trabajos de clase?</h4>
              <p>
                Sí. Nuestras propuestas cubren la escritura narrativa, persuasiva, descriptiva y expositiva, los
                cuatro tipos principales que se enseñan en clase. Los profesores pueden usar el generador en el
                aula y los estudiantes pueden usarlo para practicar o para tener ideas de ensayo.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Y si no me gusta la propuesta que me toca?</h4>
              <p>
                Simplemente genera otra. Aun así, te animamos a probar propuestas que te resulten incómodas:
                escribir fuera de tu zona de confort es donde más se crece. Algunas de las mejores historias nacen
                de propuestas que los escritores querían saltarse al principio.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Sirven estas propuestas para llevar un diario?</h4>
              <p>
                Muchas de nuestras propuestas funcionan de maravilla como entradas de diario, sobre todo las de las
                categorías de reflexión personal y autoconocimiento. Escribir un diario a partir de propuestas
                aporta estructura a la práctica y te ayuda a explorar temas que quizá no se te ocurrirían por ti
                mismo.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuántas ideas para escribir hay disponibles?</h4>
              <p>
                Nuestra base de datos seleccionada contiene más de 500 ideas para escribir en más de 15 categorías.
                Con la generación con IA activada, puedes acceder a propuestas únicas prácticamente ilimitadas y
                adaptadas a cualquier género, edad o nivel de dificultad.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
