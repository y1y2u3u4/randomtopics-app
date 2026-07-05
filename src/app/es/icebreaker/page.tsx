import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Preguntas Rompehielos al Azar | Team Building y para Conocerse | Random Topics" },
  description:
    "Genera preguntas rompehielos al azar para reuniones, team building, aulas y eventos virtuales. Más de 300 preguntas para conocerse que hacen hablar, reír y conectar a cualquier grupo al instante.",
  keywords: [
    "preguntas rompehielos",
    "generador de rompehielos",
    "preguntas rompehielos para el trabajo",
    "preguntas de team building",
    "preguntas para conocerse",
    "preguntas rompehielos para reuniones",
    "preguntas rompehielos virtuales",
    "preguntas rompehielos divertidas",
  ],
  alternates: {
    canonical: "/es/icebreaker",
    languages: hreflangAlternates("/icebreaker"),
  },
  openGraph: {
    title: "Generador de Preguntas Rompehielos al Azar | Team Building y para Conocerse",
    description:
      "Genera preguntas rompehielos al azar para reuniones, team building, aulas y eventos virtuales. Más de 300 preguntas para conocerse que hacen hablar, reír y conectar a cualquier grupo al instante.",
    url: `${SITE_URL}/es/icebreaker`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

export default function IcebreakerPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Preguntas Rompehielos" },
          ]}
        />
        <TopicGenerator
          initialMode="icebreaker"
          locale="es"
          title="Generador de Preguntas Rompehielos"
          subtitle="Preguntas rompehielos divertidas para hacer que cualquier grupo hable, ría y conecte."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              ¿Qué Son las Preguntas Rompehielos?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Las <strong>preguntas rompehielos</strong> son propuestas breves y cercanas, pensadas para ayudar
                a las personas de un grupo a abrirse, compartir algo sobre sí mismas y crear conexiones con
                rapidez. Se llaman «rompehielos» porque atraviesan la incomodidad inicial que aparece cuando las
                personas no se conocen bien, o cuando un grupo necesita un chute de energía. Desde «¿Cuál es tu
                canción estrella para el karaoke?» hasta «Si pudieras cenar con cualquier persona de la historia,
                ¿con quién sería?», la pregunta adecuada marca el tono de todo lo que viene después.
              </p>
              <p>
                La investigación en psicología organizacional demuestra de forma constante que los equipos que
                participan en una interacción social estructurada —aunque sean breves rompehielos— colaboran de
                forma más eficaz, se comunican con más apertura y declaran mayor satisfacción laboral. Nuestro
                generador ofrece cientos de <strong>preguntas para conocerse</strong> y <strong>preguntas de team
                building</strong> ya probadas, aptas para cualquier tamaño de grupo, contexto o nivel de
                formalidad.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Los Mejores Rompehielos Según el Contexto
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Trabajo y Reuniones</h4>
              <p>
                Los primeros minutos de una reunión definen toda su energía. Empezar con un rompehielos rápido
                —«¿Qué es lo mejor que te ha pasado esta semana?» o «¿Qué habilidad te encantaría aprender?»—
                anima la sala y hace que la gente esté más dispuesta a participar después. Mantén los rompehielos
                del trabajo profesionales pero lo bastante personales como para que resulten genuinos. Para
                opciones seleccionadas, consulta <Link href="/es/topics/icebreaker-questions-for-work" className="text-[var(--neon-cyan)] hover:underline">preguntas rompehielos para el trabajo</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Aula y Educación</h4>
              <p>
                Los profesores usan rompehielos al comienzo del curso, después de las vacaciones o al formar
                grupos nuevos. Los buenos rompehielos para el aula son inclusivos, de baja exposición y divertidos.
                «Si fueras un superhéroe, ¿cuál sería tu poder?» funciona con los más pequeños, mientras que «¿Qué
                es una cosa que la mayoría de la gente no sabe de ti?» encaja con estudiantes mayores. La clave es
                crear un espacio seguro en el que toda respuesta sea válida.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Equipos Virtuales y Remotos</h4>
              <p>
                El trabajo en remoto hace que los rompehielos sean más importantes, no menos. Sin conversaciones
                de pasillo ni charlas durante la comida, los equipos virtuales necesitan momentos de conexión
                intencionados. Las preguntas que revelan personalidad —«Enséñanos algo de tu escritorio que tenga
                una historia» o «¿Cuál es tu placer culpable trabajando desde casa?»— salvan la distancia física y
                humanizan las caras de la pantalla.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Eventos Sociales y Fiestas</h4>
              <p>
                En fiestas o encuentros sociales, los rompehielos deben ser divertidos y sorprendentes. Las
                preguntas hipotéticas, los dilemas del tipo «¿qué prefieres?» y las preguntas de preferencias
                peculiares funcionan de maravilla. El objetivo es la risa y la curiosidad, no la reflexión
                profunda. Para opciones orientadas al equipo, explora
                nuestra colección de <Link href="/es/topics/team-building-questions" className="text-[var(--neon-cyan)] hover:underline">preguntas de team building</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Consejos para Rompehielos Eficaces
              </h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><strong>Ajusta la energía a la sala.</strong> Un grupo animado quizá disfrute preguntas disparatadas, mientras que un grupo más reservado necesita propuestas más suaves. Lee el ambiente antes de elegir.</li>
                <li><strong>Ve primero.</strong> Como facilitador, responde tú primero a tu propia pregunta. Eso marca el tono, muestra cercanía y da a los demás un modelo de cuánto compartir.</li>
                <li><strong>Que sea voluntario.</strong> Nunca obligues a nadie a responder. Ofrece la opción de «paso»: paradójicamente, la gente participa más cuando sabe que no está obligada.</li>
                <li><strong>Elige bien el momento.</strong> Los rompehielos funcionan mejor justo al principio de un encuentro. No intentes colar uno cuando la gente ya se ha metido en modo trabajo.</li>
                <li><strong>Evita lo demasiado personal.</strong> Las preguntas sobre relaciones, dinero o salud pueden incomodar. Cíñete a preferencias, experiencias e hipótesis.</li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuántas preguntas rompehielos debo preparar para una reunión?</h4>
              <p>
                Una pregunta suele bastar para una reunión estándar. Para talleres o retiros más largos, prepara
                de 3 a 5 preguntas y úsalas en distintos momentos del día. Nuestro generador facilita guardar
                varias preguntas para usarlas más tarde.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuál es el tamaño de grupo ideal para los rompehielos?</h4>
              <p>
                Los rompehielos en los que todos participan funcionan mejor con grupos de 4 a 12 personas. Para
                grupos más grandes, haz que la gente comparta primero en parejas o en mesas pequeñas y luego
                invita a unos cuantos voluntarios a compartir con toda la sala. Así la actividad no se hace pesada
                y se siguen creando conexiones.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Son eficaces los rompehielos para las reuniones virtuales?</h4>
              <p>
                Sí, a menudo más que en persona, porque las reuniones virtuales carecen de esa charla informal
                espontánea que surge antes de las reuniones presenciales. Un rompehielos rápido en los primeros 2
                minutos de una videollamada mejora notablemente la participación durante el resto de la reunión.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Y si la gente protesta ante los rompehielos?</h4>
              <p>
                Reconócelo con humor: «Ya lo sé, ya lo sé, pero confiad en mí: este es bueno». A menudo, quienes
                más protestan acaban dando las mejores respuestas. La clave está en elegir preguntas de verdad
                interesantes en lugar de genéricas como «¿Cuál es tu color favorito?».
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usar estos rompehielos para citas o situaciones a solas?</h4>
              <p>
                Muchas de nuestras preguntas rompehielos funcionan de maravilla en contextos a solas, como citas o
                amistades nuevas. Busca preguntas en las categorías de «para conocerse» e «hipotéticas» para
                obtener los mejores resultados en entornos más íntimos.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
