import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import YesNoWheel from "@/components/generators/YesNoWheel";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-si-o-no";
const TITLE = "Ruleta Sí o No — Gira y Obtén Sí, No o Tal Vez";
const DESCRIPTION =
  "Haz una pregunta y gira la ruleta sí o no. Cambia a sí, no o tal vez, lleva la cuenta de las respuestas y deja que una ruleta justa decida. Gratis y sin registro.";

const SOCIAL = generatorSocial({ card: "yes-or-no-wheel", title: TITLE, description: DESCRIPTION, alt: "Ruleta sí o no — casillas verdes y rojas" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta si o no", "ruleta sí o no", "ruleta de si y no", "ruleta si no tal vez", "girar ruleta si o no", "decision si o no"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/yes-or-no-wheel") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo funciona la ruleta sí o no?", answer: "Escribe la pregunta si quieres y pulsa Girar. La ruleta se detiene en Sí o en No. En el modo con Tal vez hay una tercera respuesta, con la misma probabilidad. La respuesta se elige primero al azar y la animación solo la muestra." },
  { question: "¿Es un 50/50 de verdad?", answer: "En Sí / No hay diez casillas, cinco de cada una, así que cada respuesta tiene 50 %. En Sí / No / Tal vez hay nueve casillas, tres de cada respuesta, así que cada una tiene una de tres." },
  { question: "¿Debo dejar que una ruleta decida algo importante?", answer: "Úsala para decisiones pequeñas y como pista en las grandes. Fíjate en lo que sientes cuando cae la respuesta: alivio o decepción dice más que el giro. Para salud, dinero o seguridad, usa datos y consejo profesional." },
  { question: "¿Puede repetirse la misma respuesta?", answer: "Sí. Cada giro es independiente, así que Sí puede salir tres veces seguidas. El conteo de debajo enseña cuántas veces ha salido cada respuesta en esta visita." },
  { question: "¿Se guarda mi pregunta?", answer: "No sale de tu pantalla. No se envía a un servidor ni se guarda en una cuenta." },
  { question: "¿Cómo hago una ruleta de sí, no y tal vez?", answer: "Pulsa el botón Sí / No / Tal vez. La ruleta pasa a nueve casillas, tres de cada respuesta." },
  { question: "¿Puedo poner mis propias opciones?", answer: "Para etiquetas tuyas —nombres, comidas, tareas— usa la ruleta de nombres. Esta página solo responde Sí, No o Tal vez." },
  { question: "¿En qué se diferencia de un volado?", answer: "El resultado es el mismo tipo de azar, con la diferencia de que todo el grupo ve la ruleta. Si quieres cara o cruz sin ruleta, esta página no lo sustituye: aquí la gracia es el giro y el conteo." },
];

export default function RuletaSiONoPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta sí o no"
      heading={["Ruleta", "sí o no"]}
      intro="Haz una pregunta, gira la ruleta y obtén un sí, un no o un tal vez al azar."
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort="Elige Sí / No o Sí / No / Tal vez, escribe la pregunta si quieres y pulsa Girar. Cada respuesta tiene la misma probabilidad y un conteo lleva la cuenta de la sesión. Es gratis, no pide registro y la pregunta se queda en tu navegador."
      related={[
        { href: "/es/ruleta-de-nombres", label: "Ruleta de nombres" },
        { href: "/es/ruleta-de-numeros", label: "Ruleta de números" },
        { href: "/es/ruleta-de-letras", label: "Ruleta de letras" },
        { href: "/es/spin-the-wheel", label: "Ruleta de temas" },
        { href: "/es/this-or-that", label: "Esto o aquello" },
      ]}
      content={
        <>
          <SectionTitle>Preguntas que le van a una ruleta de sí o no</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Decisiones del día</strong> — «¿Salgo a caminar?», «¿Pido postre?», «¿Le escribo yo primero?».</li>
            <li><strong>Juegos</strong> — un giro para decidir si toca verdad o reto, o para desempatar un plan.</li>
            <li><strong>Cuando nadie se decide</strong> — el resultado obliga a una primera reacción. ¿Estás de acuerdo o quieres girar otra vez?</li>
          </ul>
          <SectionTitle>Sí / No frente a Tal vez</SectionTitle>
          <p>
            Dos respuestas son un volado con mejor puesta en escena. Añade <strong>Tal vez</strong> cuando un sí o un no sería mentira:
            significa «después» o «falta información». Las casillas se alternan, así que la ruleta no se ve cargada hacia un lado.
          </p>
          <p>
            Para opciones con tus propias palabras, abre la <Link prefetch={false} href="/es/ruleta-de-nombres" className={linkClass}>ruleta de nombres</Link>.
            Para una letra al azar, la <Link prefetch={false} href="/es/ruleta-de-letras" className={linkClass}>ruleta de letras</Link>.
          </p>
        </>
      }
    >
      <YesNoWheel locale="es" />
    </GeneratorPageShell>
  );
}
