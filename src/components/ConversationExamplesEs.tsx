import GeneratedResultActions from "@/components/GeneratedResultActions";
import { conversationExamplesEs } from "@/data/conversationExamples.es";

export default function ConversationExamplesEs() {
  return (
    <section id="preguntas-para-conversar" aria-labelledby="preguntas-conversacion-heading" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
      <h2 id="preguntas-conversacion-heading" className="text-2xl font-bold text-[var(--text-primary)]">12 temas para hablar: preguntas y repreguntas</h2>
      <p className="mt-3 mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">Elige una pregunta, escucha la respuesta y usa una repregunta si encaja. No hace falta responder a todo: cualquiera puede pasar o cambiar de tema. Estas tarjetas son ejemplos listos para usar; el generador de arriba ofrece otros 320 temas.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {conversationExamplesEs.map((topic, index) => {
          const copyValue = `${topic.text}\n\nPara seguir la conversación:\n${topic.talkingPoints.map((point) => `• ${point}`).join("\n")}`;
          return (
            <details key={topic.id} data-conversation-example="true" className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <summary className="min-h-11 cursor-pointer text-sm font-semibold leading-relaxed text-[var(--text-primary)]">{index + 1}. {topic.text}</summary>
              <p className="mt-4 text-xs font-semibold text-[var(--neon-cyan)]">Para seguir la conversación</p>
              <ul className="my-3 list-disc space-y-2 pl-5 text-sm text-[var(--text-secondary)]">
                {topic.talkingPoints.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <GeneratedResultActions text={topic.text} copyValue={copyValue} shareTitle="Temas de conversación" saveTopic={topic} locale="es" toolType="conversation_examples" contentSource="es_conversation_examples" actionSurface="editorial_card" isPostGenerate={false} compact copyLabel="Copiar pregunta y repreguntas" showMessageCopy />
            </details>
          );
        })}
      </div>
    </section>
  );
}
