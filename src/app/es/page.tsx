import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { MODES, CATEGORIES } from "@/data/types";
import { MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas al Azar | Más de 500 Temas Gratis" },
  description:
    "Generador de temas al azar gratis con más de 500 temas seleccionados. Consigue al instante iniciadores de conversación, ideas para escribir, temas de debate y rompehielos en 16 categorías. Sin registro.",
  alternates: {
    canonical: "/es",
    languages: hreflangAlternates("/"),
  },
  openGraph: {
    title: "Generador de Temas al Azar | Más de 500 Temas Gratis",
    description:
      "Generador de temas al azar gratis con más de 500 temas. Iniciadores de conversación, ideas para escribir, temas de debate y rompehielos al instante. ¡Sin registro!",
    url: "https://randomtopics.app/es",
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const COLLECTIONS = [
  { title: "75 Mejores Temas de Debate para Estudiantes", href: "/es/topics/debate-topics-for-students" },
  { title: "50 Preguntas de Dilemas Éticos", href: "/es/topics/ethical-dilemma-questions" },
  { title: "65 Ideas de Presentación para la Escuela", href: "/es/topics/presentation-ideas-for-school" },
  { title: "70 Table Topics de Toastmasters", href: "/es/topics/toastmasters-table-topics" },
  { title: "60 Preguntas Profundas para tu Pareja", href: "/es/topics/deep-questions-to-ask-your-partner" },
  { title: "55 Rompehielos para Reuniones Virtuales", href: "/es/topics/icebreaker-questions-for-virtual-meetings" },
  { title: "75 Temas de Discurso para la Universidad", href: "/es/topics/speech-topics-for-college-students" },
  { title: "60 Temas de Ensayo al Azar para la Universidad", href: "/es/topics/random-essay-topics-for-college" },
  { title: "65 Preguntas para Conocer a Alguien", href: "/es/topics/get-to-know-you-questions-for-adults" },
];

const FAQ = [
  {
    q: "¿Qué es un generador de temas al azar?",
    a: "Un generador de temas al azar es una herramienta online que te ofrece al instante iniciadores de conversación, ideas para escribir, temas de debate, ideas para discursos y preguntas rompehielos, a partir de una base de datos seleccionada de más de 500 temas en más de 15 categorías.",
  },
  {
    q: "¿Cómo funciona el generador de temas?",
    a: "Elige un modo (conversación, escritura, debate, discurso o rompehielos), filtra opcionalmente por categoría y profundidad, elige cuántos temas quieres y pulsa Generar. La herramienta usa una base de datos seleccionada para ofrecerte temas relevantes al instante.",
  },
  {
    q: "¿El generador de temas es gratis?",
    a: "Sí, el generador de temas al azar es completamente gratis. Sin registro, sin inicio de sesión y sin límites. Genera todos los temas que necesites para conversaciones, escritura, debates, discursos y rompehielos.",
  },
  {
    q: "¿Qué categorías de temas hay disponibles?",
    a: "El generador incluye 16 categorías: Ciencia, Tecnología, Filosofía, Psicología, Historia, Arte y Cultura, Comida y Viajes, Relaciones, Educación, Política, Entretenimiento, Deportes, Negocios, Naturaleza, Salud y Raro y Divertido.",
  },
  {
    q: "¿Puedo usar los temas para actividades en clase?",
    a: "¡Por supuesto! Los profesores usan el generador de temas al azar para debates en clase, práctica de argumentación, temas de redacción y actividades en grupo. Filtra por categoría y nivel de profundidad para adaptarlo al curso y la asignatura de tus estudiantes.",
  },
];

export default function HomeEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <TopicGenerator locale="es" />

        {/* Social proof / stats bar */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>500+</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Temas Seleccionados</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>16</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Categorías</p>
            </div>
            <div className="glass-card p-5 text-center">
              <p className="text-2xl sm:text-3xl font-extrabold gradient-text" style={{ fontFamily: "var(--font-display)" }}>100%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Gratis, Sin Registro</p>
            </div>
          </div>
        </section>

        {/* Mode cards */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Elige tu <span className="gradient-text">Modo</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MODES.map((mode) => (
              <Link
                key={mode.slug}
                href={`/es/${mode.slug}`}
                className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group hover:border-[var(--neon-pink)]/40 hover:shadow-[0_0_20px_rgba(255,45,120,0.15)] hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
              >
                <span className="text-4xl mb-4 block drop-shadow-lg">{mode.emoji}</span>
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {MODE_LABELS.es[mode.id].label}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{MODE_LABELS.es[mode.id].description}</p>
              </Link>
            ))}
            <Link
              href="/es/funny"
              className="glass-card p-7 transition-all duration-300 hover:translate-y-[-4px] group hover:border-[var(--neon-pink)]/40 hover:shadow-[0_0_20px_rgba(255,45,120,0.15)] hover:bg-gradient-to-br hover:from-[rgba(255,45,120,0.06)] hover:to-transparent"
            >
              <span className="text-4xl mb-4 block drop-shadow-lg">😂</span>
              <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--neon-pink)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                Temas Divertidos
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Temas graciosos y disparatados que harán reír a todo el mundo
              </p>
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-12">
            Explora por <span className="gradient-text">Categoría</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/es/categories/${cat.id}`}
                className="glass-card p-4 sm:p-5 text-center transition-all duration-300 hover:translate-y-[-4px] group hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.06)] hover:to-transparent"
              >
                <span className="text-3xl mb-2 block drop-shadow-lg">{cat.emoji}</span>
                <span className="text-sm font-medium group-hover:text-[var(--neon-cyan)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {CATEGORY_LABELS.es[cat.id].label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* Collections CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-4">
            Listas de Temas <span className="gradient-text">Seleccionadas</span>
          </h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8 max-w-lg mx-auto">
            Explora nuestras colecciones de temas para debates, conversaciones, escritura, discursos y mucho más.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {COLLECTIONS.map((item) => (
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
            <Link href="/es/topics" className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
              Ver todas las colecciones de temas →
            </Link>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--neon-purple)]/20 to-transparent" />
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Generador de Temas al Azar",
              url: "https://randomtopics.app/es",
              applicationCategory: "UtilityApplication",
              operatingSystem: "Any",
              inLanguage: "es",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description:
                "Genera temas al azar para conversaciones, ideas para escribir, debates, discursos y rompehielos. Más de 500 temas seleccionados en más de 15 categorías.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              inLanguage: "es",
              mainEntity: FAQ.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-8 text-[var(--text-primary)]">
              ¿Qué es un Generador de Temas al Azar?
            </h2>
            <div className="space-y-5 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Un <strong>generador de temas al azar</strong> es una herramienta online que te ofrece al
                instante iniciadores de conversación, ideas para escribir, temas de debate, ideas para discursos
                y preguntas rompehielos. Tanto si te has quedado en blanco, si preparas una presentación o si
                simplemente buscas algo interesante de qué hablar, nuestro generador tiene lo que necesitas con
                más de 500 temas cuidadosamente seleccionados.
              </p>
              <p>
                A diferencia de un simple generador de palabras al azar, un <strong>generador de temas</strong>{" "}
                dedicado te da ideas de discusión completas, con puntos de conversación, niveles de profundidad y
                etiquetas de categoría. Cada tema está pensado para provocar una conversación con sentido, inspirar
                la escritura creativa o alimentar un debate animado.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>
                Cómo Usar el Generador de Temas
              </h3>
              <ol className="space-y-3 list-none pl-0">
                {[
                  ["Elige un modo", "conversación, escritura, debate, discurso o rompehielos, para adaptar los temas a tu necesidad."],
                  ["Filtra por categoría", "reduce opcionalmente los resultados a una categoría como ciencia, filosofía, historia o tecnología."],
                  ["Ajusta la profundidad", "elige entre temas ligeros, medios o profundos según tu público y contexto."],
                  ["Selecciona la cantidad", "genera 1, 3, 5 o 10 temas al azar a la vez."],
                  ["Pulsa Generar", "obtén temas al instante con puntos de conversación que puedes copiar y compartir con un clic."],
                ].map(([b, rest], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                    <span><strong>{b}</strong> — {rest}</span>
                  </li>
                ))}
              </ol>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>
                ¿Por Qué Usar un Generador de Temas?
              </h3>
              <p>
                Encontrar temas interesantes sobre la marcha es más difícil de lo que parece. Ya seas un profesor
                preparando la clase, un escritor ante una página en blanco o un líder de equipo organizando una
                reunión, un generador de temas al azar ahorra tiempo y elimina el esfuerzo mental de tener que
                improvisar ideas desde cero. Cada tema incluye varios puntos de conversación para ayudarte a
                explorar el asunto en profundidad.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>
                Temas para Conversaciones, Escritura, Debates y Discursos
              </h3>
              <p>
                En modo <strong>conversación</strong>, descubre preguntas que invitan a reflexionar para primeras
                citas, eventos de networking o quedadas con amigos. En modo <strong>escritura</strong>, supera el
                bloqueo del escritor con ideas para ensayos, artículos de blog, relatos y diarios. En modo{" "}
                <strong>debate</strong>, encuentra temas con posturas claras a favor y en contra que fomentan el
                pensamiento crítico. Y en modo <strong>discurso</strong>, consigue ideas listas para presentar con
                puntos de conversación que sirven de esquema.
              </p>

              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>
                Preguntas Frecuentes
              </h3>
              <div className="space-y-4">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <p className="font-medium text-[var(--text-primary)]">{f.q}</p>
                    <p>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
