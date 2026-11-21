import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { RULETA_PREGUNTAS } from "@/data/spanishWheels";
import { SITE_URL } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-de-preguntas";
const TITLE = "Ruleta de Preguntas — Gira y Saldrá una Pregunta";
const DESCRIPTION =
  `Ruleta de preguntas con ${RULETA_PREGUNTAS.length} preguntas para conocerse, listas para girar. Quita la que ya salió, cambia la lista y comparte el enlace. Gratis y sin registro.`;

const SOCIAL = generatorSocial({ card: "wheel-of-names", title: TITLE, description: DESCRIPTION, alt: "Ruleta de preguntas en español" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta de preguntas", "ruleta de preguntas para conocerse", "girar ruleta de preguntas", "preguntas al azar ruleta", "ruleta de preguntas para fiesta"],
  alternates: { canonical: PATH, languages: { es: `${SITE_URL}${PATH}`, "x-default": `${SITE_URL}${PATH}` } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo funciona la ruleta de preguntas?", answer: `La ruleta abre con ${RULETA_PREGUNTAS.length} preguntas para conocerse. Pulsas Girar y cae una. La persona que le toque responde en una frase, o pasa. Puedes borrar, añadir o pegar tus propias preguntas.` },
  { question: "¿Se repiten?", answer: "Si dejas marcada la opción de quitar al ganador, la pregunta sale de la ruleta hasta que pulses Restablecer. Así una fiesta no cae dos veces en la misma." },
  { question: "¿Sirve para clase o para el trabajo?", answer: "Estas preguntas son de gusto y de anécdota corta, no de sueldo ni de familia. Para una reunión formal usa el generador de romper el hielo, que está pensado para trabajo y aula." },
  { question: "¿Puedo meter mis preguntas?", answer: "Sí. Borra la lista y escribe una por línea, o impórtalas desde un archivo de texto. El enlace copiado abre la misma ruleta en otro teléfono." },
  { question: "¿En qué se diferencia de la ruleta de temas?", answer: "La ruleta de temas elige una categoría para hablar. Esta ya trae la pregunta escrita, lista para leer en voz alta." },
  { question: "¿Los textos se suben a un servidor?", answer: "No. La lista se queda en el navegador. El enlace solo guarda las preguntas dentro de la propia URL." },
];

export default function RuletaDePreguntasPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta de preguntas"
      heading={["Ruleta de", "preguntas"]}
      intro={`${RULETA_PREGUNTAS.length} preguntas para conocerse. Gira, lee la que caiga y pasa el teléfono.`}
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort={`Pulsa Girar y la ruleta cae en una de las ${RULETA_PREGUNTAS.length} preguntas. Quitar al ganador evita repetir. Puedes cambiar la lista, importar un archivo y copiar un enlace con las mismas preguntas. Es gratis y no pide registro.`}
      related={[
        { href: "/es/ruleta-de-retos", label: "Ruleta de retos" },
        { href: "/es/topics/preguntas-para-conocer-a-alguien", label: "Preguntas para conocer a alguien" },
        { href: "/es/topics/preguntas-rompehielos-divertidas", label: "Rompehielos divertidos" },
        { href: "/es/spin-the-wheel", label: "Ruleta de temas" },
        { href: "/es/icebreaker", label: "Romper el hielo" },
      ]}
      content={
        <>
          <SectionTitle>Cómo usar la ruleta en una reunión</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Fiesta</strong> — un giro por persona. Quien responde elige quién gira después.</li>
            <li><strong>Grupo nuevo</strong> — quiten al ganador para que cada pregunta salga una sola vez.</li>
            <li><strong>Chat</strong> — copien el enlace y que cada quien gire en su teléfono.</li>
          </ul>
          <p>
            Si prefieren retos en lugar de preguntas, abran la <Link prefetch={false} href="/es/ruleta-de-retos" className={linkClass}>ruleta de retos</Link>.
            Para una lista que se lee sin girar, están las <Link prefetch={false} href="/es/topics/preguntas-para-conocer-a-alguien" className={linkClass}>preguntas para conocer a alguien</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{ pageId: "ruleta_de_preguntas", pro: true, locale: "es", preset: RULETA_PREGUNTAS.join("\n"), removeDefault: true }} />
    </GeneratorPageShell>
  );
}
