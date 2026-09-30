"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { practiceFetch, PracticeRequestError, reconnectSpeechSession, speechClient } from "@/lib/speech/client";
import type { SpeechFeedback } from "@/lib/speech/schema";
import { speechErrorCode, speechQaSession, trackSpeech, trackConfirmedSpeechPurchase } from "@/lib/speech/telemetry";
import { clearCheckoutIntent, readCheckoutIntent, rememberCheckoutIntent, reconcileCheckoutPurpose, validPracticeReference } from "@/lib/speech/checkoutIntent";
import { watchSpeechAccount } from "@/lib/speech/accountChanges";
import { observeVisibleAction, observeVisibleContent } from "@/lib/speech/visibleAction";
import { resumeHistoryFeedback } from "@/lib/speech/historyFeedback";
import SpeechHistorySummary from "./SpeechHistorySummary";
import SpeechCheckoutContext from "./SpeechCheckoutContext";
import { nextRound } from "@/lib/speech/nextRound";
import { speechPurpose, type SpeechPurpose } from "@/lib/speech/purpose";
import type { SpeechAllowance } from "@/lib/speech/returnTrial";
import SpeechAnswerCard from "./SpeechAnswerCard";
import SpeechReturnTrial from "./SpeechReturnTrial";
type Attempt = {
  id: string;
  topic: string;
  transcript: string | null;
  duration: number;
  status: string;
  feedback: SpeechFeedback | null;
  created_at: string;
  previous_id: string | null;
  purpose?: SpeechPurpose;
};
const button =
  "min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50";
export default function SpeechAccount() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [allowance, setAllowance] = useState<SpeechAllowance>();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumingId, setResumingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [mailSent, setMailSent] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [billing, setBilling] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const mounted = useRef(false);
  const requestVersion = useRef(0);
  const accountGeneration = useRef(0);
  const actionInFlight = useRef(false);
  const checkoutIntent = useRef(false);
  const practiceReference = useRef<string | undefined>(undefined);
  const existingSessionOnly = useRef(false);
  const recoveryOwner = useRef<number | null>(null);
  const verified = useRef(false);
  const verifiedReported = useRef(false);
  const checkoutButton = useRef<HTMLButtonElement>(null);
  const emailSubmit = useRef<HTMLButtonElement>(null);
  const actionSeen = useRef(new Set<string>());
  const emailStep = useRef<HTMLElement>(null);
  const seenEmailStep = useRef(false);
  const seenResume = useRef(false);
  const focusedStep = useRef("");
  const [subscription, setSubscription] = useState({
    active: false,
    periodEnd: null as string | null,
    manageable: false,
  });
  const offer = useRef<HTMLElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const offerSeen = useRef(false);
  const invalidateHistory = useCallback(() => { requestVersion.current++; }, []);
  useEffect(() => {
    if (!loaded || !checkoutMode || subscription.active || !billing) return;
    const step = emailVerified ? "verified" : "plan";
    if (focusedStep.current === step) return;
    focusedStep.current = step;
    const frame = requestAnimationFrame(() => {
      const target = emailVerified ? checkoutButton.current : offer.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: emailVerified ? "center" : "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [loaded, checkoutMode, subscription.active, billing, emailVerified]);
  useEffect(() => {
    if (!loaded || !billing || subscription.active || busy || loadError) return;
    const step = emailVerified ? "checkout" : checkoutMode ? "email" : "choose_plan";
    const action = step === "email" ? emailSubmit.current : checkoutButton.current;
    if (!action || actionSeen.current.has(step)) return;
    return observeVisibleAction(action, () => {
      actionSeen.current.add(step);
      trackSpeech("speech_checkout_action_view", { content_source: "speech_account", outcome: step });
    });
  }, [loaded, billing, subscription.active, busy, loadError, emailVerified, checkoutMode]);
  useEffect(() => {
    if (!checkoutMode || !loaded || emailVerified || !emailAvailable || !emailStep.current || seenEmailStep.current) return;
    return observeVisibleContent(emailStep.current, () => {
      seenEmailStep.current = true;
      trackSpeech("speech_checkout_email_step_view", { content_source: "speech_account" });
    });
  }, [checkoutMode, loaded, emailVerified, emailAvailable]);
  useEffect(() => {
    if (busy || !checkoutMode || !loaded || !emailVerified || !billing || subscription.active || !checkoutButton.current || seenResume.current) return;
    return observeVisibleAction(checkoutButton.current, () => {
      seenResume.current = true;
      trackSpeech("speech_checkout_resume_view", { content_source: "speech_account" });
    });
  }, [busy, checkoutMode, loaded, emailVerified, billing, subscription.active]);
  useEffect(() => {
    if (!loaded || !billing || subscription.active || !offer.current || offerSeen.current)
      return;
    return observeVisibleContent(offer.current, () => {
      offerSeen.current = true;
      trackSpeech("speech_checkout_offer_view", { content_source: "speech_account" });
      trackSpeech("speech_checkout_offer_v2_view", { content_source: "speech_account" });
    });
  }, [loaded, billing, subscription.active]);

  async function openBilling(destination: "checkout" | "portal") {
    trackSpeech(`speech_${destination}_start`, { content_source: "speech_account" });
    const ownerGeneration = accountGeneration.current;
    try {
      if (destination === "checkout") trackSpeech("speech_checkout_request", { content_source: "speech_account" });
      const data = await practiceFetch(destination, {});
      if (!mounted.current || ownerGeneration !== accountGeneration.current) throw Object.assign(new Error("Your account changed. Review the plan and try again."), { status: 409 });
      if (destination === "checkout" && /^[a-f0-9]{64}$/.test(data.transactionId || "")) {
        try { sessionStorage.setItem("rt_speech_checkout_pending", data.transactionId); } catch { /* optional measurement */ }
      }
      trackSpeech(`speech_${destination}_redirect`, { content_source: "speech_account" });
      window.location.assign(data.url);
    } catch (error) {
      trackSpeech(`speech_${destination}_error`, {
        content_source: "speech_account",
        error_code: speechErrorCode(error),
      });
      throw error;
    }
  }
  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    const startedAt = performance.now();
    trackSpeech("speech_account_load_start", { content_source: "speech_account" });
    try {
      const id = practiceReference.current;
      const data = await practiceFetch(id ? `history?id=${encodeURIComponent(id)}` : "history", undefined, undefined,
        { existingSessionOnly: existingSessionOnly.current, timeoutMs: 15000 });
      if (!mounted.current || version !== requestVersion.current) return false;
      // Reconcile a referenced purpose against owned history before attributing payment.
      if (checkoutIntent.current && id) {
        const owned = data.attempts?.find((item: Attempt) => item.id === id);
        reconcileCheckoutPurpose(speechPurpose(owned?.purpose));
      }
      setAttempts(data.attempts);
      setAllowance(data.allowance);
      setAnonymous(data.anonymous);
      setBilling(data.billingAvailable);
      setEmailAvailable(data.emailAvailable);
      setEmailVerified(data.emailVerified);
      verified.current = data.emailVerified;
      trackConfirmedSpeechPurchase(data.purchase);
      if (data.emailVerified && !verifiedReported.current) {
        verifiedReported.current = true;
        trackSpeech("speech_email_verified", { content_source: "speech_account" });
      }
      setSubscription(data.subscription);
      if (data.subscription.active) {
        clearCheckoutIntent();
        checkoutIntent.current = false;
        setCheckoutMode(false);
      } else if (data.emailVerified && checkoutIntent.current) {
        setMessage("Your email is confirmed. Continue with your selected plan to review and pay securely with Stripe.");
      }
      if (new URLSearchParams(window.location.search).get("payment") === "return") {
        setMessage(data.subscription.active
          ? "Your subscription is active. You can continue practicing."
          : "Your subscription is not confirmed yet. If you completed payment, refresh in a moment. Do not pay again while confirmation is pending.");
      }
      setLoaded(true);
      setLoadError("");
      trackSpeech("speech_account_load_ready", { content_source: "speech_account", elapsed_ms: Math.round(performance.now() - startedAt) });
      trackSpeech("speech_history_view", { content_source: "speech_account" });
      if (recoveryOwner.current === accountGeneration.current) {
        recoveryOwner.current = null;
        trackSpeech("speech_account_reconnect_ready", { content_source: "speech_account" });
      }
      return true;
    } catch (error) {
      if (!mounted.current || version !== requestVersion.current) return false;
      const code = speechErrorCode(error);
      if (code === "session") existingSessionOnly.current = true;
      setLoadError(code);
      setLoaded(false);
      setAttempts([]); setAllowance(undefined);
      setBilling(false);
      verified.current = false;
      setEmailVerified(false);
      trackSpeech("speech_account_load_error", { content_source: "speech_account", error_code: code,
        elapsed_ms: Math.round(performance.now() - startedAt) });
      if (recoveryOwner.current === accountGeneration.current) {
        recoveryOwner.current = null;
        trackSpeech("speech_account_reconnect_error", { content_source: "speech_account", error_code: code });
      }
      throw error;
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    let startedLoad = false;
    let stopWatching: (() => void) | undefined;
    const showError = (error: unknown) => {
      if (active) {
        if (!startedLoad) {
          setLoadError(speechErrorCode(error));
          trackSpeech("speech_account_load_error", { content_source: "speech_account", error_code: speechErrorCode(error) });
        }
        setMessage(error instanceof Error ? error.message : "Could not load your account. Please try again.");
      }
    };
    async function initialize() {
      const params = new URLSearchParams(window.location.search);
      const saved = readCheckoutIntent();
      // Preserve QA across a same-browser email confirmation that opens a new tab.
      if (saved?.qa && params.get("speech_qa") !== "0") {
        try { sessionStorage.setItem("rt_speech_qa", "1"); } catch { /* optional analytics */ }
      }
      checkoutIntent.current = params.get("plan") === "monthly" || Boolean(saved);
      const reference = params.get("attempt") ?? (checkoutIntent.current ? saved?.attemptId : undefined);
      practiceReference.current = validPracticeReference(reference) ? reference : undefined;
      if (checkoutIntent.current) rememberCheckoutIntent(speechQaSession(), undefined, practiceReference.current ?? null);
      setCheckoutMode(checkoutIntent.current);
      trackSpeech("speech_account_arrive", { content_source: "speech_account", outcome: checkoutIntent.current ? "plan" : "history" });
      const auth = (await speechClient()).auth;
      if (!active) return;
      stopWatching = watchSpeechAccount(auth, () => { void load().catch(showError); }, () => {
        invalidateHistory();
        if (recoveryOwner.current !== null) {
          recoveryOwner.current = null;
          trackSpeech("speech_account_reconnect_error", { content_source: "speech_account", error_code: "conflict" });
        }
        accountGeneration.current++;
        verified.current = false;
        verifiedReported.current = false;
        seenEmailStep.current = false;
        seenResume.current = false;
        offerSeen.current = false;
        actionSeen.current.clear();
        focusedStep.current = "";
        setMessage("");
        setEmail("");
        setMailSent(false);
        setEmailVerified(false);
        setAttempts([]); setAllowance(undefined);
        setLoaded(false);
        setBilling(false);
        setSubscription({ active: false, periodEnd: null, manageable: false });
      }, () => checkoutIntent.current && !verified.current);
      startedLoad = true;
      await load();
    }
    void initialize().catch(showError);
    return () => {
      active = false;
      mounted.current = false;
      invalidateHistory();
      stopWatching?.();
    };
  }, [load, invalidateHistory]);
  async function run(action: () => Promise<void>) {
    if (actionInFlight.current) return;
    actionInFlight.current = true;
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (e) {
      if (mounted.current) setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      actionInFlight.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function emailLink(existing: boolean) {
    const event = existing ? "speech_recovery" : "speech_email_link";
    const purchasing = checkoutIntent.current;
    trackSpeech(`${event}_start`, { content_source: "speech_account" });
    if (purchasing) trackSpeech("speech_checkout_email_start", { content_source: "speech_account" });
    const ownerGeneration = accountGeneration.current;
    try {
      const auth = (await speechClient()).auth;
      const redirect = `${window.location.origin}/speech/account`;
      const {
        data: { session }, error: sessionError,
      } = await auth.getSession();
      if (!existing && (sessionError || !session)) throw new PracticeRequestError("Your session expired. Reconnect before linking your email.", false, 401);
      if (!mounted.current || ownerGeneration !== accountGeneration.current) return;
      const result = existing
        ? await auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false, emailRedirectTo: redirect },
          })
        : await auth.updateUser({ email }, { emailRedirectTo: redirect });
      if (result.error) {
        throw result.error;
      }
      if (!mounted.current || ownerGeneration !== accountGeneration.current) return;
      trackSpeech(`${event}_sent`, { content_source: "speech_account" });
      if (purchasing) trackSpeech("speech_checkout_email_sent", { content_source: "speech_account" });
      setMailSent(true);
      setMessage(
        checkoutIntent.current
          ? "Check your email to confirm. Your $12/month plan is saved here; this page will update when you return."
          : "Check your email to confirm, then return here. Your account will update automatically.",
      );
    } catch (error) {
      if (!mounted.current || ownerGeneration !== accountGeneration.current) return;
      const code = error instanceof PracticeRequestError ? speechErrorCode(error) : "service";
      if (code === "session") {
        existingSessionOnly.current = true;
        setLoadError(code); setLoaded(false); setAttempts([]); setAllowance(undefined); setBilling(false);
      }
      trackSpeech(`${event}_error`, { content_source: "speech_account", error_code: code });
      if (purchasing) trackSpeech("speech_checkout_email_error", { content_source: "speech_account", error_code: code });
      if (code === "session") throw error;
      throw new Error(existing
        ? "Could not send a sign-in link. Please check your email and try again later."
        : "Could not link this email. If you already have an account, use the sign-in option.");
    }
  }
  async function reconnect() {
    existingSessionOnly.current = true;
    trackSpeech("speech_account_reconnect_start", { content_source: "speech_account" });
    const owner = accountGeneration.current;
    let startedLoading = false;
    try {
      await reconnectSpeechSession();
      if (!mounted.current || owner !== accountGeneration.current) throw new PracticeRequestError("Your account changed. Review the plan in this account.", false, 409);
      recoveryOwner.current = owner;
      startedLoading = true;
      await load();
    } catch (error) {
      if (!startedLoading) trackSpeech("speech_account_reconnect_error", { content_source: "speech_account", error_code: speechErrorCode(error) });
      throw error;
    }
  }
  const context = checkoutMode ? attempts.find(item => item.id === practiceReference.current && item.status === "complete" && item.feedback) : undefined;
  const emailPanel = (
        <section ref={emailStep} className={checkoutMode && loaded && billing ? "space-y-3 border-t border-white/15 pt-4" : "glass-card space-y-4 p-5"}>
          <h2 className="text-xl font-semibold">
            {loadError === "session" ? "Sign in to your linked account" : checkoutMode ? "Step 1 · Confirm your email" : "Keep your practice across devices"}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {loadError === "session" ? "Use an email you already linked to your practice. We won’t create a replacement guest session." : checkoutMode
              ? "Confirm your email, then review and pay with Stripe. No payment is taken now."
              : "Free practice works without an email. Link an email before clearing browser data or switching devices so you can recover your saved feedback."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(() => emailLink(loadError === "session"));
            }}
            className="space-y-3"
          >
            <label className="block text-sm">
              Email address
              <input
                type="email"
                ref={emailInput}
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/20 p-3 text-base"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button ref={emailSubmit} className={`${button} bg-[var(--neon-cyan)] text-black`} disabled={busy}>
                {loadError === "session" ? "Send sign-in link" : checkoutMode ? "Send confirmation email" : "Link my email"}
              </button>
              {loadError !== "session" && <button
                type="button"
                className={button}
                disabled={busy || !email.includes("@")}
                onClick={() => run(() => emailLink(true))}
              >
                Sign in to an existing account
              </button>}
            </div>
          </form>
          {checkoutMode && mailSent && <button type="button" className={button} disabled={busy} onClick={() => run(async () => { await load(); })}>
            Check email confirmation
          </button>}
          <p className="text-sm text-[var(--text-muted)]">
            Signing in to another account opens that account’s history; guest
            attempts are not automatically transferred.{" "}
            <Link href="/privacy" className="underline">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>
          </p>
        </section>
  );
  return (
    <div data-clarity-mask="true" className="space-y-7">
      <Link href="/speech" onClick={() => clearCheckoutIntent()} className="text-sm underline">
        Back to speech topics
      </Link>
      <h1 className="text-3xl font-bold">Your speech practice</h1>
      <p className="text-[var(--text-secondary)]">
        Review your feedback, keep your progress, and choose what to practice
        next.
      </p>
      {loaded && (billing || subscription.manageable) && (
        <section ref={offer} id="speech-plan" tabIndex={-1} aria-label="Speech practice plan" className="glass-card scroll-mt-24 space-y-4 p-5">
          <h2 className="text-xl font-semibold">
            {subscription.active
              ? "Your speech subscription"
              : "Keep practicing · $12/month"}
          </h2>
          {subscription.active && subscription.periodEnd && (
            <p role="status">
              Active · access through{" "}
              {new Date(subscription.periodEnd).toLocaleDateString()}.
            </p>
          )}
          {context?.feedback && <SpeechCheckoutContext key={context.id} attempt={{ id: context.id, feedback: context.feedback, purpose: context.purpose }} />}
          {checkoutMode && practiceReference.current && !context && <p className="text-sm">
            This saved goal is not available in this account. You can review the plan for this account; signing in does not transfer another account’s practice.
          </p>}
          <p>
            40 recordings per billing month, including retries · up to 2 minutes each.
            Includes transcription and feedback.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Renews monthly. Cancel anytime through Manage subscription; access lasts
            through your paid period. Unused attempts do not roll over.
          </p>
          <div className="flex flex-wrap gap-3">
            {billing && !subscription.active && (!checkoutMode || emailVerified) && (
              <button
                ref={checkoutButton}
                className={`${button} bg-[var(--neon-cyan)] text-black`}
                disabled={busy}
                onClick={() => {
                  checkoutIntent.current = true;
                  rememberCheckoutIntent(speechQaSession());
                  if (!emailVerified) focusedStep.current = "plan";
                  setCheckoutMode(true);
                  if (!emailVerified) {
                    trackSpeech("speech_checkout_start", { content_source: "speech_account" });
                    trackSpeech("speech_checkout_email_required", { content_source: "speech_account" });
                    setMessage("Confirm your email below, then continue to secure checkout. Your plan stays selected.");
                    emailInput.current?.scrollIntoView({ block: "center", behavior: "smooth" });
                    emailInput.current?.focus({ preventScroll: true });
                    return;
                  }
                  void run(async () => {
                    trackSpeech("speech_checkout_continue", { content_source: "speech_account" });
                    await openBilling("checkout");
                  });
                }}
              >
                {busy ? "Please wait…" : emailVerified ? "Continue to secure checkout" : "Continue with email"}
              </button>
            )}
            {subscription.manageable && (
              <button
                className={button}
                disabled={busy || anonymous}
                onClick={() =>
                  run(() => openBilling("portal"))
                }
              >
                Manage subscription
              </button>
            )}
          </div>
          {checkoutMode && !emailVerified && !subscription.active && emailAvailable && emailPanel}
          {!emailVerified && !subscription.active && !checkoutMode && (
            <p className="text-sm">
              1. Confirm your email · 2. Review and pay securely with Stripe
            </p>
          )}
        </section>
      )}
      {loaded && !billing && !subscription.manageable && (
        <p className="text-sm text-[var(--text-muted)]">
          Subscriptions are not open yet. Your first two recorded attempts are
          free.
        </p>
      )}
      {message && <p role="status" className="rounded-xl border border-white/15 p-4 text-sm">{message}</p>}
      {!loaded ? loadError ? <section role="alert" className="space-y-3 rounded-xl border border-amber-400/30 p-4">
        <h2 className="font-semibold">{loadError === "session" ? "Reconnect your practice session" : "Your account could not load"}</h2>
        <p className="text-sm">Your selected plan stays saved. Reconnecting does not submit a payment.</p>
        <button className={button} disabled={busy} onClick={() => void run(loadError === "session" ? reconnect : async () => { await load(); })}>
          {busy ? "Please wait…" : loadError === "session" ? "Reconnect this session" : "Try loading again"}
        </button>
        {loadError === "session" && emailPanel}
      </section> : <p role="status">Loading your account…</p> : emailVerified ? (
        <section className="glass-card space-y-3 p-5">
          <h2 className="text-xl font-semibold">Your email is verified</h2>
          <p className="text-sm text-[var(--text-muted)]">Your practice and subscription are linked to your account. You can sign in with this email on another device.</p>
          <button
            type="button"
            className={button}
            disabled={busy}
            onClick={() => run(async () => {
              const { error } = await (await speechClient()).auth.signOut({ scope: "local" });
              if (error) throw new Error("Could not sign out. Please try again.");
              clearCheckoutIntent();
              try { sessionStorage.removeItem("rt_speech_checkout_pending"); } catch { /* optional measurement */ }
              window.location.assign("/speech/account");
            })}
          >
            Sign out on this device
          </button>
        </section>
      ) : emailAvailable && (!checkoutMode || !billing) ? (
        emailPanel
      ) : checkoutMode && emailAvailable ? null : (
        <section className="glass-card space-y-3 p-5">
          <h2 className="text-xl font-semibold">
            Your private practice session
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Your saved feedback is available in this browser. Email recovery is
            not open yet, so keep this browser’s site data to retain access. You
            can download your recording from the practice panel before leaving
            the page.
          </p>
        </section>
      )}
      <section className="space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <h2 className="text-xl font-semibold">Practice history</h2>
          <button className={button} disabled={busy} onClick={() => run(async () => { await load(); })}>
            {loaded ? "Refresh history" : "Load my history"}
          </button>
        </div>
        {loaded && !attempts.length && (
          <p>
            No saved attempts yet. Start with a topic and a short recording.
          </p>
        )}
        {loaded && attempts.find(a => a.status === "complete" && a.previous_id)?.id && <SpeechReturnTrial allowance={allowance}
          attemptId={attempts.find(a => a.status === "complete" && a.previous_id)!.id} visible contentSource="speech_account" />}
        {attempts.map((attempt) => (
          <article
            data-clarity-mask="true"
            key={attempt.id}
            id={`attempt-${attempt.id}`}
            className="glass-card space-y-3 p-5"
          >
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="font-semibold">{attempt.topic}</h3>
              <span className="text-sm text-[var(--text-muted)]">
                {new Date(attempt.created_at).toLocaleDateString()} ·{" "}
                {attempt.duration}s
              </span>
            </div>
            <p className="text-sm">
              {attempt.status === "complete"
                ? "Feedback ready"
                : attempt.status === "failed"
                  ? "Could not complete — allowance released"
                  : attempt.status === "transcribed"
                    ? "Transcript saved — ready for feedback"
                    : "Processing — refresh in a moment"}
            </p>
            {attempt.feedback && (
              <>
                <SpeechHistorySummary nextStep={attempt.feedback.priority.nextStep} repeated={Boolean(attempt.previous_id)}
                  comparison={attempt.feedback.comparison} optional={attempt.feedback.drill?.kind === "refine"} />
                <Link className="inline-flex min-h-11 items-center rounded-xl bg-[var(--neon-cyan)] px-4 py-2 text-sm font-semibold text-black"
                  href={`/speech/practice?attempt=${attempt.id}&next=1`}>{nextRound(attempt.feedback).mode === "transfer" ? "Practice this goal on a new topic" : attempt.feedback.drill ? "Practice this change in 20 seconds" : "Continue this practice"}</Link>
                <details>
                  <summary className="cursor-pointer py-2 text-sm">
                    Feedback and transcript
                  </summary>
                  {attempt.transcript && <SpeechAnswerCard result={{ ...attempt, transcript: attempt.transcript, feedback: attempt.feedback }} repeated={Boolean(attempt.previous_id)} visible contentSource="speech_account" />}
                  <h4 className="mt-3 font-semibold">What worked</h4>
                  <p className="my-3">
                    {attempt.feedback.strength.observation}
                  </p>
                  <blockquote className="my-3 border-l-2 border-[var(--neon-cyan)] pl-3">
                    {attempt.feedback.strength.quote}
                  </blockquote>
                  <h4 className="font-semibold">Focus for your next attempt</h4>
                  <p className="my-3">
                    {attempt.feedback.priority.observation}
                  </p>
                  <blockquote className="my-3 border-l-2 border-[var(--neon-cyan)] pl-3">
                    {attempt.feedback.priority.quote}
                  </blockquote>
                  <dl className="my-4 space-y-2 text-sm">
                    {Object.entries(attempt.feedback.structure).map(
                      ([name, note]) => (
                        <div key={name}>
                          <dt className="font-semibold capitalize">{name}</dt>
                          <dd>{note}</dd>
                        </div>
                      ),
                    )}
                  </dl>
                  {attempt.feedback.comparison.outcome !== "first_attempt" && (
                    <section className="my-4 space-y-3">
                      <h4 className="font-semibold">
                        Compared with your previous attempt
                      </h4>
                      <p className="capitalize">
                        {attempt.feedback.comparison.outcome.replaceAll(
                          "_",
                          " ",
                        )}
                      </p>
                      {attempt.feedback.comparison.beforeQuote && (
                        <blockquote className="border-l-2 border-white/20 pl-3">
                          <span className="block text-sm">Before</span>
                          {attempt.feedback.comparison.beforeQuote}
                        </blockquote>
                      )}
                      {attempt.feedback.comparison.afterQuote && (
                        <blockquote className="border-l-2 border-[var(--neon-cyan)] pl-3">
                          <span className="block text-sm">After</span>
                          {attempt.feedback.comparison.afterQuote}
                        </blockquote>
                      )}
                      <p>{attempt.feedback.comparison.explanation}</p>
                    </section>
                  )}
                  <h4 className="mb-2 font-semibold">Transcript</h4>
                  <p className="whitespace-pre-wrap text-sm">
                    {attempt.transcript}
                  </p>
                </details>
              </>
            )}
            {attempt.status === "transcribed" && attempt.transcript && (
              <>
                <p className="text-sm text-[var(--text-muted)]">Your transcript is saved. Get feedback without recording again.</p>
                <p className="whitespace-pre-wrap text-sm">
                  {attempt.transcript}
                </p>
                <button
                  className={button}
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      setResumingId(attempt.id);
                      try {
                        const completed = await resumeHistoryFeedback({ ...attempt, transcript: attempt.transcript! });
                        // The response is already saved. A second history request
                        // must not turn a successful recovery into a visible error.
                        setAttempts(current => current.map(item => item.id === attempt.id ? { ...item, ...completed } : item));
                      } finally {
                        setResumingId(null);
                      }
                    })
                  }
                >
                  {resumingId === attempt.id ? "Getting your feedback…" : "Get feedback on this transcript"}
                </button>
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <a
                href={`/speech/account?attempt=${attempt.id}`}
                className="min-h-11 py-2 text-sm underline"
              >
                Link to this practice
              </a>
              <button
                className={button}
                disabled={
                  busy ||
                  ["processing", "transcribing"].includes(attempt.status)
                }
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this transcript and feedback? This cannot be undone. Your allowance will not reset.",
                    )
                  )
                    void run(async () => {
                      await practiceFetch(
                        "history",
                        { id: attempt.id },
                        "DELETE",
                      );
                      await load();
                    });
                }}
              >
                Delete practice content
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
