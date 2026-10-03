import Link from "next/link";
import { topicWorkshops } from "@/data/topicWorkshops";
import { getLocalizedTopics } from "@/data/topics.es";
export default function TopicWorkshop({mode, category, locale = "en"}: {mode: string; category: string; locale?: "en" | "es"}) {
  const workshop = topicWorkshops[`${mode}/${category}`];
  if (!workshop) return null;
  const c = workshop[locale], es = locale === "es";
  const topic = getLocalizedTopics(locale).find(t=>t.id===workshop.topicId);
  return <section id="topic-workshop" data-topic-workshop={`${mode}/${category}`} className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 scroll-mt-24">
    <div className="glass-card p-5 sm:p-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs uppercase text-[var(--neon-cyan)]">{es ? "Del tema a la práctica" : "From prompt to practice"}</p><Link href={`${es ? "" : "/es"}/${mode}/${category}#topic-workshop`} hrefLang={es ? "en" : "es"} className="text-sm underline text-[var(--neon-cyan)] py-3">{es ? "Read in English" : "Leer en español"}</Link></div>
      <h2 className="text-2xl font-bold">{c.title}</h2><p className="text-[var(--text-secondary)] leading-relaxed">{c.intro}</p>
      <p className="text-sm"><strong>{es ? "Tema de esta colección: " : "Prompt from this collection: "}</strong>{topic?.text}</p>
      <div className="border-l-2 border-[var(--neon-cyan)] pl-4 space-y-2"><h3 className="font-semibold">{es ? "Ejemplo elaborado" : "Worked example"}</h3><p className="text-[var(--text-secondary)] leading-relaxed">{c.example}</p></div>
      <div><h3 className="font-semibold">{es ? "Pruébalo paso a paso" : "Try it step by step"}</h3><ol className="list-decimal pl-5 space-y-3 mt-3 text-[var(--text-secondary)] leading-relaxed">{c.steps.map(s=><li key={s}>{s}</li>)}</ol></div>
      <div><h3 className="font-semibold">{es ? "Antes de terminar" : "Before you finish"}</h3><ul className="list-disc pl-5 mt-3 space-y-2 text-[var(--text-secondary)]">{c.checks.map(s=><li key={s}>{s}</li>)}</ul></div>
      <p className="text-sm text-[var(--text-secondary)]"><strong>{es ? "Siguiente intento: " : "Next attempt: "}</strong>{c.next}</p>
    </div>
  </section>;
}
