import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-de-nombres";
const TITLE = "Ruleta de Nombres Gratis — Elige un Ganador al Azar";
const DESCRIPTION =
  "Escribe o pega los nombres, gira la ruleta y saldrá un ganador al azar. Quita al ganador para no repetir, mezcla, ordena y comparte el enlace. Gratis, sin registro y la lista se queda en tu navegador.";

const SOCIAL = generatorSocial({ card: "wheel-of-names", title: TITLE, description: DESCRIPTION, alt: "Ruleta de nombres — una ruleta de colores con nombres en español" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta de nombres", "ruleta de nombres aleatorios", "ruleta para elegir nombres", "girar ruleta de nombres", "sorteo de nombres", "ruleta de nombres online"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/wheel-of-names") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo se usa la ruleta de nombres?", answer: "Escribe un nombre por línea, o sepáralos con comas. Comprueba que aparecen en la ruleta y pulsa Girar. El ganador sale debajo, en grande, y se suma al historial. Puedes editar la lista en cualquier momento." },
  { question: "¿De verdad es al azar?", answer: "Sí. El ganador se elige primero con el generador aleatorio seguro del dispositivo, el mismo que usa el navegador para criptografía, y después la ruleta gira hasta esa casilla. El largo del nombre y el lugar de la casilla no cambian la probabilidad." },
  { question: "¿Cómo evito que salga dos veces la misma persona?", answer: "Marca «Quitar al ganador después de cada giro». El nombre se borra de la lista, así que un sorteo, una clase o un turno de tareas no repite a nadie. Restablecer vuelve a la lista inicial." },
  { question: "¿Los nombres se suben a algún servidor?", answer: "No. Se quedan en este navegador. La última lista se guarda aquí para la próxima visita, y puedes guardar listas con nombre. «Copiar enlace de esta ruleta» mete los nombres en el propio enlace: quien lo abre ve la misma ruleta, sin una cuenta." },
  { question: "¿Puedo importar nombres desde una hoja de cálculo?", answer: "Sí. Pulsa Importar CSV o TXT. La primera columna son los nombres y la segunda, si existe, el peso. El archivo se lee en tu navegador y no se envía. También puedes pegar una columna tal cual." },
  { question: "¿Puedo darle más probabilidad a un nombre?", answer: "Sí. Activa los pesos y pon un número del 1 al 100. Un peso 3 ocupa el triple de casilla y tiene el triple de probabilidad. Escribir el nombre dos veces también cuenta como dos casillas." },
  { question: "¿Cuántos nombres caben?", answer: "Hasta 200. A partir de unos 30 la ruleta deja de escribir el nombre dentro de la casilla para que se pueda leer, pero todos siguen en el sorteo y el ganador se anuncia debajo en letra grande." },
  { question: "¿Sirve para clase o para un sorteo en vivo?", answer: "Sí. Pega la lista, activa quitar al ganador y gira en el proyector o en la pantalla compartida. Para temas de conversación, no para personas, usa la ruleta de temas." },
];

export default function RuletaDeNombresPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta de nombres"
      heading={["Ruleta de", "nombres"]}
      intro="Escribe los nombres, gira la ruleta y deja que el azar elija. Edita la lista, quita ganadores y comparte el enlace."
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort="Un nombre por línea, pulsa Girar y la ruleta cae en un ganador al azar. Activa quitar al ganador para no repetir, mezcla u ordena la lista y copia un enlace que abre la misma ruleta. Es gratis, no pide registro y los nombres no salen de tu navegador."
      related={[
        { href: "/es/ruleta-si-o-no", label: "Ruleta sí o no" },
        { href: "/es/ruleta-de-letras", label: "Ruleta de letras" },
        { href: "/es/ruleta-de-numeros", label: "Ruleta de números" },
        { href: "/es/spin-the-wheel", label: "Ruleta de temas" },
        { href: "/es/generador-de-equipos-aleatorios", label: "Generador de equipos" },
      ]}
      content={
        <>
          <SectionTitle>Para qué sirve una ruleta de nombres</SectionTitle>
          <p>
            Una <strong>ruleta de nombres</strong> convierte un sorteo en algo que todo el mundo puede ver, y por eso se siente justo.
            En clase evita la sospecha de que siempre llamas a las mismas personas. En un directo elige al ganador delante de la cámara.
            En casa decide quién lava o quién elige la película. La ruleta es el espectáculo: el resultado ya está decidido antes de que empiece a girar.
          </p>
          <SectionTitle>Cómo hacer un sorteo limpio</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Pasar lista o preguntar en clase</strong> — pega el grupo, marca quitar al ganador y cada persona sale una vez.</li>
            <li><strong>Rifas</strong> — un participante por línea, gira en pantalla y comparte el enlace para que puedan revisar la lista.</li>
            <li><strong>Tareas de la casa</strong> — los nombres de quien vive ahí, un giro, y el historial muestra a quién le tocó la vez anterior.</li>
            <li><strong>Un orden</strong> — deja activado quitar al ganador hasta vaciar la ruleta. El orden en que salieron es el orden de participación.</li>
          </ul>
          <p>
            ¿Necesitas un tema y no una persona? Usa la <Link prefetch={false} href="/es/spin-the-wheel" className={linkClass}>ruleta de temas</Link>.
            Para un sí o un no, la <Link prefetch={false} href="/es/ruleta-si-o-no" className={linkClass}>ruleta sí o no</Link>.
            Para el abecedario, la <Link prefetch={false} href="/es/ruleta-de-letras" className={linkClass}>ruleta de letras</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{ pageId: "ruleta_de_nombres", pro: true, locale: "es" }} />
    </GeneratorPageShell>
  );
}
