"use client";
import { useEffect, useRef, useState } from "react";
import { practiceFetch } from "@/lib/speech/client";
import { speechErrorCode, trackSpeech } from "@/lib/speech/telemetry";
import { observeVisibleContent } from "@/lib/speech/visibleAction";

// One-time feedback packs for people without a subscription. Goes straight to
// Stripe Checkout (Stripe collects the email; a sign-in link follows payment).
const PACKS = [
  { pack: 5, label: "5 AI feedback rounds", price: "$2.99", note: "" },
  { pack: 20, label: "20 AI feedback rounds", price: "$6.99", note: "Most popular" },
] as const;

export default function SpeechPackOffer({ contentSource, attempt, heading = true }: { contentSource: string; attempt?: number; heading?: boolean }) {
  const card = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!card.current || seen.current) return;
    return observeVisibleContent(card.current, () => {
      seen.current = true;
      trackSpeech("speech_pack_offer_view", { content_source: contentSource, attempt });
      trackSpeech("speech_checkout_offer_view", { content_source: contentSource, attempt });
    });
  }, [contentSource, attempt]);
  async function buy(pack: 5 | 20) {
    if (busy) return;
    setBusy(pack);
    setError("");
    trackSpeech("speech_pack_checkout_start", { content_source: contentSource, pack });
    trackSpeech("speech_checkout_request", { content_source: contentSource, pack });
    try {
      const data = await practiceFetch("checkout", { pack });
      if (/^[a-f0-9]{64}$/.test(data.transactionId || "")) {
        try { sessionStorage.setItem("rt_speech_checkout_pending", data.transactionId); } catch { /* optional measurement */ }
      }
      trackSpeech("speech_checkout_redirect", { content_source: contentSource, pack });
      window.location.assign(data.url);
    } catch (e) {
      const status = (e as { status?: number } | null)?.status;
      trackSpeech("speech_checkout_error", { content_source: contentSource, pack, error_code: speechErrorCode(e), ...(typeof status === "number" ? { status_code: status } : {}) });
      setError(e instanceof Error && e.message ? e.message : "Checkout is unavailable right now. Please try again.");
      setBusy(null);
    }
  }
  return (
    <div ref={card} className="space-y-3" data-speech-pack-offer>
      {heading && <h4 className="font-semibold">Practice before your speech tomorrow</h4>}
      <p className="text-sm">Record, get AI feedback, try again — buy a few rounds when you need them.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {PACKS.map((p) => (
          <button key={p.pack} type="button" disabled={busy !== null} onClick={() => void buy(p.pack)} data-pack={p.pack}
            className={`relative min-h-11 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-colors disabled:opacity-60 ${p.pack === 20 ? "bg-[var(--neon-cyan)] text-black" : "border border-[var(--neon-cyan)]/50 text-[var(--text-primary)] hover:bg-[var(--neon-cyan)]/10"}`}>
            {p.note && <span className="absolute -top-2 right-3 rounded-full bg-black px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--neon-cyan)]">{p.note}</span>}
            {busy === p.pack ? "Opening secure checkout…" : <>{p.label} · {p.price}</>}
          </button>
        ))}
      </div>
      <p className="text-xs text-[var(--text-muted)]">One-time payment · no subscription · rounds never expire · secure checkout with Stripe.</p>
      {error && <p role="alert" className="text-sm text-[var(--neon-pink)]">{error}</p>}
    </div>
  );
}
