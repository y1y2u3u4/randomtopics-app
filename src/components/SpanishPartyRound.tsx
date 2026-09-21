"use client";

import { useEffect, useMemo, useState } from "react";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import { drawUnseen } from "@/lib/topicPool";
import { track } from "@/lib/track";

interface SpanishPartyRoundProps {
  groups: { label: string; items: string[] }[];
}

interface Round {
  items: string[];
  groupId: string;
  groupLabel: string;
  index: number;
  skipped: number[];
}

const source = "es_most_likely_article";
const eventParams = { tool_type: "inline_question_generator", content_source: source, locale: "es" };
const playRule = "Lee cada pregunta y voten todos a la cuenta de tres. Cualquiera puede pasar sin dar explicaciones.";
const secondaryButton = "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] disabled:opacity-50";

/** A round stays intact while the host prepares the next set of filters. */
export default function SpanishPartyRound({ groups }: SpanishPartyRoundProps) {
  const allItems = useMemo(() => [...new Set(groups.flatMap((group) => group.items))], [groups]);
  const [activeGroup, setActiveGroup] = useState("all");
  const [size, setSize] = useState(5);
  const [used, setUsed] = useState<Set<string>>(() => new Set());
  const [round, setRound] = useState<Round | null>(null);
  const [categoryNotice, setCategoryNotice] = useState("");
  useEffect(() => {
    const selectCategory = (event: Event) => {
      const groupId = (event as CustomEvent<{ groupId?: string }>).detail?.groupId;
      const index = groups.findIndex((_, index) => `group_${index}` === groupId);
      if (index < 0) return;
      setActiveGroup(`group_${index}`);
      setCategoryNotice(`Categoría elegida: ${groups[index].label}. Pulsa Preparar ronda para usarla. Tu ronda actual se conserva hasta preparar otra.`);
    };
    window.addEventListener("rt:party-category", selectCategory);
    return () => window.removeEventListener("rt:party-category", selectCategory);
  }, [groups]);
  const selectedGroup = groups.find((_, index) => `group_${index}` === activeGroup);
  const pool = [...new Set(selectedGroup?.items ?? allItems)];
  const roundItems = round?.items.filter((_, index) => !round.skipped.includes(index)) ?? [];
  const current = round?.items[round.index];
  const completed = !!round && !current;
  const roundId = `es-most-likely-round-${roundItems.map((item) => allItems.indexOf(item)).join("-")}`;
  const roundText = round ? `Quién es más probable · ${round.groupLabel}\n${playRule}\n\n${roundItems.map((item, index) => `${index + 1}. ${item}`).join("\n")}` : "";

  function createRound() {
    if (!pool.length) return;
    const params = { ...eventParams, generator_category: activeGroup, requested_count: size };
    if (round) track("repeat_generate", params);
    track("generate_start", params);
    setCategoryNotice("");
    const draw = drawUnseen(pool, used, (item) => item, size);
    setUsed(draw.used);
    setRound({ items: draw.picked, groupId: activeGroup, groupLabel: selectedGroup?.label ?? "Todas las categorías", index: 0, skipped: [] });
    track("generate_success", { ...params, result_count: draw.picked.length, result_source: "article_collection" });
  }

  function advance(skip: boolean) {
    if (!round || !current) return;
    const skipped = skip ? [...round.skipped, round.index] : round.skipped;
    const index = round.index + 1;
    setRound({ ...round, skipped, index });
    track(skip ? "party_round_skip" : "party_round_advance", {
      ...eventParams, generator_category: round.groupId, round_size: round.items.length, round_position: index,
    });
    if (index === round.items.length) track("party_round_complete", {
      ...eventParams, generator_category: round.groupId, round_size: round.items.length,
      played_count: round.items.length - skipped.length, skipped_count: skipped.length,
    });
  }

  return (
    <div id={`generator-${source}`} className="glass-card scroll-mt-24 p-5 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-br from-[rgba(0,229,255,0.05)] to-[rgba(255,45,120,0.04)]">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Una ronda lista para tu grupo</p>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Juega a Quién Es Más Probable</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">Elige la categoría y prepara 5 o 10 preguntas. Léanlas una a una, pasen las que no encajen y copien la ronda para el chat.</p>
      </div>

      {categoryNotice && <p role="status" className="mt-4 rounded-xl border border-[var(--neon-cyan)]/30 p-3 text-sm text-[var(--neon-cyan)]">{categoryNotice}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label className="min-w-0 text-sm text-[var(--text-secondary)]">
          {round ? "Categoría para la próxima ronda" : "Elige una categoría"}
          <select value={activeGroup} onChange={(event) => {
            setActiveGroup(event.target.value);
            track("filter_select", { ...eventParams, filter_name: "collection_section", filter_value: event.target.value });
          }} className="mt-2 block min-h-11 w-full min-w-0 rounded-xl border border-white/20 bg-[#11111f] px-3 py-3 text-sm text-[var(--text-primary)] focus:outline-2 focus:outline-[var(--neon-cyan)]">
            <option value="all">Todas las categorías · {allItems.length}</option>
            {groups.map((group, index) => <option key={group.label} value={`group_${index}`}>{group.label} · {new Set(group.items).size}</option>)}
          </select>
        </label>
        <fieldset>
          <legend className="text-sm text-[var(--text-secondary)]">Preguntas por ronda</legend>
          <div className="mt-2 flex gap-2">
            {[5, 10].map((count) => <button key={count} type="button" aria-pressed={size === count} onClick={() => {
              setSize(count);
              track("filter_select", { ...eventParams, filter_name: "round_size", filter_value: count });
            }} className={`${secondaryButton} ${size === count ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.08)] text-[var(--neon-cyan)]" : ""}`}>{count}</button>)}
          </div>
        </fieldset>
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">{pool.length} preguntas disponibles · sin repeticiones hasta recorrer la categoría.</p>
      <div className="mt-4 text-center">
        <button type="button" data-generate-button onClick={createRound} disabled={!pool.length} className="btn-generate disabled:opacity-50">
          <span aria-hidden="true">🎲</span> {round ? "Preparar otra ronda" : "Preparar ronda"}
        </button>
        {round ? <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">Los filtros se aplican al preparar otra ronda. Copia o guarda esta antes de reemplazarla.</p> : null}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 px-4 py-6 sm:px-6" aria-live="polite">
        {!round ? <p className="py-4 text-center text-sm text-[var(--text-muted)]">Prepara una ronda para ver la primera pregunta. Puedes revisar las {allItems.length} preguntas en la lista de abajo.</p> : <>
          <p className="text-center text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
            {completed ? "Ronda terminada" : `Pregunta ${round.index + 1} de ${round.items.length}`}
          </p>
          <p className="mt-2 text-center text-xs text-[var(--text-muted)]">{round.groupLabel}</p>
          {current ? <>
            <p data-party-current className="mt-4 text-center text-xl font-semibold leading-relaxed text-[var(--text-primary)] sm:text-2xl">{current}</p>
            <p className="mt-4 text-center text-sm leading-relaxed text-[var(--text-muted)]">{playRule}</p>
            <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
              <button type="button" onClick={() => advance(false)} className={secondaryButton}>{round.index + 1 === round.items.length ? "Terminar ronda" : "Ya jugamos · siguiente"}</button>
              <button type="button" onClick={() => advance(true)} className={secondaryButton}>Saltar esta pregunta</button>
            </div>
            <div className="mt-4">
              <GeneratedResultActions key={current} text={current} copyLabel="Copiar pregunta" shareTitle="Quién es más probable"
                saveTopic={{ id: `inline-${source}-${allItems.indexOf(current)}`, text: current, category: "relationships", modes: ["icebreaker", "conversation"], depth: "light", talkingPoints: [] }}
                locale="es" toolType="inline_question_generator" contentSource={source} actionSurface="party_round_question" isPostGenerate />
            </div>
          </> : <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">{round.items.length - round.skipped.length} jugadas · {round.skipped.length} omitidas. Reutiliza la selección o prepara otra ronda.</p>}
        </>}
      </div>

      {round ? <div className="mt-5 rounded-2xl border border-white/10 p-4 sm:p-5">
        <h3 className="text-center font-semibold text-[var(--text-primary)]">Tu ronda para compartir · {roundItems.length} preguntas</h3>
        <p className="mt-2 text-center text-xs leading-relaxed text-[var(--text-muted)]">Incluye las preguntas jugadas y las pendientes. Las que saltas se quitan de la selección.</p>
        {roundItems.length ? <>
          <details className="mt-3">
            <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[var(--neon-cyan)]">Revisar preguntas de la ronda</summary>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--text-secondary)]">
              {roundItems.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </details>
          <GeneratedResultActions key={roundId} text={`Ronda de Quién es más probable · ${round.groupLabel}`} copyValue={roundText}
            copyLabel="Copiar ronda para el grupo" copyAsGroupMessage shareTitle="Ronda de Quién es más probable"
            saveTopic={{ id: roundId, text: `Ronda de Quién es más probable · ${round.groupLabel}`, category: "relationships", modes: ["icebreaker", "conversation"], depth: "light", talkingPoints: [playRule, ...roundItems] }}
            locale="es" toolType="inline_question_generator" contentSource={source} actionSurface="party_round_collection" isPostGenerate />
        </> : <p className="mt-4 text-center text-sm text-[var(--text-muted)]">Has omitido todas las preguntas. Prepara otra ronda para crear una nueva selección.</p>}
      </div> : null}
    </div>
  );
}
