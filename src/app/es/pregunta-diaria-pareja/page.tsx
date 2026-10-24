import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FactTable from "@/components/FactTable";
import CouplesDaily from "@/components/subs/CouplesDaily";
import LandingView from "@/components/subs/LandingView";
import { SITE_URL } from "@/i18n/config";

const PATH = "/es/pregunta-diaria-pareja";
const EN_PATH = "/couples-daily-question";
const TITLE = "Pregunta diaria para parejas — Una pregunta al día, respuestas juntos";
const DESCRIPTION =
  "Una pregunta al día para parejas: cada uno responde en privado y las dos respuestas aparecen solo cuando ambos habéis contestado. 3 días gratis, luego 4,99 USD al mes o 29,99 USD al año para los dos. Sin registro para empezar.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["pregunta diaria para parejas", "preguntas para hacer a tu pareja cada día", "pregunta del día en pareja", "app para parejas", "preguntas para parejas"],
  alternates: { canonical: PATH, languages: { en: `${SITE_URL}${EN_PATH}`, es: `${SITE_URL}${PATH}`, "x-default": `${SITE_URL}${EN_PATH}` } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", locale: "es_ES", type: "website" },
};

const FAQ = [
  { question: "¿Qué es la pregunta diaria para parejas?", answer: "Es una sala compartida para dos. Cada día los dos recibís la misma pregunta, cada uno escribe su respuesta por separado y la app muestra las dos respuestas juntas solo cuando ambos habéis contestado. Guarda además el historial y cuenta la racha de días en que contestasteis los dos." },
  { question: "¿Cuánto cuesta?", answer: "Los primeros 3 días son gratis, sin registro y sin tarjeta. Después cuesta 4,99 USD al mes o 29,99 USD al año. Un solo plan cubre a los dos: si cualquiera de los dos se suscribe, la sala sigue funcionando para ambos." },
  { question: "¿Tenemos que pagar los dos?", answer: "No. Solo hace falta un plan. La sala comprueba a los dos miembros, así que quien pague lo desbloquea para la pareja." },
  { question: "¿Quién puede ver nuestras respuestas?", answer: "Solo vosotros dos. Tu pareja no puede ver tu respuesta antes de escribir la suya y nadie más puede abrir la sala. Las respuestas no son públicas." },
  { question: "¿Cómo invito a mi pareja?", answer: "Crea la sala y copia el enlace de invitación (o usa el botón Compartir en el móvil). Cuando tu pareja abra el enlace y pulse Unirme, quedáis conectados. Una sala admite exactamente a dos personas." },
  { question: "¿Y si mi pareja no contesta?", answer: "Tu respuesta queda oculta y la página indica que espera a tu pareja. Se actualiza sola mientras está abierta, y las respuestas aparecen en cuanto conteste." },
  { question: "¿Qué pasa cuando terminan los 3 días gratis?", answer: "Podéis seguir abriendo la sala y leer todos los días que contestasteis los dos. Para responder un día nuevo, uno de los dos elige un plan mensual o anual. Puedes cancelar cuando quieras." },
  { question: "¿Qué tipo de preguntas son?", answer: "Preguntas abiertas que los dos podéis contestar: recuerdos, sueños, pequeños hábitos, qué os hace sentir cuidados y otras más ligeras. No se repite ninguna hasta agotar toda la lista." },
  { question: "¿Funciona si vivimos en husos horarios distintos?", answer: "Sí. La sala usa el huso horario de quien la creó para decidir cuándo empieza un día nuevo, así que los dos veis la misma pregunta el mismo día." },
];

export default function PreguntaDiariaParejaPage() {
  return (
    <GeneratorPageShell
      locale="es"
      path={PATH}
      name="Pregunta diaria para parejas"
      heading={["Pregunta diaria", "para parejas"]}
      intro="Una pregunta al día para los dos. Respondéis en privado y luego veis las dos respuestas juntas. 3 días gratis, sin registro para empezar."
      description={DESCRIPTION}
      updated="2026-10-24"
      faq={FAQ}
      inShort="La pregunta diaria para parejas os da la misma pregunta cada día. Los dos respondéis en privado y las respuestas aparecen solo cuando ambos habéis contestado. Tenéis además un historial compartido y una racha. Los primeros 3 días son gratis y sin registro; después cuesta 4,99 USD al mes o 29,99 USD al año, y un solo plan cubre a los dos."
      related={[
        { href: "/es/topics/conversation-starters-for-couples", label: "Temas de conversación para parejas" },
        { href: "/es/preguntas-profundas", label: "Preguntas profundas" },
        { href: "/es/preguntas-para-diario", label: "Preguntas para diario" },
        { href: "/es/icebreaker", label: "Preguntas rompehielos" },
      ]}
      afterTool={
        <FactTable
          heading="La pregunta diaria para parejas de un vistazo"
          columns={["", "Detalle"]}
          rows={[
            ["Prueba gratis", "3 días desde que creáis la sala, sin registro ni tarjeta"],
            ["Precio después", "4,99 USD al mes o 29,99 USD al año, cancelas cuando quieras"],
            ["Quién paga", "Uno de los dos. Un plan en cualquiera de los dos cubre la sala"],
            ["Quién ve las respuestas", "Solo vosotros dos; cada respuesta queda oculta hasta que ambos contestéis"],
            ["Incluye", "Pregunta diaria, historial compartido, racha, inglés y español"],
            ["Dispositivos", "Cualquier navegador; abre el enlace de invitación en el otro móvil"],
          ]}
        />
      }
      content={
        <>
          <SectionTitle>Cómo funciona</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>Crea la sala</strong> con un toque, sin registro. Recibes un enlace de invitación.</li>
            <li><strong>Envía el enlace</strong> a tu pareja. Lo abre y se une.</li>
            <li><strong>Contesta la pregunta de hoy</strong> por tu cuenta, con tus palabras.</li>
            <li><strong>Revelad juntos</strong>: cuando los dos habéis contestado, las respuestas aparecen una junto a la otra.</li>
          </ol>
          <SectionTitle>Por qué conviene contestar por separado</SectionTitle>
          <p>
            Cuando una persona responde en voz alta primero, la otra suele darle la razón o suavizar su respuesta. Escribir la tuya antes de ver
            la de tu pareja la mantiene sincera, y la revelación os da algo real de lo que hablar en la cena o antes de dormir. Si queréis una
            lista más larga para charlar en persona, probad las <Link href="/es/preguntas-profundas" className={linkClass}>preguntas profundas</Link>.
            La versión en inglés es <Link href="/couples-daily-question" className={linkClass}>Couples Daily Question</Link>.
          </p>
        </>
      }
    >
      <LandingView product="couples" locale="es" />
      <CouplesDaily locale="es" />
    </GeneratorPageShell>
  );
}
