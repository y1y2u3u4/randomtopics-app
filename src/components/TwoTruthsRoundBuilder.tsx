"use client";

import { useState } from "react";
import { TWO_TRUTHS_IDEA_GROUPS, TWO_TRUTHS_IDEA_COUNT } from "@/data/twoTruthsIdeas";
import { drawStatementIdeas, formatPlayerRound, isCompleteRound } from "@/lib/twoTruthsRound";
import { track } from "@/lib/track";
import GeneratedResultActions from "@/components/GeneratedResultActions";

const SOURCE = "two_truths_ideas_article";
const ALL_IDEAS = TWO_TRUTHS_IDEA_GROUPS.flatMap((group) => [...group.items]);

export default function TwoTruthsRoundBuilder() {
  const [category, setCategory] = useState("work");
  const [statements, setStatements] = useState<string[]>([...TWO_TRUTHS_IDEA_GROUPS[0].items.slice(0, 3)]);
  const [used, setUsed] = useState<Set<string>>(() => new Set(TWO_TRUTHS_IDEA_GROUPS[0].items.slice(0, 3)));
  const [lie, setLie] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [roundNumber, setRoundNumber] = useState(0);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [error, setError] = useState("");
  const pool = category === "all" ? ALL_IDEAS : TWO_TRUTHS_IDEA_GROUPS.find((group) => group.id === category)?.items ?? [];
  const valid = isCompleteRound(statements);
  const playerText = formatPlayerRound(statements);
  const eventParams = { tool_type: "two_truths_round_builder", content_source: SOURCE, generator_category: category, locale: "en" };

  const draw = () => {
    track("generate_start", { ...eventParams, requested_count: 3 });
    const result = drawStatementIdeas(pool, used);
    if (!result) {
      setError("This category needs at least three ideas. Please choose another category.");
      track("generate_error", { ...eventParams, error_code: "insufficient_ideas" });
      return;
    }
    if (roundNumber) track("repeat_generate", eventParams);
    setStatements(result.statements);
    setUsed(result.used);
    setLie(null);
    setRevealed(false);
    setRoundId(crypto.randomUUID());
    setRevision(0);
    setRoundNumber((value) => value + 1);
    setError("");
    track("generate_success", { ...eventParams, result_count: 3, result_source: "article_statement_ideas" });
  };

  return (
    <section id={`generator-${SOURCE}`} aria-labelledby="two-truths-builder-title" className="glass-card scroll-mt-24 border-[var(--neon-cyan)]/25 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--neon-cyan)]">Build your round</p>
          <h2 id="two-truths-builder-title" className="mt-1 text-2xl font-bold">Three statements. One believable lie.</h2>
        </div>
        <a href="#two-truths-collection" className="min-h-11 text-sm text-[var(--neon-cyan)] underline underline-offset-4">Browse all {TWO_TRUTHS_IDEA_COUNT} ideas</a>
      </div>
      <p id="two-truths-edit-help" className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
        These are suggestions, not facts about you. Edit two to be true and one to be false, then select your lie. Keep this editor private and share the copied statements with your group. Avoid private details; anyone can pass.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold">
          Audience or style
          <select value={category} onChange={(event) => {
            setCategory(event.target.value);
            track("filter_select", { ...eventParams, filter_name: "audience", filter_value: event.target.value });
          }} className="mt-2 block min-h-11 w-full rounded-xl border border-white/20 bg-[#11111f] px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]">
            {TWO_TRUTHS_IDEA_GROUPS.map((group) => <option key={group.id} value={group.id}>{group.label} — {group.items.length} ideas</option>)}
            <option value="all">All {TWO_TRUTHS_IDEA_COUNT} ideas</option>
          </select>
        </label>
        <button type="button" data-generate-button onClick={draw} className="btn-generate min-h-12 shrink-0 text-base">Draw 3 ideas</button>
      </div>
      <p className="mt-2 text-sm text-[var(--text-muted)]">The filter applies to your next draw. Ideas do not repeat until that pool is exhausted.</p>
      <fieldset className="mt-6 space-y-3" aria-describedby="two-truths-edit-help">
        <legend className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">{roundNumber ? `Round ${roundNumber} — make it yours` : "Example round — edit it or draw new ideas"}</legend>
        {statements.map((statement, index) => (
          <div key={index} className="rounded-xl border border-white/15 bg-black/15 p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor={`two-truths-statement-${index}`} className="text-sm font-semibold">Statement {index + 1}</label>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="radio" name="two-truths-lie" aria-label={`Statement ${index + 1} is my lie`} checked={lie === index} onChange={() => {
                  setLie(index);
                  if (!roundId) setRoundId(crypto.randomUUID());
                  setRevealed(false);
                  track("round_lie_select", { ...eventParams, statement_number: index + 1 });
                }} className="h-4 w-4 accent-[var(--neon-cyan)]" />
                This is my lie
              </label>
            </div>
            <textarea id={`two-truths-statement-${index}`} value={statement} maxLength={240} rows={2} onChange={(event) => {
              setStatements((current) => current.map((text, itemIndex) => itemIndex === index ? event.target.value : text));
              setRevealed(false);
              setRevision((value) => value + 1);
            }} className="block w-full resize-y rounded-lg border border-white/15 bg-[#11111f] p-3 text-base leading-relaxed focus-visible:outline-2 focus-visible:outline-[var(--neon-cyan)]" />
          </div>
        ))}
      </fieldset>
      {error ? <p role="alert" className="mt-3 text-sm text-[var(--neon-pink)]">{error}</p> : null}
      <p className="mt-4 text-sm text-[var(--text-secondary)]" role="status">
        {!valid ? "Write three different, non-empty statements before copying your round." : lie === null ? "Choose which statement is your lie to prepare the round." : "Ready to play. Copy and share include only the statements — never your answer."}
      </p>
      {valid && lie !== null && roundId ? (
        <div className="mt-4">
          <GeneratedResultActions
            text={playerText}
            copyValue={playerText}
            copyLabel="Copy my 3 statements"
            shareTitle="Two Truths and a Lie"
            saveTopic={{ id: `two-truths-round-${roundId}-${revision}`, text: playerText, category: "entertainment", modes: ["icebreaker"], depth: "light", talkingPoints: [] }}
            toolType="two_truths_round_builder"
            contentSource={SOURCE}
            actionSurface="article_round_builder"
            isPostGenerate={roundNumber > 0}
            actionViewIdentity={roundId}
          />
          <div className="mt-3 text-center">
            <button type="button" aria-expanded={revealed} aria-controls="two-truths-answer" onClick={() => {
              setRevealed((value) => !value);
              if (!revealed) track("round_reveal", eventParams);
            }} className="min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm">{revealed ? "Hide answer" : "Reveal answer after voting"}</button>
            <p id="two-truths-answer" className="mt-2 min-h-6 text-base text-[var(--neon-cyan)]" aria-live="polite">{revealed ? `Your chosen lie is statement ${lie + 1}.` : ""}</p>
          </div>
          <p className="text-center text-sm text-[var(--text-muted)]">Saving stores only your three statements in this browser — not your answer. Edited statements are not sent in analytics events.</p>
        </div>
      ) : null}
    </section>
  );
}
