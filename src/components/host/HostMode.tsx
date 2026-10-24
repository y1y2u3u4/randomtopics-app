"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { HOST_GENERATORS, loadHostPool, nextUnseen, type HostCard, type HostGenerator } from "@/lib/host/pools";
import { DEFAULT_HOST_PLAN, HOST_PLANS, HOST_PLAN_ORDER, HOST_TRIAL_PROMPTS, type HostPlan } from "@/lib/host/plans";
import { hostStatus, startHostCheckout, trackHost } from "@/lib/host/client";

// Host mode: one big prompt on a full screen for a group (party, class, team
// meeting). Free visitors get one trial round, then the Host Pass paywall.

type Access = "checking" | "paid" | "trial" | "paywall";
const TIMER_PRESETS = [0, 15, 30, 60];
const PLAN_NOTE: Record<HostPlan, string> = {
  pass30: "One payment · no renewal",
  monthly: "Renews monthly · cancel any time",
  yearly: "Renews yearly · about $1.67 a month",
};

function readJson<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function writeJson(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* optional */ }
}

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.32].forEach((at) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + 0.27);
    });
    window.setTimeout(() => ctx.close().catch(() => {}), 1000);
  } catch { /* no audio */ }
}

export default function HostMode({ generator, returnSession, onClose }: { generator: HostGenerator; returnSession?: string | null; onClose: () => void }) {
  const seenKey = `rt_host_seen_${generator}`;
  const [cards, setCards] = useState<HostCard[] | null>(null);
  const [access, setAccess] = useState<Access>("checking");
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const [history, setHistory] = useState<number[]>([]);
  const [trialShown, setTrialShown] = useState(0);
  const [exhausted, setExhausted] = useState(false);
  // Client-only component (loaded with ssr: false), so storage can seed state.
  const [theme, setTheme] = useState<"dark" | "light">(() => readJson<"dark" | "light">("rt_host_theme", "dark"));
  const [timer, setTimer] = useState(() => readJson<number>("rt_host_timer", 0));
  const [customOpen, setCustomOpen] = useState(false);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [plan, setPlan] = useState<HostPlan>(DEFAULT_HOST_PLAN);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const current = history.length ? history[history.length - 1] : null;

  const showPaywall = useCallback(() => {
    setAccess("paywall");
    setDeadline(null);
    trackHost("host_paywall_view", { generator });
  }, [generator]);

  // Load prompts and pass state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [pool, initial] = await Promise.all([loadHostPool(generator), hostStatus(returnSession ?? undefined)]);
      if (cancelled) return;
      let status = initial;
      // Returning from Checkout: the payment can take a moment to confirm.
      for (let i = 0; returnSession && !status?.active && i < 3; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        status = await hostStatus(returnSession);
        if (cancelled) return;
      }
      const saved = new Set(readJson<number[]>(seenKey, []).filter((n) => Number.isInteger(n) && n >= 0 && n < pool.length));
      setCards(pool);
      setSeen(saved);
      if (status?.granted.length) {
        const bought = status.granted[0];
        trackHost("host_purchase", { generator, plan: bought, value: HOST_PLANS[bought].cents / 100 });
        setMessage("Host Pass is on — thank you! Ads are off while it lasts.");
      }
      if (status?.active) {
        setAccess("paid");
        trackHost("host_session_start", { generator, ...(status.plan ? { plan: status.plan } : {}) });
      } else if (returnSession) {
        setMessage("We could not confirm the payment yet. If you paid, reopen Host mode in a minute.");
        showPaywall();
      } else {
        // One free round per browser, kept across reopenings.
        const used = readJson<number>("rt_host_trial_shown", 0);
        if (used >= HOST_TRIAL_PROMPTS) { showPaywall(); return; }
        setTrialShown(used);
        setAccess("trial");
        if (used === 0) trackHost("host_trial_start", { generator });
      }
    })().catch(() => { if (!cancelled) setMessage("Host mode could not load. Please try again."); });
    return () => { cancelled = true; };
  }, [generator, returnSession, seenKey, showPaywall]);

  const next = useCallback(() => {
    if (!cards || (access !== "paid" && access !== "trial")) return;
    if (access === "trial" && trialShown >= HOST_TRIAL_PROMPTS) {
      trackHost("host_trial_end", { generator });
      showPaywall();
      return;
    }
    const pick = nextUnseen(cards.length, seen);
    if (pick === null) { setExhausted(true); return; }
    const updated = new Set(seen).add(pick);
    setSeen(updated);
    writeJson(seenKey, [...updated]);
    setHistory((h) => [...h.slice(-50), pick]);
    setExhausted(false);
    if (access === "trial") { setTrialShown(trialShown + 1); writeJson("rt_host_trial_shown", trialShown + 1); }
    setDeadline(timer > 0 ? Date.now() + timer * 1000 : null);
  }, [access, cards, generator, seen, seenKey, showPaywall, timer, trialShown]);

  const previous = useCallback(() => {
    setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
    setExhausted(false);
  }, []);

  const resetSeen = () => {
    setSeen(new Set());
    writeJson(seenKey, []);
    setExhausted(false);
    trackHost("no_repeat_reset", { generator });
  };

  const chooseTimer = useCallback((seconds: number) => {
    const s = Math.max(0, Math.min(600, Math.round(seconds)));
    setTimer(s);
    writeJson("rt_host_timer", s);
    setDeadline(s > 0 && current !== null ? Date.now() + s * 1000 : null);
    if (s > 0) trackHost("timer_set", { generator, seconds: s });
  }, [current, generator]);

  const close = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  }, [onClose]);

  /* eslint-disable react-hooks/set-state-in-effect -- first prompt once the pool loads; countdown driven by the clock */
  // First prompt as soon as the pool is ready.
  useEffect(() => {
    if (cards && (access === "paid" || access === "trial") && history.length === 0) next();
  }, [cards, access, history.length, next]);

  // Countdown with a beep at zero.
  useEffect(() => {
    if (deadline === null) { setRemaining(null); return; }
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) { beep(); setDeadline(null); setRemaining(0); }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [deadline]);

  /* eslint-enable react-hooks/set-state-in-effect */

  // Keyboard, scroll lock, fullscreen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "BUTTON")) { if (e.key === "Escape") close(); return; }
      if (e.key === " " || e.key === "ArrowRight" || e.key === "Enter" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); previous(); }
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, next, previous]);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.requestFullscreen?.().catch(() => {});
    root.current?.focus();
    return () => { document.body.style.overflow = overflow; };
  }, []);

  const toggleTheme = () => {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    writeJson("rt_host_theme", t);
  };

  const pickPlan = (p: HostPlan) => {
    setPlan(p);
    trackHost("host_plan_select", { generator, plan: p });
  };

  const checkout = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await startHostCheckout(plan, generator);
    } catch (error) {
      setMessage((error as Error).message || "Checkout is temporarily unavailable. Please try again.");
      setBusy(false);
    }
  };

  // Back from Stripe restores this page from the back/forward cache with the
  // button still busy; re-enable it.
  useEffect(() => {
    const restored = (event: PageTransitionEvent) => { if (event.persisted) setBusy(false); };
    window.addEventListener("pageshow", restored);
    return () => window.removeEventListener("pageshow", restored);
  }, []);

  const dark = theme === "dark";
  const card = current !== null && cards ? cards[current] : null;
  const long = (card?.text.length ?? 0) > 90;
  const left = cards ? cards.length - seen.size : 0;
  const chip = `rounded-full px-3 py-1.5 text-sm font-semibold transition ${dark ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"}`;
  const chipOn = dark ? "!bg-[#f4ecdf] !text-[#14110f]" : "!bg-[#1d1a17] !text-[#faf6ee]";

  return (
    <div
      ref={root}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${HOST_GENERATORS[generator]} — Host mode`}
      className={`fixed inset-0 z-[2147483000] flex flex-col outline-none ${dark ? "bg-[#14110f] text-[#f4ecdf]" : "bg-[#faf6ee] text-[#1d1a17]"}`}
    >
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
        <span className="mr-auto text-sm font-bold tracking-wide uppercase opacity-70">{HOST_GENERATORS[generator]} · Host mode</span>
        {access !== "paywall" && (
          <>
            <span className="text-xs opacity-60 hidden sm:inline">Timer</span>
            {TIMER_PRESETS.map((s) => (
              <button key={s} type="button" className={`${chip} ${timer === s ? chipOn : ""}`} onClick={() => chooseTimer(s)}>{s === 0 ? "Off" : `${s}s`}</button>
            ))}
            {customOpen ? (
              <input
                autoFocus type="number" min={5} max={600} placeholder="sec" aria-label="Custom timer in seconds"
                className={`w-20 rounded-full px-3 py-1.5 text-sm ${dark ? "bg-white/10" : "bg-black/5"}`}
                onKeyDown={(e) => { if (e.key === "Enter") { chooseTimer(Number((e.target as HTMLInputElement).value) || 0); setCustomOpen(false); } }}
                onBlur={(e) => { if (e.target.value) chooseTimer(Number(e.target.value) || 0); setCustomOpen(false); }}
              />
            ) : (
              <button type="button" className={`${chip} ${timer > 0 && !TIMER_PRESETS.includes(timer) ? chipOn : ""}`} onClick={() => setCustomOpen(true)}>
                {timer > 0 && !TIMER_PRESETS.includes(timer) ? `${timer}s` : "Custom"}
              </button>
            )}
          </>
        )}
        <button type="button" className={chip} onClick={toggleTheme} aria-label="Switch light or dark">{dark ? "☀︎ Light" : "☾ Dark"}</button>
        <button type="button" className={chip} onClick={close} aria-label="Close host mode">✕ Close</button>
      </div>

      {access === "paywall" ? (
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 pb-6">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 ${dark ? "bg-white/[0.06]" : "bg-white shadow-xl"}`}>
            <p className="text-sm font-bold uppercase tracking-wide opacity-60">Host Pass</p>
            <h2 className="mt-1 text-2xl font-black leading-tight">Keep hosting on the big screen</h2>
            <ul className="mt-3 space-y-1 text-sm opacity-80">
              <li>✓ Fullscreen prompts, light or dark</li>
              <li>✓ Round timer with a beep</li>
              <li>✓ No repeats until you reset</li>
              <li>✓ No ads on the whole site while it lasts</li>
            </ul>
            <div className="mt-5 space-y-2" role="radiogroup" aria-label="Choose a plan">
              {HOST_PLAN_ORDER.map((p) => (
                <button
                  key={p} type="button" role="radio" aria-checked={plan === p} onClick={() => pickPlan(p)}
                  className={`flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition ${plan === p ? (dark ? "border-[#f4ecdf]" : "border-[#1d1a17]") : "border-transparent " + (dark ? "bg-white/5" : "bg-black/[0.03]")}`}
                >
                  <span>
                    <span className="block font-bold">{HOST_PLANS[p].label} <span className="font-normal opacity-70">/ {HOST_PLANS[p].per}</span></span>
                    <span className="block text-xs opacity-60">{PLAN_NOTE[p]}</span>
                  </span>
                  {p === "pass30" && <span className="rounded-full bg-[#e4572e] px-2 py-0.5 text-xs font-bold text-white">Popular</span>}
                </button>
              ))}
            </div>
            <button type="button" disabled={busy} onClick={checkout} className="btn-generate mt-5 w-full disabled:opacity-60">
              {busy ? "Opening checkout…" : `Continue — ${HOST_PLANS[plan].label}`}
            </button>
            <p className="mt-3 text-center text-xs opacity-60">Prices in USD. No account needed — pay as a guest. The free generator stays free and unlimited.</p>
            {message && <p className="mt-3 text-center text-sm" role="status">{message}</p>}
            <button type="button" onClick={close} className="mt-3 w-full text-sm underline opacity-70">Back to the free generator</button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={next}
            aria-label="Next prompt"
            className="flex flex-1 flex-col items-center justify-center px-6 text-center select-none cursor-pointer"
          >
            {access === "checking" || !card ? (
              <span className="text-lg opacity-60">{message ?? "Loading…"}</span>
            ) : exhausted ? (
              <span className="text-3xl font-black">All {cards!.length} prompts shown</span>
            ) : (
              <>
                {card.sub && <span className="mb-4 text-lg font-semibold uppercase tracking-widest opacity-60">{card.sub}</span>}
                <span className="max-w-6xl font-black leading-[1.1]" style={{ fontSize: long ? "clamp(1.6rem, 4.2vw, 3.8rem)" : "clamp(2.2rem, 6.5vw, 6rem)" }}>{card.text}</span>
              </>
            )}
            {remaining !== null && (
              <span className={`mt-8 tabular-nums text-5xl font-black ${remaining <= 5 ? "text-[#e4572e]" : "opacity-80"}`} aria-live="polite">{remaining === 0 ? "Time!" : remaining}</span>
            )}
          </button>
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 pb-5 text-sm">
            <button type="button" className={chip} onClick={previous} disabled={history.length < 2}>← Back</button>
            <button type="button" className={`${chip} ${chipOn}`} onClick={next}>Next →</button>
            {access === "trial" ? (
              <span className="opacity-70">Free trial · {Math.max(0, HOST_TRIAL_PROMPTS - trialShown)} left</span>
            ) : (
              <span className="opacity-70">{left} of {cards?.length ?? 0} not shown yet</span>
            )}
            <button type="button" className={chip} onClick={resetSeen}>Reset no-repeat</button>
            <span className="hidden opacity-50 sm:inline">Space / → next · ← back · Esc close</span>
          </div>
          {message && access === "paid" && <p className="pb-4 text-center text-sm opacity-80" role="status">{message}</p>}
        </>
      )}
    </div>
  );
}
