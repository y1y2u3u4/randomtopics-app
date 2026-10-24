"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { readLocal, subFetch, trackSub, trackSubUsage, writeLocal } from "@/lib/subs/client";
import { PracticeRequestError } from "@/lib/speech/client";
import { useSubPlan } from "./useSubPlan";
import SubPaywall from "./SubPaywall";

type Locale = "en" | "es";
interface TodayData {
  room: { code: string; lang: Locale; owner: boolean; partnerJoined: boolean; createdAt: string } | null;
  day?: string;
  dayNumber?: number;
  question?: string;
  answered?: { me: boolean; partner: boolean };
  answers?: { mine: string; theirs: string } | null;
  streak?: number;
  trial?: boolean;
  trialDaysLeft?: number;
  access?: boolean;
  canAnswer?: boolean;
}
interface HistoryItem { day: string; question: string; mine: string; theirs: string }

const CODE_KEY = "couples:code";
const TRIAL_KEY = "couples:trial-started";

const T = {
  en: {
    startTitle: "Start our daily question",
    startText: "One question a day for the two of you. You each answer privately, and both answers appear only once you have both answered. Free for 3 days, no signup.",
    start: "Start our daily question",
    starting: "Creating your room…",
    invited: "Your partner invited you to answer a daily question together.",
    inviteText: "You each answer privately. Both answers show up only when you have both answered.",
    join: "Join and see today's question",
    joining: "Joining…",
    inviteHeading: "Invite your partner",
    inviteHelp: "Send this link. When your partner opens it, you share the same question every day.",
    copy: "Copy link", copied: "Copied", share: "Share",
    day: (n: number) => `Day ${n}`,
    streak: (n: number) => (n === 1 ? "1-day streak" : `${n}-day streak`),
    noStreak: "No streak yet — answer together today",
    trialLeft: (n: number) => (n === 1 ? "Free: last day left" : `Free: ${n} days left`),
    placeholder: "Write your answer…",
    send: "Send my answer", sending: "Sending…",
    yourAnswer: "You", partnerAnswer: "Your partner",
    waitPartner: "Waiting for your partner — we'll show both answers when they answer.",
    waitJoin: "Your answer is saved. Your partner hasn't joined yet — send them the invite link above.",
    youFirst: "Your partner already answered. Write your answer to see theirs.",
    revealed: "Both answered. Here they are:",
    historyTitle: "Past days", historyEmpty: "Days you both answered will collect here.", more: "Show older days", loading: "Loading…",
    noteTrialOver: "The free 3 days are over. One plan covers both of you.",
    planActive: "Your plan is active.",
    error: "Something went wrong. Please try again.",
    remembered: "This browser remembers your room. To use it on another device, open your invite link there.",
  },
  es: {
    startTitle: "Empezar nuestra pregunta diaria",
    startText: "Una pregunta al día para los dos. Cada uno responde en privado y las dos respuestas aparecen solo cuando ambos han contestado. 3 días gratis, sin registro.",
    start: "Empezar nuestra pregunta diaria",
    starting: "Creando vuestra sala…",
    invited: "Tu pareja te ha invitado a responder juntos una pregunta diaria.",
    inviteText: "Cada uno responde en privado. Las dos respuestas se ven solo cuando ambos habéis contestado.",
    join: "Unirme y ver la pregunta de hoy",
    joining: "Uniéndome…",
    inviteHeading: "Invita a tu pareja",
    inviteHelp: "Envíale este enlace. Cuando lo abra, los dos veréis la misma pregunta cada día.",
    copy: "Copiar enlace", copied: "Copiado", share: "Compartir",
    day: (n: number) => `Día ${n}`,
    streak: (n: number) => (n === 1 ? "Racha de 1 día" : `Racha de ${n} días`),
    noStreak: "Aún sin racha: contestad juntos hoy",
    trialLeft: (n: number) => (n === 1 ? "Gratis: último día" : `Gratis: quedan ${n} días`),
    placeholder: "Escribe tu respuesta…",
    send: "Enviar mi respuesta", sending: "Enviando…",
    yourAnswer: "Tú", partnerAnswer: "Tu pareja",
    waitPartner: "Esperando a tu pareja: te mostraremos las dos respuestas cuando conteste.",
    waitJoin: "Tu respuesta está guardada. Tu pareja aún no se ha unido: envíale el enlace de invitación de arriba.",
    youFirst: "Tu pareja ya contestó. Escribe tu respuesta para ver la suya.",
    revealed: "Los dos habéis contestado. Aquí están:",
    historyTitle: "Días anteriores", historyEmpty: "Aquí se irán guardando los días en que contestasteis los dos.", more: "Ver días anteriores", loading: "Cargando…",
    noteTrialOver: "Los 3 días gratis han terminado. Un solo plan cubre a los dos.",
    planActive: "Tu plan está activo.",
    error: "Algo salió mal. Inténtalo de nuevo.",
    remembered: "Este navegador recuerda vuestra sala. Para usarla en otro dispositivo, abre allí el enlace de invitación.",
  },
} as const;

const box = "rounded-2xl border border-white/10 bg-white/[0.04] p-5";
const primary = "rounded-full bg-[#f4ecdf] px-6 py-3 font-bold text-[#14110f] hover:opacity-90 disabled:opacity-60";

const timeZone = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch { return "UTC"; } };

function message(e: unknown, fallback: string) {
  return e instanceof Error && e.message ? e.message : fallback;
}

export default function CouplesDaily({ locale = "en" }: { locale?: Locale }) {
  const t = T[locale];
  const plan = useSubPlan("couples");
  const [data, setData] = useState<TodayData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  const [busy, setBusy] = useState<"create" | "join" | "answer" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyNext, setHistoryNext] = useState<string | null>(null);
  const [historyMore, setHistoryMore] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const [link, setLink] = useState("");
  const code = data?.room?.code ?? null;
  const revealed = Boolean(data?.answers);
  const firedReveal = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      const saved = readLocal<string | null>(CODE_KEY, null);
      const next = await subFetch<TodayData>("couples", { action: "today", ...(saved ? { code: saved } : {}), timeZone: timeZone() });
      if (next?.room) { writeLocal(CODE_KEY, next.room.code); setData(next); }
      else { setData(null); if (saved) writeLocal(CODE_KEY, null); }
    } catch (e) {
      if (e instanceof PracticeRequestError && (e.status === 404 || e.status === 401)) { writeLocal(CODE_KEY, null); setData(null); }
    } finally {
      setLoaded(true);
    }
  }, []);

  // First load: the ?room= invite is handled by the join card, everything else asks the server for our room.
  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get("room");
    if (room && /^[A-Za-z0-9]{10,16}$/.test(room) && readLocal<string | null>(CODE_KEY, null) !== room) {
      setInvite(room);
      setLoaded(true);
      return;
    }
    void load();
  }, [load]);

  // A plan bought in this browser (or the return from Checkout) changes what the room may do.
  const planState = plan.state;
  useEffect(() => {
    if (planState === "active" && !invite) void load();
  }, [planState, invite, load]);

  // Poll every 20 seconds while the page is visible and we are waiting on the partner.
  const waiting = Boolean(data?.room) && !revealed;
  useEffect(() => {
    if (!waiting) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => { stop(); if (document.visibilityState === "visible") timer = setInterval(() => { void load(); }, 20000); };
    const onVisibility = () => { if (document.visibilityState === "visible") { void load(); start(); } else stop(); };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, [waiting, load]);

  // couples_reveal once per day per browser.
  useEffect(() => {
    if (!data?.answers || !data.day || !code) return;
    const key = `couples:revealed:${code}:${data.day}`;
    if (firedReveal.current === key || readLocal<boolean>(key, false)) return;
    firedReveal.current = key;
    writeLocal(key, true);
    trackSubUsage("couples_reveal", "couples", { locale, streak: data.streak ?? 0 });
  }, [data, code, locale]);

  // Invite link for the owner.
  useEffect(() => {
    if (code) setLink(`${window.location.origin}${window.location.pathname}?room=${code}`);
  }, [code]);

  const create = async () => {
    setError(null);
    setBusy("create");
    try {
      const next = await subFetch<TodayData & { created?: boolean }>("couples", { action: "create", lang: locale, timeZone: timeZone() }, true);
      if (next?.room) {
        writeLocal(CODE_KEY, next.room.code);
        setData(next);
        if (next.created && !readLocal<boolean>(TRIAL_KEY, false)) {
          writeLocal(TRIAL_KEY, true);
          trackSub("couples", "trial_start", { locale });
        }
      }
    } catch (e) {
      setError(message(e, t.error));
    } finally {
      setBusy(null);
    }
  };

  const join = async () => {
    if (!invite) return;
    setError(null);
    setBusy("join");
    try {
      const next = await subFetch<TodayData>("couples", { action: "join", code: invite, timeZone: timeZone() }, true);
      if (next?.room) {
        writeLocal(CODE_KEY, next.room.code);
        setData(next);
        setInvite(null);
        const params = new URLSearchParams(window.location.search);
        params.delete("room");
        const rest = params.toString();
        window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`);
      }
    } catch (e) {
      setError(message(e, t.error));
    } finally {
      setBusy(null);
    }
  };

  const send = async () => {
    if (!text.trim() || !code) return;
    setError(null);
    setBusy("answer");
    try {
      const next = await subFetch<TodayData>("couples", { action: "answer", code, answer: text.trim() }, true);
      if (next?.room) { setData(next); setText(""); }
    } catch (e) {
      if (e instanceof PracticeRequestError && e.status === 402) await load();
      else setError(message(e, t.error));
    } finally {
      setBusy(null);
    }
  };

  const loadHistory = async (before?: string | null) => {
    if (!code) return;
    setHistoryBusy(true);
    try {
      const res = await subFetch<{ items: HistoryItem[]; hasMore: boolean; next: string | null }>("couples", { action: "history", code, ...(before ? { before } : {}) });
      if (res) {
        setHistory((old) => (before ? [...old, ...res.items] : res.items));
        setHistoryMore(res.hasMore);
        setHistoryNext(res.next);
      }
    } catch {
      /* history is a convenience; the today card keeps working */
    } finally {
      setHistoryBusy(false);
    }
  };

  // History refreshes when today's reveal happens.
  useEffect(() => {
    if (code) void loadHistory();
    // loadHistory is stable enough for this: it only reads `code`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, revealed]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ }
  };
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const share = async () => {
    try { await navigator.share({ title: locale === "es" ? "Nuestra pregunta diaria" : "Our daily question", text: t.inviteHelp, url: link }); } catch { /* cancelled */ }
  };

  const wrap = (children: React.ReactNode) => (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-10 space-y-4" aria-live="polite">{children}</section>
  );

  if (!loaded) return wrap(<div className={`${box} h-40 animate-pulse`} aria-hidden="true" />);

  if (invite && !data) {
    return wrap(
      <div className={box}>
        <p className="text-lg font-bold">{t.invited}</p>
        <p className="mt-1 text-sm opacity-80">{t.inviteText}</p>
        <button type="button" onClick={join} disabled={busy !== null} className={`mt-4 ${primary}`}>{busy === "join" ? t.joining : t.join}</button>
        {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
      </div>,
    );
  }

  if (!data?.room) {
    return wrap(
      <div className={box}>
        <p className="text-lg font-bold">{t.startTitle}</p>
        <p className="mt-1 text-sm opacity-80">{t.startText}</p>
        <button type="button" onClick={create} disabled={busy !== null} className={`mt-4 ${primary}`}>{busy === "create" ? t.starting : t.start}</button>
        {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
      </div>,
    );
  }

  const room = data.room;
  const answered = data.answered ?? { me: false, partner: false };
  const locked = !answered.me && data.canAnswer === false;
  return wrap(
    <>
      {room.owner && !room.partnerJoined && link && (
        <div className={box}>
          <p className="font-bold">{t.inviteHeading}</p>
          <p className="mt-1 text-sm opacity-80">{t.inviteHelp}</p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} aria-label={t.inviteHeading}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm" />
            <button type="button" onClick={copy} className="rounded-xl border border-white/20 px-4 py-2 font-bold hover:bg-white/10">{copied ? t.copied : t.copy}</button>
            {canShare && <button type="button" onClick={share} className="rounded-xl border border-white/20 px-4 py-2 font-bold hover:bg-white/10">{t.share}</button>}
          </div>
        </div>
      )}

      <div className={box}>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs opacity-80">
          <span>{t.day(data.dayNumber ?? 1)}</span>
          <span>{(data.streak ?? 0) > 0 ? `🔥 ${t.streak(data.streak ?? 0)}` : t.noStreak}</span>
          {data.trial && !data.access && <span>{t.trialLeft(data.trialDaysLeft ?? 0)}</span>}
          {data.access && <span>{t.planActive}</span>}
        </div>
        <h2 className="mt-3 text-xl font-bold sm:text-2xl" style={{ fontFamily: "var(--font-display)" }}>{data.question}</h2>

        {revealed && data.answers && (
          <div className="mt-4 space-y-3">
            <p className="text-sm opacity-80">{t.revealed}</p>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold uppercase opacity-70">{t.yourAnswer}</p><p className="mt-1 whitespace-pre-wrap break-words">{data.answers.mine}</p></div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-bold uppercase opacity-70">{t.partnerAnswer}</p><p className="mt-1 whitespace-pre-wrap break-words">{data.answers.theirs}</p></div>
          </div>
        )}

        {!revealed && answered.me && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm">{room.partnerJoined ? t.waitPartner : t.waitJoin}</p>
          </div>
        )}

        {!answered.me && !locked && (
          <div className="mt-4">
            {answered.partner && <p className="mb-2 text-sm opacity-80">{t.youFirst}</p>}
            <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} rows={4} placeholder={t.placeholder} aria-label={t.placeholder}
              className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-2" />
            <button type="button" onClick={send} disabled={busy !== null || !text.trim()} className={`mt-2 ${primary}`}>{busy === "answer" ? t.sending : t.send}</button>
            {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
          </div>
        )}
      </div>

      {locked && <SubPaywall product="couples" locale={locale} note={t.noteTrialOver} />}
      {plan.message && <p className="text-sm opacity-80" role="status">{plan.message}</p>}

      <div className={box}>
        <h3 className="font-bold">{t.historyTitle}</h3>
        {history.length === 0 ? (
          <p className="mt-2 text-sm opacity-70">{historyBusy ? t.loading : t.historyEmpty}</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {history.map((h) => (
              <li key={h.day} className="text-sm">
                <p className="text-xs opacity-60">{h.day}</p>
                <p className="font-semibold">{h.question}</p>
                <p className="mt-1"><span className="font-bold">{t.yourAnswer}:</span> <span className="whitespace-pre-wrap break-words">{h.mine}</span></p>
                <p className="mt-1"><span className="font-bold">{t.partnerAnswer}:</span> <span className="whitespace-pre-wrap break-words">{h.theirs}</span></p>
              </li>
            ))}
          </ul>
        )}
        {historyMore && <button type="button" disabled={historyBusy} onClick={() => loadHistory(historyNext)} className="mt-3 rounded-xl border border-white/20 px-4 py-2 text-sm font-bold hover:bg-white/10">{historyBusy ? t.loading : t.more}</button>}
      </div>
      <p className="text-xs opacity-60">{t.remembered}</p>
    </>,
  );
}
