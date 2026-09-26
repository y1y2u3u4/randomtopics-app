"use client";

import { useEffect, useId, useRef, useState } from "react";
import GeneratedResultActions from "./GeneratedResultActions";
import type { QotdCategory } from "@/data/questionOfTheDay";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";
import { observeVisibleAction } from "@/lib/speech/visibleAction";

const params = { tool_type: "question_of_the_day", content_source: "qotd_hub", action_surface: "qotd_list", entry_variant: "list_direct_v2", locale: "en" };

export default function QotdListActions({ question, category, index }: { question: string; category: QotdCategory; index: number }) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "pending" | "copied" | "failed">("idle");
  const button = useRef<HTMLButtonElement>(null);
  const pending = useRef(false);
  const manualId = useId();
  useEffect(() => {
    if (!button.current) return;
    return observeVisibleAction(button.current, () => track("qotd_list_copy_view_v2", params));
  }, []);
  async function copyQuestion() {
    if (pending.current) return;
    pending.current = true;
    setCopyState("pending");
    track("qotd_list_copy_click_v2", params);
    let copied = false;
    try { copied = await copyText(question); }
    catch { /* Keep the displayed question available for manual copying. */ }
    finally { pending.current = false; }
    setCopyState(copied ? "copied" : "failed");
    track(copied ? "copy_result" : "copy_error", params);
    track(copied ? "qotd_list_quick_copy_v2" : "qotd_list_quick_copy_error_v2", params);
  }
  return <div className="mt-2">
    <button ref={button} type="button" disabled={copyState === "pending"} onClick={copyQuestion} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 text-xs font-semibold text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/40 disabled:opacity-50">
      {copyState === "pending" ? "Copying…" : copyState === "copied" ? "Copied ✓" : "Copy question"}
    </button>
    {copyState === "copied" && <span role="status" className="sr-only">Question copied</span>}
    {copyState === "failed" && <div className="mt-2 rounded-lg border border-amber-300/30 p-3">
      <p role="status" className="text-xs text-amber-100">Automatic copy was blocked. Copy the text below manually or try again.</p>
      <label htmlFor={manualId} className="block mt-2 text-xs">Question to copy manually</label>
      <textarea id={manualId} readOnly value={question} rows={3} onFocus={event => event.currentTarget.select()} className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 p-2 text-sm" />
    </div>}
    <details onToggle={(event) => {
    setOpen(event.currentTarget.open);
    if (event.currentTarget.open) track("qotd_list_open", { tool_type: "question_of_the_day", content_source: "qotd_hub", action_surface: "qotd_list", locale: "en" });
  }} className="inline-block align-top ml-3 max-w-full">
    <summary className="inline-flex min-h-11 cursor-pointer items-center text-xs font-semibold text-[var(--neon-cyan)]">Save or share this question</summary>
    {open && <div className="py-2"><GeneratedResultActions text={question} copyLabel="Copy question" shareTitle="Question of the Day"
      saveTopic={{ id: `qotd-${index}`, text: question, category: "relationships", modes: ["conversation", "icebreaker"], depth: category === "deep" ? "deep" : "light", talkingPoints: [] }}
      toolType="question_of_the_day" contentSource="qotd_hub" actionSurface="qotd_list" isPostGenerate={false} showSavedLink compact />
    </div>}
    </details>
  </div>;
}
