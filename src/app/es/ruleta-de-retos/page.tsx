import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import { RULETA_RETOS } from "@/data/spanishWheels";
import { SITE_URL } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/es/ruleta-de-retos";
const TITLE = "Ruleta de Retos — Gira y Saldrá un Reto Limpio";
const DESCRIPTION =
  `Ruleta de retos con ${RULETA_RETOS.length} retos para hacer en la sala: sin contacto, sin fotos comprometedoras y sin contenido explícito. Gira, cumple o pasa. Gratis.`;

const SOCIAL = generatorSocial({ card: "wheel-of-names", title: TITLE, description: DESCRIPTION, alt: "Ruleta de retos para una fiesta" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["ruleta de retos", "ruleta de retos para fiesta", "retos para amigos", "girar ruleta de retos", "retos divertidos ruleta"],
  alternates: { canonical: PATH, languages: { es: `${SITE_URL}${PATH}`, "x-default": `${SITE_URL}${PATH}` } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "¿Qué tipo de retos hay?", answer: `Hay ${RULETA_RETOS.length} retos para hacer sentados o de pie en la misma sala: hablar, imitar, dibujar, agradecer. No hay contacto físico, no hay fotos comprometedoras y no hay contenido explícito.` },
  { question: "¿Se puede pasar?", answer: "Sí. Acordarlo antes de girar. Quien pasa no explica. El siguiente gira. Un reto que no se puede hacer en el lugar también se cambia." },
  { question: "¿Cómo evito que se repita?", answer: "Deja marcada la casilla de quitar al ganador. El reto sale de la ruleta hasta que pulses Restablecer." },
  { question: "¿Puedo poner mis propios retos?", answer: "Sí. Edita la caja, uno por línea. El enlace copiado guarda esa lista para que otra persona abra la misma ruleta." },
  { question: "¿Sirve para verdad o reto?", answer: "Sirve como la mitad de reto. La verdad pueden sacarla de la lista de verdad o reto para amigos o para parejas, y el reto de esta ruleta." },
  { question: "¿Es para niños?", answer: "Varios retos son de hablar y de dibujar, y un adulto puede leerlos antes. No están pensados como juego de clase: para el aula usen romper el hielo." },
];

export default function RuletaDeRetosPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Ruleta de retos"
      heading={["Ruleta de", "retos"]}
      intro={`${RULETA_RETOS.length} retos para la sala. Gira, cumple el que caiga o pasa el turno.`}
      description={DESCRIPTION}
      updated="2026-11-13"
      faq={FAQ}
      inShort={`Pulsa Girar y cae uno de los ${RULETA_RETOS.length} retos. Se hacen en la sala, sin contacto y sin publicar nada. Quitar al ganador evita repetir, y puedes cambiar la lista o compartirla con un enlace. Es gratis y no pide registro.`}
      related={[
        { href: "/es/ruleta-de-preguntas", label: "Ruleta de preguntas" },
        { href: "/es/topics/verdad-o-reto-amigos", label: "Verdad o reto para amigos" },
        { href: "/es/topics/verdad-o-reto-parejas", label: "Verdad o reto para parejas" },
        { href: "/es/topics/juegos-para-whatsapp", label: "Juegos para WhatsApp" },
        { href: "/es/truth-or-dare", label: "Generador de Verdad o Reto" },
      ]}
      content={
        <>
          <SectionTitle>Reglas antes de girar</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Paso libre.</strong> Nadie cumple un reto que no quiere. No se negocia.</li>
            <li><strong>La sala manda.</strong> Si el reto no cabe en el lugar, se cambia por el siguiente.</li>
            <li><strong>Sin público de más.</strong> No se graba ni se manda a otro chat salvo que la persona lo pida.</li>
          </ul>
          <p>
            Para preguntas en vez de retos, usen la <Link prefetch={false} href="/es/ruleta-de-preguntas" className={linkClass}>ruleta de preguntas</Link>.
            Para una lista escrita de verdades y retos, está la de <Link prefetch={false} href="/es/topics/verdad-o-reto-amigos" className={linkClass}>amigos</Link> y la de <Link prefetch={false} href="/es/topics/verdad-o-reto-parejas" className={linkClass}>parejas</Link>.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{ pageId: "ruleta_de_retos", pro: true, locale: "es", preset: RULETA_RETOS.join("\n"), removeDefault: true }} />
    </GeneratorPageShell>
  );
}
