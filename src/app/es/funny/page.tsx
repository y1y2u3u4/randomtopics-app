import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "Generador de Temas Divertidos al Azar | Preguntas Graciosas y Temas Raros para Charlar",
  },
  description:
    "Genera temas al azar divertidos, raros y disparatados que harán reír a todo el mundo. Iniciadores de conversación graciosos, preguntas de qué prefieres y temas absurdos para fiestas, juegos y grupos.",
  alternates: {
    canonical: "/es/funny",
    languages: hreflangAlternates("/funny"),
  },
  openGraph: {
    title:
      "Generador de Temas Divertidos al Azar | Preguntas Graciosas y Temas Raros para Charlar",
    description:
      "Genera temas al azar divertidos, raros y disparatados que harán reír a todo el mundo. Iniciadores de conversación graciosos y temas absurdos para fiestas, juegos y grupos.",
    url: `${SITE_URL}/es/funny`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

export default function FunnyPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas Divertidos" },
          ]}
        />
        <TopicGenerator
          initialCategory="weird-fun"
          locale="es"
          title="Generador de Temas Divertidos"
          subtitle="Temas graciosos, raros y maravillosamente disparatados que harán reír a todo el mundo."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              Por Qué Funcionan los Temas Divertidos
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                La risa es la forma más rápida de conectar con alguien. Los{" "}
                <strong>temas de conversación divertidos</strong> funcionan porque bajan las
                defensas, crean experiencias compartidas y hacen que la gente se sienta cómoda
                siendo ella misma. Cuando alguien pregunta «Si los animales pudieran hablar, ¿qué
                especie sería la más maleducada?», la sala se anima al instante: no porque la
                pregunta sea profunda, sino porque invita a jugar y a ser creativo.
              </p>
              <p>
                El humor también hace que las conversaciones sean más memorables. Los estudios
                demuestran que la gente recuerda mucho mejor la información presentada con humor que
                la que se transmite en serio. Por eso las mejores fiestas, pódcasts y quedadas
                apuestan por los <strong>temas raros</strong> y absurdos y por las{" "}
                <strong>preguntas graciosas</strong> que dan permiso a todos para hacer el tonto.
                Nuestro generador se especializa justo en este tipo de combustible para la
                conversación: preguntas inesperadas, un poco ridículas e imposibles de responder de
                forma aburrida.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cuándo Usar Temas de Conversación Divertidos
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Fiestas y Reuniones Sociales</h4>
              <p>
                Los temas divertidos son el motor de una gran fiesta. Úsalos como un juego: ve dando
                la vuelta por la sala y que cada persona responda una pregunta al azar del generador.
                Cuanto más rara sea la pregunta, mejores serán las respuestas. «¿Qué teoría de la
                conspiración inventarías?» y «¿Cuál es el peor superpoder que se te ocurre?» siempre
                provocan respuestas que arrancan carcajadas. Para más material listo para fiestas,
                explora los{" "}
                <Link href="/es/topics/funny-conversation-topics" className="text-[var(--neon-cyan)] hover:underline">temas de conversación divertidos</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Viajes por Carretera y Quedadas Largas</h4>
              <p>
                Nada mata antes un viaje por carretera que el silencio. Los temas divertidos al azar
                mantienen la energía alta durante trayectos largos, vuelos o tardes perezosas. También
                son perfectos para acampadas y fiestas de pijamas, donde tienes tiempo de dejar que
                las conversaciones se adentren en un territorio maravillosamente absurdo.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Romper Silencios Incómodos</h4>
              <p>
                Cuando la conversación se atasca, una pregunta absurda en el momento justo puede
                rescatar toda la velada. «Si tuvieras que comer un solo alimento el resto de tu vida,
                pero siempre estuviera ligeramente mal —como ensalada caliente o pizza fría—, ¿cuál
                elegirías?» La concreción de los temas divertidos los hace imposibles de ignorar.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Qué Prefieres e Hipótesis</h4>
              <p>
                El formato «qué prefieres» es uno de los generadores de conversación más fiables que
                se han inventado. Los mejores presentan dos opciones igual de absurdas o igual de
                terribles, lo que provoca debates apasionados y divertidísimos. Nuestro generador
                incluye decenas de ellos: echa un vistazo a las{" "}
                <Link href="/es/topics/would-you-rather-questions" className="text-[var(--neon-cyan)] hover:underline">preguntas de qué prefieres</Link> para
                acceder a una colección dedicada.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Consejos para Clavar los Temas Divertidos
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Comprométete con el chiste.</strong> Suelta la pregunta con cara seria. El contraste entre tu tono serio y la pregunta absurda la hace más graciosa.</li>
                <li><strong>Da tu propia respuesta primero.</strong> Dar ejemplo con una respuesta graciosa y genuina anima a los demás a igualar tu energía y a arriesgarse a ser creativos.</li>
                <li><strong>Construye sobre las respuestas.</strong> Las mejores conversaciones divertidas surgen cuando la gente improvisa a partir de lo que dicen los demás. Continúa con «Espera, ¿pero qué pasa con...?» para mantener el ritmo.</li>
                <li><strong>Lee al público.</strong> No todos los grupos aprecian el mismo humor. Empieza con un absurdo universalmente seguro antes de probar terreno más atrevido.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Qué hace que un tema sea «divertido» y no solo aleatorio?</h4>
              <p>
                Los temas divertidos tienen un elemento de sorpresa, absurdo o elección imposible. Un
                tema al azar podría ser «Habla sobre la exploración espacial»: interesante, pero no
                gracioso en sí mismo. Un tema divertido va más allá: «Si fueras la primera persona en
                Marte y solo pudieras llevar tres objetos completamente inútiles, ¿cuáles serían?» La
                restricción es lo que crea la comedia.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Son apropiados para entornos de trabajo?</h4>
              <p>
                Muchos de nuestros temas divertidos son aptos para el trabajo: piensa en escenarios
                hipotéticos y preguntas de preferencia, más que en nada atrevido. Aun así, lee siempre
                el ambiente. Lo que funciona en una comida informal de equipo puede no encajar en una
                reunión general formal. Nuestro generador te permite filtrar por categoría para
                encontrar el tono adecuado.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usarlos para juegos de fiesta?</h4>
              <p>
                Por supuesto: es uno de los usos más populares. Organiza una ronda en la que cada
                persona genere un tema y todos respondan, y luego votad la respuesta más graciosa.
                También puedes usarlos como estímulos para contar historias improvisadas o como
                iniciadores de conversación en eventos para hacer amigos rápidamente.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿En qué se diferencian los temas divertidos de los rompehielos?</h4>
              <p>
                Hay solapamiento, pero los temas divertidos priorizan el humor y el absurdo, mientras
                que los rompehielos priorizan la conexión y conseguir que la gente comparta. Un
                rompehielos podría ser «¿Cuál es tu talento oculto?», mientras que un tema divertido
                sería «¿Cuál es un talento que suena impresionante pero es completamente inútil?» Ambos
                inician conversaciones, pero la energía es distinta.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuántos temas divertidos tenéis?</h4>
              <p>
                Nuestra colección seleccionada incluye cientos de temas divertidos, raros y
                disparatados en varias categorías. Con la generación por IA activada, obtienes temas
                nuevos y únicos cada vez, así que nunca repetirás la misma pregunta dos veces.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
