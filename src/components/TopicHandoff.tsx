"use client";

import { useEffect, useState } from "react";
import PracticeSelectedTopic from "./PracticeSelectedTopic";
import dynamic from "next/dynamic";
import { handoffKey, handoffReturnPath, handoffSources, parseHandoff, type Handoff, type HandoffSource } from "@/lib/topicHandoff";
import { track } from "@/lib/track";
import TopicCard from "./TopicCard";
import SpeechTimer from "./SpeechTimer";

const SpeechCoachEntry = dynamic(() => import("./SpeechCoachEntry"));

export { PracticeSelectedTopic };

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
    <p className="text-sm text-[var(--text-muted)] mb-4">{es ? "El mismo tema, sin volver a sortear. Se conserva en esta pestaña durante dos horas; el temporizador empieza de nuevo." : !returnSource && process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED === "true" ? "Practice the same topic without drawing again. Record an answer for personal feedback, or use the timer below. Your topic stays in this tab for two hours." : "The same topic, without drawing again. Kept in this tab for two hours; the timer starts fresh."}</p>
    <TopicCard topic={selected.topic} locale={locale} contentSource={`handoff_${selected.source}`} actionContext="editorial_card" />
    {returnSource ? <PracticeSelectedTopic topic={selected.topic} source={returnSource} /> : <>
      {!es && process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED === "true" && <SpeechCoachEntry
        topics={[selected.topic]} contentSource={`handoff_${selected.source}`}
        requestTopics={async () => [selected.topic]} loadingTopics={false} timerHref="#selected-topic-timer" />}
      <div id="selected-topic-timer"><SpeechTimer locale={locale} contentSource={`handoff_${selected.source}`} selfReview /></div>
      <a className="inline-block min-h-11 underline py-3" href={selected.source === "es_article" ? `${handoffSources.es_article.path}#${selected.topic.id}` : ["home", "wheel"].includes(selected.source) ? `${handoffSources[selected.source].path}#selected-topic` : handoffReturnPath(selected)}>{es ? "Volver a la lista de temas" : "Return to where you chose this topic"}</a>
    </>}
  </section>;
}
