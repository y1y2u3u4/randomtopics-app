import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Acerca de | Random Topics" },
  description:
    "Conoce Random Topics: el generador de temas al azar gratuito para conversaciones, escritura, debates, discursos y rompehielos.",
  alternates: {
    canonical: "/es/about",
    languages: hreflangAlternates("/about"),
  },
};

export default function AboutPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12" lang="es">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Hero */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Acerca de <span className="gradient-text">RandomTopics</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
              Una herramienta gratuita con más de 500 temas seleccionados para
              iniciar conversaciones, despertar la creatividad y hacer que cada
              interacción sea más interesante.
            </p>
          </section>

          {/* What is RandomTopics */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ¿Qué es RandomTopics?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              RandomTopics es un generador de temas al azar gratuito que te da
              acceso instantáneo a más de 500 temas seleccionados a mano en más
              de 15 categorías. Ya necesites un iniciador de conversación, una
              idea para escribir, una moción de debate, una idea para un discurso
              o una pregunta rompehielos, aquí lo tienes cubierto.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Cada tema se selecciona cuidadosamente para que invite a
              reflexionar, resulte atractivo y sea adecuado para una amplia
              variedad de públicos y contextos.
            </p>
          </section>

          {/* Why We Built It */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Por Qué lo Creamos
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Creemos que nadie debería quedarse nunca sin cosas interesantes de
              qué hablar. Tanto si eres un profesor que busca iniciadores para el
              debate en clase, un escritor luchando contra el bloqueo creativo o
              un grupo de amigos que quiere ir más allá de la charla trivial,
              encontrar el tema adecuado debería ser fácil.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Por eso creamos RandomTopics &mdash; una herramienta sencilla,
              rápida y completamente gratuita que ofrece ideas frescas con un
              solo clic.
            </p>
          </section>

          {/* How It Works */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cómo Funciona
            </h2>
            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">1.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Elige un modo
                  </strong>{" "}
                  &mdash; Conversación, Escritura, Debate, Discurso o
                  Rompehielos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">2.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Pulsa Generar
                  </strong>{" "}
                  &mdash; Obtén un tema al azar al instante.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-xl mt-0.5">3.</span>
                <span>
                  <strong className="text-[var(--text-primary)]">
                    Úsalo
                  </strong>{" "}
                  &mdash; Guarda tus favoritos, compártelos o ponte manos a la
                  obra.
                </span>
              </li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed pt-2">
              Sin registro. Sin muros de pago. Sin anuncios que te tapen la
              vista. Solo resultados al instante, siempre.
            </p>
          </section>

          {/* Who It's For */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Para Quién Es
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  emoji: "👩‍🏫",
                  title: "Profesores y Educadores",
                  desc: "Impulsa debates en clase y ejercicios de pensamiento crítico.",
                },
                {
                  emoji: "✍️",
                  title: "Escritores y Creativos",
                  desc: "Supera el bloqueo del escritor con ideas y perspectivas frescas.",
                },
                {
                  emoji: "🎤",
                  title: "Equipos de Debate y Oradores",
                  desc: "Practica con mociones variadas y temas de discurso al momento.",
                },
                {
                  emoji: "👋",
                  title: "Amigos y Equipos",
                  desc: "Rompe el hielo en reuniones, fiestas o quedadas informales.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <h3
                    className="font-semibold text-[var(--text-primary)] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center space-y-4 pb-4">
            <p className="text-[var(--text-secondary)]">
              ¿Listo para descubrir tu próximo gran tema?
            </p>
            <a
              href="/es"
              className="btn-generate inline-block"
            >
              Empezar a Generar
            </a>
          </section>
        </div>
      </main>
      <Footer locale="es" />
    </>
  );
}
