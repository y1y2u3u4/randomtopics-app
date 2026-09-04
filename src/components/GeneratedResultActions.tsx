"use client";

import { useCallback, useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import type { Topic } from "@/data/types";
import type { Locale } from "@/i18n/config";
import { copyText, shareText } from "@/lib/clipboard";
import {
  getEmptyTopicLibrarySnapshot,
  getFavoriteTopicsSnapshot,
  subscribeToTopicLibrary,
  toggleFavoriteTopic,
} from "@/lib/topicLibrary";
import { track } from "@/lib/track";

interface GeneratedResultActionsProps {
  text: string;
  copyValue?: string;
  shareTitle: string;
  copyLabel?: string;
  saveTopic?: Topic;
  locale?: Locale;
  toolType: string;
  contentSource: string;
  actionSurface?: string;
  isPostGenerate?: boolean;
  compact?: boolean;
}

export default function GeneratedResultActions({
  text,
  copyValue = text,
  shareTitle,
  copyLabel,
  saveTopic,
  locale = "en",
  toolType,
  contentSource,
  actionSurface = "result_action_bar",
  isPostGenerate = true,
  compact = false,
}: GeneratedResultActionsProps) {
  const isSpanish = locale === "es";
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState<"native" | "clipboard" | null>(null);
  const [saveError, setSaveError] = useState(false);
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);
  const favoriteSnapshot = useSyncExternalStore(
    subscribeToTopicLibrary,
    getFavoriteTopicsSnapshot,
    getEmptyTopicLibrarySnapshot,
  );
  const saved = saveTopic
    ? (JSON.parse(favoriteSnapshot) as Topic[]).some((topic) => topic.id === saveTopic.id)
    : false;
  const eventParams = useMemo(() => ({
    tool_type: toolType,
    content_source: contentSource,
    result_type: "topic",
    action_surface: actionSurface,
    locale,
  }), [actionSurface, contentSource, locale, toolType]);
  const resultIdentity = saveTopic?.id ?? copyValue;
  const manualCopyId = useId();
  const buttonClass = compact
    ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]"
    : "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)]";

  const recordPostGenerate = useCallback((eventName: "copy" | "save" | "share") => {
    if (!isPostGenerate) return;
    track(`post_generate_${eventName}`, eventParams);
  }, [eventParams, isPostGenerate]);

  useEffect(() => {
    if (!isPostGenerate) return;
    track("post_generate_actions_view", eventParams);
  }, [eventParams, isPostGenerate, resultIdentity]);

  const handleCopy = useCallback(async () => {
    if (!(await copyText(copyValue))) {
      setCopied(false);
      setManualCopyText(copyValue);
      track("copy_error", eventParams);
      return;
    }
    setManualCopyText(null);
    setCopied(true);
    track("copy_result", eventParams);
    recordPostGenerate("copy");
    window.setTimeout(() => setCopied(false), 1800);
  }, [copyValue, eventParams, recordPostGenerate]);

  const handleSave = useCallback(() => {
    if (!saveTopic) return;
    const result = toggleFavoriteTopic(saveTopic);
    if (!result.persisted) {
      setSaveError(true);
      track("save_error", eventParams);
      return;
    }
    setSaveError(false);
    track(result.saved ? "save_result" : "remove_saved_result", eventParams);
    if (result.saved) recordPostGenerate("save");
  }, [eventParams, recordPostGenerate, saveTopic]);

  const handleShare = useCallback(async () => {
    const result = await shareText({
      title: shareTitle,
      text: copyValue,
      url: `${window.location.origin}${window.location.pathname}`,
    });
    if (result.status === "aborted") return;
    if (result.status === "failed") {
      setShared(null);
      setManualCopyText(result.fallbackText);
      track("share_error", eventParams);
      return;
    }
    setManualCopyText(null);
    setShared(result.method);
    track("share_result", { ...eventParams, share_method: result.method });
    if (isPostGenerate) {
      track("post_generate_share", { ...eventParams, share_method: result.method });
    }
    window.setTimeout(() => setShared(null), 1800);
  }, [copyValue, eventParams, isPostGenerate, shareTitle]);

  return (
    <div>
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="group"
        aria-label={isSpanish ? "Acciones del resultado" : "Result actions"}
      >
        <button type="button" onClick={handleCopy} className={`${buttonClass} border-[var(--neon-cyan)]/30 bg-[rgba(0,229,255,0.06)] text-[var(--neon-cyan)]`}>
          <span aria-hidden="true">{copied ? "✓" : "⧉"}</span>
          {copied
            ? (isSpanish ? "Copiado" : "Copied")
            : (copyLabel ?? (isSpanish ? "Copiar tema + ideas" : "Copy topic + points"))}
        </button>
        {saveTopic ? (
          <button
            type="button"
            onClick={handleSave}
            aria-pressed={saved}
            aria-label={saved
              ? (isSpanish ? "Quitar de guardados" : "Remove from saved topics")
              : (isSpanish ? "Guardar en este navegador" : "Save in this browser")}
            className={`${buttonClass} ${saved ? "border-[var(--neon-pink)]/40 bg-[rgba(255,45,120,0.08)] text-[var(--neon-pink)]" : "hover:border-[var(--neon-pink)]/40 hover:text-[var(--neon-pink)]"}`}
          >
            <span aria-hidden="true">{saved ? "★" : "☆"}</span>
            {saved ? (isSpanish ? "Guardado ✓" : "Saved ✓") : (isSpanish ? "Guardar" : "Save")}
          </button>
        ) : null}
        <button type="button" onClick={handleShare} className={`${buttonClass} hover:border-[var(--neon-pink)]/40 hover:text-[var(--neon-pink)]`}>
          <span aria-hidden="true">↗</span>
          {shared
            ? (shared === "clipboard"
              ? (isSpanish ? "Enlace copiado ✓" : "Link copied ✓")
              : (isSpanish ? "Compartido ✓" : "Shared ✓"))
            : (isSpanish ? "Compartir" : "Share")}
        </button>
      </div>

      <p className="mt-2 min-h-4 text-center text-[11px] text-[var(--text-muted)]" role="status" aria-live="polite">
        {saveError
          ? (isSpanish ? "Este navegador bloqueó el guardado local." : "This browser blocked local saving.")
          : saved
            ? (isSpanish ? "Guardado en este navegador; no hace falta una cuenta." : "Saved in this browser; no account needed.")
            : ""}
      </p>

      {manualCopyText ? (
        <div className="mx-auto mt-3 max-w-2xl rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-left" role="status">
          <label className="text-xs text-amber-100" htmlFor={manualCopyId}>
            {isSpanish
              ? "La acción automática está bloqueada. Selecciona el texto:"
              : "The automatic action is blocked. Select the text below:"}
          </label>
          <textarea
            id={manualCopyId}
            readOnly
            value={manualCopyText}
            rows={Math.min(6, Math.max(3, manualCopyText.split("\n").length))}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
          />
          <button type="button" onClick={() => setManualCopyText(null)} className="mt-2 text-xs text-[var(--neon-cyan)] hover:underline">
            {isSpanish ? "Cerrar" : "Dismiss"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
