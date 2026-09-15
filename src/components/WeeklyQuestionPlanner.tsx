"use client";

import { useState } from "react";
import PrintButton from "@/components/PrintButton";
import type { PremiumCollectionConfig, PremiumPromptItem } from "@/data/premiumTypes";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  buildWeeklyQuestionPlan,
  PLAN_WEEKDAYS,
  replaceWeeklyQuestion,
  WEEKLY_PLAN_INVITATION,
  weeklyQuestionDayText,
  weeklyQuestionPlanText,
} from "@/lib/weeklyQuestionPlan";

interface WeeklyQuestionPlannerProps {
  config: Pick<PremiumCollectionConfig, "title" | "source" | "slug" | "path">;
  pool: PremiumPromptItem[];
  current: PremiumPromptItem | null;
}

const actionClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/50 disabled:cursor-not-allowed disabled:opacity-40";

export default function WeeklyQuestionPlanner({ config, pool, current }: WeeklyQuestionPlannerProps) {
  const [plan, setPlan] = useState<PremiumPromptItem[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "manual">("idle");
  const [manualText, setManualText] = useState("");
  const [notice, setNotice] = useState("");
  const isCopying = copyState === "copying";
  const canUseCurrent = Boolean(current && pool.some((item) => item.id === current.id));
  const canReplace = pool.some((item) => !plan.some((chosen) => chosen.id === item.id));

  function trackPlan(name: string, resultCount: number, extra: Record<string, string | number | boolean> = {}) {
    track(name, {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      result_count: resultCount,
      locale: "en",
      ...extra,
    });
  }

  function build(useCurrent = false) {
    if (!pool.length || isCopying) return;
    const picks = buildWeeklyQuestionPlan(pool, useCurrent ? current : null);
    setPlan(picks);
    setCopyState("idle");
    setManualText("");
    setNotice(useCurrent ? "The question above is now Monday's question. The remaining days use your filters." : "Your plan is ready. Replace any day without changing the others.");
    trackPlan("weekly_plan_generate", picks.length, {
      filtered_pool_size: pool.length,
      starting_point: useCurrent ? "current_question" : "random",
    });
  }

  function replaceDay(index: number) {
    if (isCopying) return;
    const next = replaceWeeklyQuestion(plan, pool, index);
    if (next === plan) return;
    setPlan(next);
    setCopyState("idle");
    setManualText("");
    setNotice(`${PLAN_WEEKDAYS[index]} replaced. Your other days are unchanged.`);
    trackPlan("weekly_plan_replace", next.length, { day_index: index + 1 });
  }

  async function copyPlan() {
    if (!plan.length || isCopying) return;
    setCopyState("copying");
    // Use the canonical page path, never visitor query strings or free text in a URL.
    const text = weeklyQuestionPlanText(plan, config.title, `${window.location.origin}${config.path}`);
    const copied = await copyText(text);
    setCopyState(copied ? "copied" : "manual");
    setManualText(copied ? "" : text);
    trackPlan(copied ? "weekly_plan_copy" : "weekly_plan_copy_error", plan.length, { copy_format: "facilitator_plan" });
  }

  return (
    <section id="weekly-plan" aria-labelledby="weekly-plan-title" className="mt-7 scroll-mt-24 border-t border-white/10 pt-6">
      <h3 id="weekly-plan-title" className="text-lg font-bold text-[var(--text-primary)]">Build a five-day plan</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        Keep a question you like for Monday, swap individual days, then take the questions and follow-ups into your next session.
      </p>
      <a href="#weekly-plan-filters" className="mt-2 inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] hover:underline">Choose your audience and theme ↑</a>
      <p className="text-xs text-[var(--text-muted)]">{pool.length} matching questions. Changing the filters clears the plan, so copy or print it first.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => build()} disabled={!pool.length || isCopying} className={actionClass}>Build weekly plan</button>
        {canUseCurrent && <button type="button" onClick={() => build(true)} disabled={isCopying} className={`${actionClass} border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)]`}>Start with current question</button>}
      </div>
      {pool.length === 0 && <p className="mt-3 text-sm text-[var(--text-muted)]">Clear a filter above to find questions for your plan.</p>}
      {pool.length > 0 && pool.length < 5 && <p className="mt-3 text-sm text-[var(--text-muted)]">Only {pool.length} matching {pool.length === 1 ? "question is" : "questions are"} available. This makes a {pool.length}-day plan; broaden your filters for five days.</p>}
      {notice && <p role="status" className="mt-4 text-sm text-[var(--neon-cyan)]">{notice}</p>}
      {plan.length > 0 && <>
        <ol className="mt-4 space-y-3" aria-label="Your weekly question plan">
          {plan.map((item, index) => <li key={PLAN_WEEKDAYS[index]} data-plan-day={PLAN_WEEKDAYS[index]} className="rounded-xl border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-semibold text-[var(--neon-cyan)]">{PLAN_WEEKDAYS[index]}</h4>
              <button type="button" onClick={() => replaceDay(index)} disabled={!canReplace || isCopying} aria-label={`Replace ${PLAN_WEEKDAYS[index]} question`} className={actionClass}>Replace question</button>
            </div>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--text-primary)]">{item.prompt}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              {item.followUps.map((followUp) => <li key={followUp}>{followUp}</li>)}
            </ul>
            {item.facilitationTip && <p className="mt-3 text-xs leading-relaxed text-[var(--text-muted)]">Facilitator note: {item.facilitationTip}</p>}
          </li>)}
        </ol>
        {!canReplace && <p className="mt-3 text-xs text-[var(--text-muted)]">Every matching question is already in this plan. Broaden your filters to find alternatives.</p>}
        <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">{WEEKLY_PLAN_INVITATION}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={copyPlan} disabled={isCopying} className={actionClass}>{copyState === "copied" ? "Plan copied ✓" : isCopying ? "Copying plan…" : "Copy weekly plan"}</button>
          <PrintButton heading={`${config.title} — ${plan.length}-Day Plan`} items={plan.map(weeklyQuestionDayText)} intro={WEEKLY_PLAN_INVITATION} label="Print weekly plan" />
        </div>
        {copyState === "manual" && <div role="status" className="mt-4 rounded-xl border border-[var(--neon-pink)]/30 p-4">
          <p className="text-sm text-[var(--text-secondary)]">Automatic copy is blocked. Select and copy your complete plan below.</p>
          <textarea readOnly value={manualText} onFocus={(event) => event.currentTarget.select()} aria-label="Weekly plan ready to copy" className="mt-3 min-h-48 w-full rounded-lg border border-white/10 bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)]" />
        </div>}
      </>}
    </section>
  );
}
