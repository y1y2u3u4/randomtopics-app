import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Generador de Temas de Debate al Azar — Más de 300 Temas con Argumentos a Favor y en Contra | Random Topics" },
  description:
    "Genera temas de debate al azar al instante: más de 300 temas argumentativos con puntos a favor y en contra para el aula, los clubes de debate y las rondas de práctica. También funciona como generador de argumentos al azar para ensayos y discusiones. Gratis, sin registro.",
  keywords: [
    "generador de temas de debate",
    "generador de temas de debate al azar",
    "generador de debates",
    "generador de debates al azar",
    "generador de preguntas de debate",
    "generador de argumentos al azar",
    "temas de debate",
    "temas de debate al azar",
  ],
  alternates: {
    canonical: "/es/debate",
    languages: hreflangAlternates("/debate"),
  },
  openGraph: {
    title: "Generador de Temas de Debate al Azar — Más de 300 Temas con Argumentos a Favor y en Contra",
    description:
      "Genera temas de debate al azar al instante: más de 300 temas argumentativos con puntos a favor y en contra para el aula, los clubes de debate y las rondas de práctica. Gratis, sin registro.",
    url: `${SITE_URL}/es/debate`,
    siteName: "Random Topics",
    locale: "es_ES",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cuáles son los mejores temas de debate para principiantes?",
    answer:
      "Empieza con temas en los que ambos lados sean intuitivos y no requieran conocimientos especializados. Algunos ejemplos son «¿Debería eliminarse la tarea escolar?» o «¿Hacen las redes sociales más daño que bien?». Así los principiantes pueden centrarse en la estructura del argumento en lugar de luchar con un asunto desconocido.",
  },
  {
    question: "¿Cómo elijo un tema de debate para mi clase?",
    answer:
      "Ten en cuenta la edad, los intereses y los objetivos de aprendizaje de tus estudiantes. Un buen tema de debate para el aula es apropiado para su edad, conecta con el temario y tiene suficiente matiz como para que los estudiantes no puedan descartar un lado de golpe.",
  },
  {
    question: "¿Cuál es la diferencia entre un tema de debate y un tema de discusión?",
    answer:
      "Un tema de debate toma una postura (p. ej., «Las redes sociales deberían prohibirse para menores de 16 años») que puede defenderse a favor o en contra. Un tema de discusión es más abierto (p. ej., «¿Cómo afectan las redes sociales a los niños?»). Nuestro generador ofrece propuestas listas para debatir con posturas claras.",
  },
  {
    question: "¿Puedo usar estos temas para escribir ensayos?",
    answer:
      "Por supuesto. Cada tema de debate de aquí sirve también como excelente tema de ensayo argumentativo. La estructura a favor/en contra se traslada directamente al formato de un ensayo persuasivo de cinco párrafos.",
  },
  {
    question: "¿Con qué frecuencia se añaden nuevos temas de debate?",
    answer:
      "Actualizamos con regularidad nuestra base de datos de temas para reflejar la actualidad y las cuestiones emergentes. También puedes activar la generación de temas con IA para conseguir propuestas de debate únicas y en tiempo real sobre prácticamente cualquier asunto.",
  },
];

export default function DebatePageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas de Debate" },
          ]}
        />
        <TopicGenerator
          initialMode="debate"
          locale="es"
          title="Generador de Temas de Debate"
          subtitle="Encuentra temas de debate que invitan a reflexionar, con argumentos claros para ambos lados."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">
              ¿Qué Hace Bueno a un Tema de Debate?
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Un buen <strong>tema de debate</strong> tiene dos cualidades esenciales: se puede argumentar de
                verdad desde ambos lados y le importa al público. Los mejores temas se sitúan en una zona gris
                donde personas razonables discrepan, no porque les falte información, sino porque tienen valores o
                prioridades distintas. Temas como «¿Deberían regularse las redes sociales?» o «¿Es mejor el
                teletrabajo que el trabajo en la oficina?» generan argumentos apasionados precisamente porque no
                hay una respuesta objetivamente correcta.
              </p>
              <p>
                Nuestro generador selecciona <strong>temas argumentativos</strong> de política, tecnología, ética,
                educación y mucho más, cada uno elegido porque admite <strong>argumentos convincentes a favor y en
                contra</strong>. Ya te prepares para un torneo de debate competitivo o dirijas una discusión en
                clase, estos temas retarán a los participantes a pensar de forma crítica y a articular sus
                posturas con claridad. Para temas específicos de estudiantes, consulta
                nuestra guía de <Link href="/es/topics/debate-topics-for-students" className="text-[var(--neon-cyan)] hover:underline">temas de debate para estudiantes</Link>.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Los Formatos de Debate Explicados
              </h3>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Lincoln-Douglas (LD)</h4>
              <p>
                Un formato uno contra uno centrado en valores y principios filosóficos. Un debatiente defiende la
                postura afirmativa mientras el otro defiende la negativa. Los debates LD suelen girar en torno a
                cuestiones morales o éticas, lo que hace que nuestros temas de ética y filosofía sean
                especialmente útiles para este formato. Cada lado dispone de un tiempo de intervención
                estructurado con turnos de repreguntas.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Debate Parlamentario</h4>
              <p>
                Equipos de dos argumentan a favor o en contra de una moción, con tiempo de preparación limitado.
                Este formato premia el pensamiento rápido y la oratoria persuasiva. El equipo del gobierno propone
                un caso y la oposición debe rebatirlo sobre la marcha. El debate parlamentario es popular en
                universidades de todo el mundo y reproduce procesos legislativos reales.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Debate de Políticas</h4>
              <p>
                Un formato intensivo en investigación en el que los equipos discuten si debería adoptarse un
                cambio de política concreto. Los debatientes deben presentar pruebas, responder a los
                contraargumentos y demostrar que su plan produce más beneficios que perjuicios. Nuestros temas de
                tecnología y gobierno funcionan especialmente bien para practicar el debate de políticas.
              </p>

              <h4 className="text-base font-semibold text-[var(--neon-pink)] pt-2">Foro Público</h4>
              <p>
                Diseñado para ser accesible a un público general, el Foro Público enfrenta a equipos de dos
                personas que debaten sobre la actualidad. El énfasis está en la persuasión y la claridad más que
                en la jerga técnica. Es uno de los formatos de debate de mayor crecimiento en los institutos de
                todo Estados Unidos.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Cómo Prepararse para un Debate
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Investiga ambos lados.</strong> Aunque sepas qué postura defenderás, entender los mejores argumentos del rival te ayuda a preparar réplicas y a no quedarte descolocado.</li>
                <li><strong>Construye una estructura clara.</strong> Organiza tu argumento en 2 o 3 puntos principales, cada uno respaldado por pruebas. Un flujo lógico —afirmación, justificación, impacto— hace que tu caso sea persuasivo.</li>
                <li><strong>Anticipa los contraargumentos.</strong> Por cada punto que plantees, pregúntate «¿Cómo respondería el otro lado?» y prepara tu respuesta de antemano.</li>
                <li><strong>Practica la exposición.</strong> Los buenos argumentos pierden fuerza si se exponen mal. Practica hablar con claridad, mantener el contacto visual y gestionar tu tiempo.</li>
                <li><strong>Mantén la calma bajo presión.</strong> Los debates competitivos se caldean. Suele ganar quien conserva la compostura y responde a los argumentos, no a las emociones.</li>
              </ol>
              <p>
                ¿Quieres explorar temas que rompen esquemas? Echa un vistazo a
                nuestros <Link href="/es/topics/controversial-topics-to-discuss" className="text-[var(--neon-cyan)] hover:underline">temas controvertidos para discutir</Link> para
                debates que de verdad desafían el pensamiento convencional.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Úsalo como Generador de Argumentos al Azar
              </h3>
              <p>
                Cada tema de aquí funciona también como <strong>generador de argumentos al azar</strong>: cada
                propuesta viene con puntos de conversación que puedes desarrollar en argumentos para cualquiera de
                los dos lados. Los profesores lo usan para asignar posturas sorpresa en clase, quienes escriben
                ensayos lo usan para encontrar un <strong>tema de ensayo argumentativo</strong> con estructura de
                pros y contras incorporada, y los clubes de debate lo usan para hacer rondas improvisadas donde
                cada participante defiende el lado que le toque. Pulsa Generar, toma el lado que te asignen y
                construye tu caso: defender una postura que no compartes es la forma más rápida de afinar tu
                razonamiento.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Preguntas Frecuentes
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuáles son los mejores temas de debate para principiantes?</h4>
              <p>
                Empieza con temas en los que ambos lados sean intuitivos y no requieran conocimientos
                especializados. Algunos ejemplos son «¿Debería eliminarse la tarea escolar?» o «¿Hacen las redes
                sociales más daño que bien?». Así los principiantes pueden centrarse en la estructura del argumento
                en lugar de luchar con un asunto desconocido. Hemos reunido 40 de ellos
                en nuestra guía de <Link href="/es/topics/debate-topics-for-beginners" className="text-[var(--neon-cyan)] hover:underline">temas de debate fáciles para principiantes</Link>.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cómo elijo un tema de debate para mi clase?</h4>
              <p>
                Ten en cuenta la edad, los intereses y los objetivos de aprendizaje de tus estudiantes. Un buen
                tema de debate para el aula es apropiado para su edad, conecta con el temario y tiene suficiente
                matiz como para que los estudiantes no puedan descartar un lado de golpe. Usa nuestro generador
                para navegar por categorías y encontrar el que mejor encaje.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Cuál es la diferencia entre un tema de debate y un tema de discusión?</h4>
              <p>
                Un tema de debate toma una postura (p. ej., «Las redes sociales deberían prohibirse para menores de
                16 años») que puede defenderse a favor o en contra. Un tema de discusión es más abierto (p. ej.,
                «¿Cómo afectan las redes sociales a los niños?»). Nuestro generador ofrece propuestas listas para
                debatir con posturas claras.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Puedo usar estos temas para escribir ensayos?</h4>
              <p>
                Por supuesto. Cada tema de debate de aquí sirve también como excelente <strong>tema de ensayo
                argumentativo</strong>. La estructura a favor/en contra se traslada directamente al formato de un
                ensayo persuasivo de cinco párrafos. Elige un lado, usa los puntos de conversación como temas de
                cada párrafo y construye tu argumento.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">¿Con qué frecuencia se añaden nuevos temas de debate?</h4>
              <p>
                Actualizamos con regularidad nuestra base de datos de temas para reflejar la actualidad y las
                cuestiones emergentes. También puedes activar la generación de temas con IA para conseguir
                propuestas de debate únicas y en tiempo real sobre prácticamente cualquier asunto.
              </p>
            </div>
          </div>
        </section>

        {/* Debate topic collections */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="section-heading text-2xl sm:text-3xl text-center mb-4">
            Listas de <span className="gradient-text">Temas de Debate Seleccionadas</span>
          </h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-8 max-w-lg mx-auto">
            ¿Prefieres una lista lista para usar de temas de debate al azar? Explora nuestras colecciones
            escogidas por nivel y por tema.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { title: "Generador de Temas de Debate para Estudiantes", href: "/es/debate/students" },
              { title: "Generador de Debates para Secundaria", href: "/es/debate/middle-school" },
              { title: "Generador de Debates para Bachillerato", href: "/es/debate/high-school" },
              { title: "Generador de Debates para la Universidad", href: "/es/debate/college" },
              { title: "Generador de Temas de Debate Divertidos", href: "/es/debate/funny" },
              { title: "Generador de Argumentos al Azar", href: "/es/argument-generator" },
              { title: "75 Mejores Temas de Debate para Estudiantes", href: "/es/topics/debate-topics-for-students" },
              { title: "50 Temas de Debate para Secundaria", href: "/es/topics/debate-topics-for-middle-school" },
              { title: "40 Temas de Debate Fáciles para Principiantes", href: "/es/topics/debate-topics-for-beginners" },
              { title: "55 Temas Controvertidos para Discutir", href: "/es/topics/controversial-topics-to-discuss" },
              { title: "50 Preguntas de Dilemas Éticos", href: "/es/topics/ethical-dilemma-questions" },
              { title: "50 Preguntas Filosóficas Profundas", href: "/es/topics/deep-philosophical-questions" },
            ].map((item) => (
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
            <Link
              href="/es/topics"
              className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
            >
              Ver todas las colecciones de temas →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
