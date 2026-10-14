"use client";

import { useState, type ReactNode } from "react";
import type { Topic } from "@/data/types";
import { handoffKey, handoffSources, parseHandoff, type Handoff, type HandoffSource } from "@/lib/topicHandoff";
import { track } from "@/lib/track";

export default function PracticeSelectedTopic({ topic, source, label, className }: { topic: Topic; source: HandoffSource; label?: ReactNode; className?: string }) {
  const [failed, setFailed] = useState(false);
  const es = handoffSources[source].locale === "es";
  return <div className="my-3">
    <button type="button" className={className ?? "min-h-11 rounded-xl border border-white/20 px-4 py-2 font-semibold text-[var(--neon-cyan)]"} onClick={() => {
      track(`handoff_${source}_click`, { content_source: source });
      try {
        const value: Handoff = { topic, source, at: Date.now(), ...(source === "timer" ? { from: window.location.pathname } : {}) };
        const key = handoffKey();
        window.sessionStorage.setItem(key, JSON.stringify(value));
        if (!parseHandoff(window.sessionStorage.getItem(key))) throw new Error("storage");
        const diagnostics = key.endsWith("-qa") ? `?usage_qa=1&speech_qa=1${new URLSearchParams(window.location.search).get("measure") === "1" ? "&measure=1" : ""}` : "";
        window.location.assign(`${es ? "/es" : ""}/speech${diagnostics}#selected-topic`);
      } catch { setFailed(true); track(`handoff_${source}_error`); }
    }}>{label ?? (es ? "Practicar este tema →" : "Practice this topic →")}</button>
    {failed && <p role="status" className="mt-2 text-sm">{es ? "No se pudo trasladar el tema. Cópialo y abre el temporizador." : "Could not carry this topic over. Copy it, then open the practice timer."} <a className="underline" href={es ? "/es/speech" : "/speech"}>{es ? "Abrir práctica" : "Open practice"}</a></p>}
  </div>;
}

