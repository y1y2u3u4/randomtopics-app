import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Contacto | Random Topics" },
  description:
    "Contacta con randomtopics.app: reporta un tema inadecuado, sugiere un generador, pregunta por el widget o haz una solicitud de privacidad.",
  alternates: {
    canonical: "/es/contact",
    languages: hreflangAlternates("/contact"),
  },
};

const motivos = [
  {
    emoji: "🚩",
    title: "Reportar un tema",
    body: "Si un generador ha mostrado algo inadecuado, confuso o simplemente incorrecto, dinos qué generador era y qué apareció. Revisamos todos los avisos y eliminamos o reescribimos la entrada.",
  },
  {
    emoji: "💡",
    title: "Sugerir un generador o tema",
    body: "Profesores, clubes de oratoria y anfitriones de fiestas nos envían nuestras mejores ideas. Si echas de menos una lista que no existe, descríbela y estudiaremos crearla.",
  },
  {
    emoji: "🔗",
    title: "Insertar el widget y licencias",
    body: "¿Quieres el widget en la web de tu centro, club o equipo? El código para insertarlo es gratuito: encontrarás el fragmento y las condiciones en la página de prensa.",
  },
  {
    emoji: "🔒",
    title: "Preguntas de privacidad",
    body: "Dudas sobre cookies, publicidad o tus datos, incluidas solicitudes del RGPD y la CCPA. No tenemos cuentas ni datos personales, pero responderemos a cualquier solicitud.",
  },
];

export default function ContactPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1 px-4 sm:px-6 py-12" lang="es">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Header */}
          <section className="text-center space-y-4">
            <h1
              className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="gradient-text">Contacto</span>
            </h1>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              randomtopics.app lo lleva un equipo pequeño e independiente. Una persona
              lee todos los mensajes y solemos responder en dos días laborables.
            </p>
          </section>

          {/* Primary contact */}
          <section className="glass-card p-8 space-y-4 text-center">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Correo electrónico
            </h2>
            <p>
              <a
                href="mailto:zhanggongqing1314007@gmail.com"
                className="text-xl font-semibold text-[var(--accent-blue)] hover:underline"
              >
                zhanggongqing1314007@gmail.com
              </a>
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Para prensa y medios, escribe a{" "}
              <a
                href="mailto:press@randomtopics.app"
                className="text-[var(--accent-blue)] hover:underline"
              >
                press@randomtopics.app
              </a>{" "}
              — los materiales están en nuestra{" "}
              <Link href="/es/press" className="text-[var(--accent-blue)] hover:underline">
                página de prensa
              </Link>
              .
            </p>
          </section>

          {/* Motivos */}
          {motivos.map((motivo) => (
            <section key={motivo.title} className="glass-card p-8 space-y-4">
              <h2
                className="text-2xl font-semibold text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {motivo.emoji} {motivo.title}
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{motivo.body}</p>
            </section>
          ))}

          {/* Pointers */}
          <section className="glass-card p-8 space-y-4">
            <h2
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Antes de escribir
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Cómo tratamos los datos y la publicidad está explicado en nuestra{" "}
              <Link href="/es/privacy" className="text-[var(--accent-blue)] hover:underline">
                Política de Privacidad
              </Link>
              , y las normas de uso de los generadores están en los{" "}
              <Link href="/es/terms" className="text-[var(--accent-blue)] hover:underline">
                Términos del Servicio
              </Link>
              . Puedes saber más sobre quién está detrás en la página{" "}
              <Link href="/es/about" className="text-[var(--accent-blue)] hover:underline">
                sobre nosotros
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
