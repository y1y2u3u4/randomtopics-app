"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import PrintButton from "@/components/PrintButton";
import type {
  PremiumCollectionConfig,
  PremiumFilter,
  PremiumPromptItem,
} from "@/data/premiumTypes";
import type { Topic } from "@/data/types";
import {
  getEmptyTopicLibrarySnapshot,
  getFavoriteTopicsSnapshot,
  recordRecentTopics,
  subscribeToTopicLibrary,
  toggleFavoriteTopic,
} from "@/lib/topicLibrary";
import { track } from "@/lib/track";

type FilterState = Partial<Record<PremiumFilter["key"], string>>;

interface PremiumPromptToolProps {
  config: PremiumCollectionConfig;
  initialItemId?: string;
  initialDateLabel?: string;
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function itemToText(item: PremiumPromptItem, style: PremiumCollectionConfig["tool"]["copyStyle"]) {
  const prefix = style === "classroom"
    ? "Classroom question of the day"
    : style === "work"
      ? "💬 Question of the day"
      : "Discussion prompt";
  const lines = [`${prefix}: ${item.prompt}`];
  if (item.choices) lines.push(`Option A: ${item.choices[0]}`, `Option B: ${item.choices[1]}`);
  if (item.values?.length) lines.push(`Values in tension: ${item.values.join(" vs. ")}`);
  if (item.followUps.length) lines.push(`Follow-up: ${item.followUps.join(" · ")}`);
  return lines.join("\n");
}

function toTopic(item: PremiumPromptItem, config: PremiumCollectionConfig): Topic {
  return {
    id: `premium-${config.slug}-${item.id}`,
    text: item.prompt,
    category: config.library.category,
    modes: config.library.modes,
    depth: item.depth.toLowerCase() as Topic["depth"],
    talkingPoints: item.followUps.slice(0, 3),
  };
}

function pickWithoutRepeats(pool: PremiumPromptItem[], used: Set<string>, count = 1) {
  let candidates = pool.filter((item) => !used.has(item.id));
  if (candidates.length < count) candidates = pool;
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export default function PremiumPromptTool({
  config,
  initialItemId,
  initialDateLabel,
}: PremiumPromptToolProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [currentId, setCurrentId] = useState<string | null>(initialItemId ?? null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState<PremiumPromptItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [planCopied, setPlanCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const favorites = JSON.parse(
    useSyncExternalStore(
      subscribeToTopicLibrary,
      getFavoriteTopicsSnapshot,
      getEmptyTopicLibrarySnapshot,
    ),
  ) as Topic[];

  const pool = useMemo(
    () => config.items.filter((item) =>
      config.filters.every((filter) => {
        const value = filters[filter.key];
        return !value || item[filter.key] === value;
      })
    ),
    [config.filters, config.items, filters]
  );

  const current = useMemo(
    () => config.items.find((item) => item.id === currentId) ?? null,
    [config.items, currentId]
  );

  const saved = current
    ? favorites.some((topic) => topic.id === `premium-${config.slug}-${current.id}`)
    : false;

  const changeFilter = useCallback((filter: PremiumFilter, value: string) => {
    setFilters((previous) => ({ ...previous, [filter.key]: value || undefined }));
    setCurrentId(null);
    setPlan([]);
    setUsed(new Set());
    track("filter_select", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      filter_name: filter.key,
      filter_value: value || "all",
      locale: "en",
    });
  }, [config.slug, config.source]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setCurrentId(config.tool.daily ? initialItemId ?? null : null);
    setPlan([]);
    setUsed(new Set());
    track("filter_clear", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      locale: "en",
    });
  }, [config.slug, config.source, config.tool.daily, initialItemId]);

  const generate = useCallback(() => {
    if (pool.length === 0) return;
    track("generate_start", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      requested_count: 1,
      filtered_pool_size: pool.length,
      locale: "en",
    });
    const [pick] = pickWithoutRepeats(pool, used);
    if (!pick) return;
    const nextUsed = new Set(used);
    nextUsed.add(pick.id);
    setUsed(nextUsed);
    setCurrentId(pick.id);
    setCopied(false);
    setShared(false);
    recordRecentTopics([toTopic(pick, config)]);
    track("generate_success", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      result_category: pick.category,
      result_audience: pick.audience,
      result_use_case: pick.useCase,
      result_count: 1,
      result_source: "editorial_pool",
      locale: "en",
    });
  }, [config, pool, used]);

  const buildPlan = useCallback(() => {
    if (pool.length === 0) return;
    const picks = pickWithoutRepeats(pool, new Set(), 5);
    setPlan(picks);
    track("weekly_plan_generate", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      result_count: picks.length,
      filtered_pool_size: pool.length,
      locale: "en",
    });
  }, [config.slug, config.source, pool]);

  const copy = useCallback(async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(itemToText(current, config.tool.copyStyle));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      track("copy_result", {
        tool_type: "premium_prompt_collection",
        content_source: config.source,
        collection_slug: config.slug,
        result_category: current.category,
        locale: "en",
      });
    } catch {
      setCopied(false);
    }
  }, [config.slug, config.source, config.tool.copyStyle, current]);

  const copyPlan = useCallback(async () => {
    if (plan.length === 0) return;
    try {
      const text = plan.map((item, index) => `${WEEKDAYS[index]}: ${item.prompt}`).join("\n");
      await navigator.clipboard.writeText(text);
      setPlanCopied(true);
      window.setTimeout(() => setPlanCopied(false), 1600);
      track("weekly_plan_copy", {
        tool_type: "premium_prompt_collection",
        content_source: config.source,
        collection_slug: config.slug,
        result_count: plan.length,
        locale: "en",
      });
    } catch {
      setPlanCopied(false);
    }
  }, [config.slug, config.source, plan]);

  const share = useCallback(async () => {
    if (!current) return;
    const text = itemToText(current, config.tool.copyStyle);
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: config.title, text, url: window.location.href });
        track("share_result", {
          tool_type: "premium_prompt_collection",
          content_source: config.source,
          collection_slug: config.slug,
          share_method: "native",
          locale: "en",
        });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        track("share_result", {
          tool_type: "premium_prompt_collection",
          content_source: config.source,
          collection_slug: config.slug,
          share_method: "clipboard",
          locale: "en",
        });
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }
  }, [config, current]);

  const save = useCallback(() => {
    if (!current) return;
    const isNowSaved = toggleFavoriteTopic(toTopic(current, config));
    track(isNowSaved ? "save_result" : "unsave_result", {
      tool_type: "premium_prompt_collection",
      content_source: config.source,
      collection_slug: config.slug,
      result_category: current.category,
      locale: "en",
    });
  }, [config, current]);

  const printItems = pool.map((item) => itemToText(item, config.tool.copyStyle));

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6" aria-labelledby="premium-tool-title">
      <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-br from-[rgba(0,229,255,0.05)] to-[rgba(255,45,120,0.04)]">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Built-in guided tool</p>
          <h2 id="premium-tool-title" className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {config.tool.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
            {config.tool.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-7">
          {config.filters.map((filter) => (
            <label key={filter.key} className="text-xs font-semibold text-[var(--text-muted)]">
              {filter.label}
              <select
                value={filters[filter.key] ?? ""}
                onChange={(event) => changeFilter(filter, event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2.5 text-sm text-[var(--text-primary)]"
              >
                <option value="">{filter.allLabel}</option>
                {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-3 text-center text-xs text-[var(--text-muted)]">
          {pool.length > 0 ? (
            <p>{pool.length} matching {config.promptNoun}{pool.length === 1 ? "" : "s"} · no repeats until the matching set is complete</p>
          ) : (
            <p role="status" className="text-[var(--neon-pink)]">No exact matches. Clear one filter or reset all filters.</p>
          )}
          {Object.values(filters).some(Boolean) && (
            <button type="button" onClick={clearFilters} className="mt-2 text-[var(--neon-cyan)] hover:underline">Clear all filters</button>
          )}
        </div>

        <div className="mt-5 min-h-[16rem] rounded-2xl border border-white/10 bg-black/10 px-5 py-7 sm:px-8 flex items-center justify-center" aria-live="polite">
          {current ? (
            <div className="w-full max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">
                {config.tool.daily && current.id === initialItemId
                  ? `Today's prompt${initialDateLabel ? ` · ${initialDateLabel}` : ""}`
                  : `${current.category} · ${current.audience}`}
              </p>
              <p className="mt-3 text-xl sm:text-2xl font-semibold leading-relaxed text-[var(--text-primary)]">{current.prompt}</p>
              {current.choices && (
                <div className="grid sm:grid-cols-2 gap-3 mt-5 text-left">
                  <div className="rounded-xl border border-[var(--neon-cyan)]/20 bg-[rgba(0,229,255,0.04)] p-4 text-sm text-[var(--text-secondary)]"><strong className="text-[var(--neon-cyan)]">Option A:</strong> {current.choices[0]}</div>
                  <div className="rounded-xl border border-[var(--neon-pink)]/20 bg-[rgba(255,45,120,0.04)] p-4 text-sm text-[var(--text-secondary)]"><strong className="text-[var(--neon-pink)]">Option B:</strong> {current.choices[1]}</div>
                </div>
              )}
              {current.values?.length ? (
                <p className="mt-4 text-xs text-[var(--text-muted)]">Values in tension: {current.values.join(" · ")}</p>
              ) : null}
              {current.followUps.length > 0 && (
                <div className="mt-5 text-left rounded-xl border border-white/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Follow-up prompts</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-[var(--text-secondary)] list-disc pl-5">
                    {current.followUps.map((followUp) => <li key={followUp}>{followUp}</li>)}
                  </ul>
                </div>
              )}
              {current.facilitationTip && <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">Facilitator note: {current.facilitationTip}</p>}
            </div>
          ) : (
            <p className="text-center text-sm text-[var(--text-muted)] max-w-lg">{config.tool.emptyLabel}</p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={generate} disabled={pool.length === 0} className="btn-generate disabled:cursor-not-allowed disabled:opacity-40">
            <span aria-hidden="true">🎲</span> {pool.length === 0 ? "No matching results" : current ? `Next ${config.promptNoun}` : config.tool.actionLabel}
          </button>
          {current && (
            <>
              <button type="button" onClick={copy} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">{copied ? "Copied ✓" : config.tool.copyStyle === "work" ? "Copy for Slack / Teams" : "Copy"}</button>
              <button type="button" onClick={save} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">{saved ? "Saved ★" : "Save ☆"}</button>
              <button type="button" onClick={share} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-pink)]/50 transition-colors">{shared ? "Shared ✓" : "Share"}</button>
            </>
          )}
          {pool.length > 0 && (
            <PrintButton
              heading={config.title}
              items={printItems}
              intro={`${pool.length} filtered ${config.promptNoun}${pool.length === 1 ? "" : "s"} from Random Topics.`}
              label={`Print ${pool.length}`}
            />
          )}
          {config.tool.daily && currentId !== initialItemId && initialItemId && (
            <button type="button" onClick={() => setCurrentId(initialItemId)} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">Back to today&apos;s</button>
          )}
        </div>

        {config.tool.planner && (
          <div className="mt-7 border-t border-white/10 pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Build a five-day plan</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Generate one filtered prompt for each weekday, then copy or print the plan.</p>
              </div>
              <button type="button" onClick={buildPlan} disabled={pool.length === 0} className="px-5 py-2.5 rounded-xl text-sm border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:bg-[rgba(0,229,255,0.06)] transition-colors disabled:cursor-not-allowed disabled:opacity-40">Build weekly plan</button>
            </div>
            {plan.length > 0 && (
              <div className="mt-4 space-y-2">
                {plan.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-[var(--text-secondary)]">
                    <strong className="text-[var(--text-primary)]">{WEEKDAYS[index]}:</strong> {item.prompt}
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="button" onClick={copyPlan} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">{planCopied ? "Plan copied ✓" : "Copy weekly plan"}</button>
                  <PrintButton heading={`${config.title} — Weekly Plan`} items={plan.map((item, index) => `${WEEKDAYS[index]}: ${item.prompt}`)} label="Print weekly plan" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
