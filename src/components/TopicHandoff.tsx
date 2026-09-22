"use client";

import { useEffect, useState } from "react";
import type { Topic } from "@/data/types";
import { handoffKey, handoffSources, parseHandoff, type Handoff, type HandoffSource } from "@/lib/topicHandoff";
import { track } from "@/lib/track";
import TopicCard from "./TopicCard";
import SpeechTimer from "./SpeechTimer";

export function PracticeSelectedTopic({ topic, source }: { topic: Topic; source: HandoffSource }) {
  const [failed, setFailed] = useState(false);
  const es = handoffSources[source].locale === "es";
  return <div className="my-3">
    <button type="button" className="min-h-11 rounded-xl border border-white/20 px-4 py-2 font-semibold text-[var(--neon-cyan)]" onClick={() => {
      track(`handoff_${source}_click`, { content_source: source });
      try {
        const value: Handoff = { topic, source, at: Date.now() };
        const key = handoffKey();
        window.sessionStorage.setItem(key, JSON.stringify(value));
        if (!parseHandoff(window.sessionStorage.getItem(key))) throw new Error("storage");
        const diagnostics = key.endsWith("-qa") && new URLSearchParams(window.location.search).get("measure") === "1" ? "?usage_qa=1&measure=1" : "";
        window.location.assign(`${es ? "/es" : ""}/speech${diagnostics}#selected-topic`);
      } catch { setFailed(true); track(`handoff_${source}_error`); }
    }}>{es ? "Practicar este tema →" : "Practice this topic →"}</button>
    {failed && <p role="status" className="mt-2 text-sm">{es ? "No se pudo trasladar el tema. Cópialo y abre el temporizador." : "Could not carry this topic over. Copy it, then open the practice timer."} <a className="underline" href={es ? "/es/speech" : "/speech"}>{es ? "Abrir práctica" : "Open practice"}</a></p>}
  </div>;
}

/** A tab-local selected topic, not a newly generated result or restored timer. */
export function SelectedTopicPractice({ locale = "en", returnSource }: { locale?: "en" | "es"; returnSource?: HandoffSource }) {
  const [selected, setSelected] = useState<Handoff | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    const load = () => {
      if (!returnSource && window.location.hash !== "#selected-topic") return;
      let value: Handoff | null = null;
      try { value = parseHandoff(window.sessionStorage.getItem(handoffKey())); } catch { /* Ordinary generator remains available. */ }
      if (value && handoffSources[value.source].locale === locale && (!returnSource || value.source === returnSource)) {
        setSelected(value);
        track(`handoff_${value.source}_${returnSource ? "return" : "load"}`);
      } else if (!returnSource && window.location.hash === "#selected-topic") setMissing(true);
    };
    load();
  }, [locale, returnSource]);
  const es = locale === "es";
  if (!selected) return missing ? <p id="selected-topic" role="status" className="max-w-3xl mx-auto p-6">{es ? "El tema ya no está disponible en esta pestaña. Elige otro abajo." : "That selected topic is no longer available in this tab. Choose another below."}</p> : null;
  return <section id="selected-topic" className="max-w-3xl mx-auto px-4 py-6" aria-label={es ? "Practicar el tema elegido" : "Practice selected topic"}>
    <h2 className="text-xl font-bold mb-3">{returnSource ? "Your selected topic" : es ? "Practica el tema que elegiste" : "Practice the topic you chose"}</h2>
    <p className="text-sm text-[var(--text-muted)] mb-4">{es ? "El mismo tema, sin volver a sortear. Se conserva en esta pestaña durante dos horas; el temporizador empieza de nuevo." : "The same topic, without drawing again. Kept in this tab for two hours; the timer starts fresh."}</p>
    <TopicCard topic={selected.topic} locale={locale} contentSource={`handoff_${selected.source}`} actionContext="editorial_card" />
    {returnSource ? <PracticeSelectedTopic topic={selected.topic} source={returnSource} /> : <>
      <SpeechTimer locale={locale} contentSource={`handoff_${selected.source}`} selfReview />
      <a className="inline-block min-h-11 underline py-3" href={`${handoffSources[selected.source].path}#${selected.source === "es_article" ? selected.topic.id : "selected-topic"}`}>{es ? "Volver a la lista de temas" : "Return to where you chose this topic"}</a>
    </>}
  </section>;
}
