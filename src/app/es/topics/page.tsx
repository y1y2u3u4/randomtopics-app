import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES_ES } from "@/data/seoContent.es";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";
import { withSocial } from "@/lib/metadata/social";

export const metadata: Metadata = withSocial({
  title: { absolute: "Listas y Guías de Temas — Colecciones para Cada Ocasión | Random Topics" },
  description:
    "Explora nuestras colecciones de temas de conversación, ideas de debate, ideas para escribir, preguntas rompehielos y mucho más. Encuentra los temas perfectos para cualquier situación.",
  alternates: { canonical: "/es/topics", languages: hreflangAlternates("/topics") },
});

export default function TopicsIndexPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Temas" }]} />

        <div className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-[1.1] tracking-tight">
            Colecciones de <span className="gradient-text">Temas</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed opacity-80">
            Listas seleccionadas de temas de conversación, ideas de debate, ideas para escribir y más, para cada ocasión.
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEO_ARTICLES_ES.map((article) => (
              <Link prefetch={false}
                key={article.slug}
                href={`/es/topics/${article.slug}`}
                className="glass-card p-6 transition-all duration-300 hover:translate-y-[-3px] group hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.05)] hover:to-transparent"
              >
                <h2 className="text-base font-bold mb-2 group-hover:text-[var(--neon-cyan)] transition-colors leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                  {article.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{article.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-display)" }}>Listas para jugar en español</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/es/topics/preguntas-incomodas", title: "Preguntas incómodas", detail: "45 preguntas limpias para amigos con confianza" },
              { href: "/es/topics/que-prefieres-pareja", title: "¿Qué prefieres? para parejas", detail: "45 dilemas de casa, planes y cariño" },
              { href: "/es/topics/verdad-o-reto-amigos", title: "Verdad o reto para amigos", detail: "45 verdades y retos sin contacto ni trampas" },
              { href: "/es/topics/preguntas-para-mi-novio", title: "Preguntas para mi novio", detail: "45 preguntas para conocerlo, no para examinarlo" },
              { href: "/es/topics/temas-de-conversacion-con-mi-novia", title: "Temas con mi novia", detail: "45 temas para hablar los dos" },
              { href: "/es/topics/yo-nunca-nunca-amigos", title: "Yo nunca para amigos", detail: "45 frases de hábitos, viajes y amistad" },
              { href: "/es/ruleta-de-nombres", title: "Ruleta de nombres", detail: "Gira y elige un ganador de tu lista" },
              { href: "/es/ruleta-si-o-no", title: "Ruleta sí o no", detail: "Sí, no o tal vez, con la misma probabilidad" },
              { href: "/es/ruleta-de-letras", title: "Ruleta de letras", detail: "Abecedario con Ñ para Basta o Stop" },
              { href: "/es/ruleta-de-numeros", title: "Ruleta de números", detail: "Del 1 al 20, o el rango que escribas" },
              { href: "/es/topics/preguntas-para-conocer-a-alguien", title: "Preguntas para conocer a alguien", detail: "45 preguntas distintas de la lista de 21" },
              { href: "/es/topics/verdad-o-reto-parejas", title: "Verdad o reto para parejas", detail: "45 verdades y retos sin explícitos" },
              { href: "/es/topics/que-prefieres-preguntas-dificiles", title: "¿Qué prefieres? difíciles", detail: "45 dilemas sin respuesta fácil" },
              { href: "/es/topics/temas-de-conversacion-para-whatsapp", title: "Temas para WhatsApp", detail: "45 mensajes cortos para copiar al chat" },
              { href: "/es/topics/juegos-para-whatsapp", title: "Juegos para WhatsApp", detail: "45 rondas que caben en un mensaje" },
              { href: "/es/topics/yo-nunca-nunca-picante", title: "Yo nunca picante", detail: "45 frases de coqueteo, sin explícitos" },
              { href: "/es/topics/preguntas-rompehielos-divertidas", title: "Rompehielos divertidos", detail: "45 preguntas para una fiesta" },
              { href: "/es/ruleta-de-preguntas", title: "Ruleta de preguntas", detail: "Gira y cae una pregunta para conocerse" },
              { href: "/es/ruleta-de-retos", title: "Ruleta de retos", detail: "Retos de sala, sin contacto" },
              { href: "/es/generador-de-nombres-aleatorios", title: "Nombres aleatorios", detail: "Nombre y apellido del mismo origen" },
            ].map((item) => (
              <Link prefetch={false} key={item.href} href={item.href} className="glass-card p-6 transition-all duration-300 hover:translate-y-[-3px] group hover:border-[var(--neon-cyan)]/40">
                <h3 className="text-base font-bold mb-2 group-hover:text-[var(--neon-cyan)] transition-colors leading-snug" style={{ fontFamily: "var(--font-display)" }}>{item.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.detail}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
