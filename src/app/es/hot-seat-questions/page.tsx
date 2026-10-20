import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PartyGenerator from "@/components/PartyGenerator";
import FaqSchema from "@/components/FaqSchema";
import Link from "next/link";
import type { Metadata } from "next";
import { HOT_SEAT_ES } from "@/data/esExtraPages";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";

const COUNT = HOT_SEAT_ES.length;

export const metadata: Metadata = {
  title: { absolute: `${COUNT} Preguntas para el Hot Seat (Silla Caliente) entre Amigos (2026)` },
  description: `${COUNT} preguntas para el juego de la silla caliente (hot seat): de calentamiento, reveladoras, de ronda rápida y profundas. Picantes pero sanas, un clic por pregunta, gratis.`,
  alternates: { canonical: "/es/hot-seat-questions", languages: hreflangAlternates("/hot-seat-questions") },
  openGraph: {
    title: `${COUNT} preguntas para la silla caliente`,
    description: "Pon a un amigo en el centro: preguntas de calentamiento, reveladoras y de ronda rápida.",
    url: `${SITE_URL}/es/hot-seat-questions`,
    siteName: "Random Topics",
    locale: "es_ES",
    images: ["/es/opengraph-image"],
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    question: "¿Cómo se juega a la silla caliente (hot seat)?",
    answer:
      "Una persona se sienta en la 'silla caliente' y el resto le hace preguntas durante un tiempo fijo, normalmente de dos a cinco minutos. Debe responder con sinceridad (con uno o dos pases permitidos) y luego rota el turno. El generador reparte las preguntas para que el juego no se detenga.",
  },
  {
    question: "¿Qué son buenas preguntas para la silla caliente?",
    answer:
      "Las que revelan algo sin humillar: momentos vergonzosos, opiniones secretas, preguntas de '¿quién de este grupo…?' y dilemas rápidos. Empieza con las de calentamiento, sube a las reveladoras cuando todos se rían y deja las profundas para amigos de confianza.",
  },
  {
    question: "¿Las preguntas son aptas para todos?",
    answer: "Sí. Son picantes pero sin contenido adulto, así que sirven para quedadas de adolescentes, universidad, cenas de equipo y reuniones con familia.",
  },
  {
    question: "¿Cuánto debe durar cada turno?",
    answer: "Tres minutos es lo ideal: da para cinco a ocho preguntas. En grupos grandes, baja a dos minutos para que todos pasen por la silla.",
  },
];

export default function HotSeatPageEs() {
  return (
    <>
      <FaqSchema items={FAQ_ITEMS} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Silla Caliente" }]} />
        <PartyGenerator
          questions={HOT_SEAT_ES}
          title="Preguntas para la Silla Caliente"
          subtitle="Pon a un amigo en el centro: un clic por pregunta, desde el calentamiento hasta la ronda rápida. Picantes pero sanas, sin repeticiones."
          emoji="🔥"
          locale="es"
        />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-8 sm:p-10 space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
            <h2 className="section-heading text-2xl sm:text-3xl text-[var(--text-primary)]">Cómo organizar una buena ronda</h2>
            <ol className="space-y-2 list-decimal pl-5">
              <li><strong>Pon un temporizador</strong>: tres minutos por persona.</li>
              <li><strong>Saca preguntas del generador</strong> y léelas tal cual.</li>
              <li><strong>Dos pases por persona</strong>: nadie se siente acorralado.</li>
              <li><strong>Rota en el sentido del reloj</strong> o usa la <Link href="/es/spin-the-wheel" className="text-[var(--neon-cyan)] hover:underline">ruleta</Link> para elegir al siguiente.</li>
              <li><strong>Votad la mejor respuesta</strong> de cada turno.</li>
            </ol>
            <p>
              Más juegos para la noche:{" "}
              <Link href="/es/truth-or-dare" className="text-[var(--neon-cyan)] hover:underline">Verdad o Reto</Link>,{" "}
              <Link href="/es/never-have-i-ever" className="text-[var(--neon-cyan)] hover:underline">Yo Nunca</Link>,{" "}
              <Link href="/es/most-likely-to" className="text-[var(--neon-cyan)] hover:underline">Quién Es Más Probable</Link>,{" "}
              <Link href="/es/two-truths-and-a-lie" className="text-[var(--neon-cyan)] hover:underline">Dos Verdades y una Mentira</Link> y{" "}
              <Link href="/es/charades" className="text-[var(--neon-cyan)] hover:underline">Mímica</Link>.
            </p>
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Todas las preguntas ({COUNT})</h2>
            <ol className="list-decimal pl-5 space-y-1">
              {HOT_SEAT_ES.map((q) => <li key={q}>{q}</li>)}
            </ol>
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Preguntas frecuentes</h2>
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
