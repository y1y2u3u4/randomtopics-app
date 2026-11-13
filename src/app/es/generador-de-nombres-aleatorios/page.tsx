import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import RandomNameGenerator from "@/components/generators/RandomNameGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/generador-de-nombres-aleatorios";
const TITLE = "Generador de Nombres Aleatorios — Nombre y Apellido";
const DESCRIPTION =
  "Generador de nombres aleatorios: nombre y apellido que combinan, por género y por origen. Hasta 20 a la vez, con el significado del apellido. Gratis y sin registro.";

const SOCIAL = generatorSocial({ card: "random-name-generator", title: TITLE, description: DESCRIPTION, alt: "Generador de nombres aleatorios — tarjetas de nombre y apellido" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["generador de nombres aleatorios", "nombres aleatorios", "generador de nombres", "nombres al azar", "generador de nombre y apellido", "nombres para personajes"],
  alternates: { canonical: PATH, languages: hreflangAlternates("/random-name-generator") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Cómo funciona el generador de nombres aleatorios?", answer: "Junta un nombre de pila común en un país con un apellido de esa misma cultura, así que el resultado suena a persona y no a una mezcla al azar. Puedes filtrar por género y por origen. No se repite hasta agotar la combinación." },
  { question: "¿Puedo pedir solo nombres de mujer o de hombre?", answer: "Sí. En Género marca Mujer, Hombre o los dos. En Origen puedes quedarte con un país o mezclar varios." },
  { question: "¿Son personas reales?", answer: "No. El nombre y el apellido salen de listas distintas. Puede coincidir con alguien, pero el generador no describe a esa persona. Para una ficha con edad y correo de ejemplo, esta página no arma el perfil completo." },
  { question: "¿Puedo sacar solo el nombre o solo el apellido?", answer: "Sí. En Mostrar elige Solo el nombre o Solo el apellido. Si quieres apellidos con más filtros de origen, el generador de apellidos está pensado para eso." },
  { question: "¿Por qué algunos nombres de Asia llevan el apellido primero?", answer: "Porque así se dicen en esas lenguas. La ficha indica el origen para que sepas qué orden se usó." },
  { question: "¿Para qué sirve un nombre aleatorio?", answer: "Personajes de un cuento o un juego, datos de prueba, ejemplos para una clase, una lista de bebés o un nombre de invitado en una partida. Si lo que quieres es sortear a gente que ya conoces, usa la ruleta de nombres." },
];

export default function GeneradorNombresAleatoriosPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Generador de nombres aleatorios"
      heading={["Nombres", "aleatorios"]}
      intro="Nombre y apellido que pegan juntos. Filtra por género y por origen, y mira qué significa el apellido."
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort="Pulsa Generar y salen nombres con apellido del mismo origen, como Mateo Herrera o Aoife Murphy. Puedes pedir solo mujer o solo hombre, elegir países, mostrar solo el nombre o solo el apellido, y copiar la lista o un enlace. Cada apellido trae su significado."
      related={[
        { href: "/es/generador-de-apellidos", label: "Generador de apellidos" },
        { href: "/es/ruleta-de-nombres", label: "Ruleta de nombres" },
        { href: "/es/generador-de-palabras-aleatorias", label: "Palabras aleatorias" },
        { href: "/es/ideas-para-escribir-historias", label: "Ideas para historias" },
      ]}
      content={
        <>
          <SectionTitle>Nombres que suenan de un mismo lugar</SectionTitle>
          <p>
            Un <strong>generador de nombres aleatorios</strong> que mezcla cualquier nombre con cualquier apellido acaba en combinaciones que nadie usaría.
            Este junta el nombre de pila y el apellido de la misma cultura. El resultado se lee como una lista de clase, un equipo o el reparto de un cuento.
          </p>
          <SectionTitle>Qué puedes filtrar</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Género</strong> — mujer, hombre o los dos.</li>
            <li><strong>Origen</strong> — uno o varios países. Si no marcas ninguno, entran todos.</li>
            <li><strong>Mostrar</strong> — nombre y apellido, solo el nombre o solo el apellido.</li>
          </ul>
          <p>
            ¿Solo te hace falta el apellido y su significado? Usa el <Link prefetch={false} href="/es/generador-de-apellidos" className={linkClass}>generador de apellidos</Link>.
            ¿Quieres elegir entre personas de verdad, las de tu grupo? Esa es la <Link prefetch={false} href="/es/ruleta-de-nombres" className={linkClass}>ruleta de nombres</Link>.
          </p>
        </>
      }
    >
      <RandomNameGenerator locale="es" />
    </GeneratorPageShell>
  );
}
