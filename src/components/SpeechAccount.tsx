"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { practiceFetch, speechClient } from "@/lib/speech/client";
import type { SpeechFeedback } from "@/lib/speech/schema";
import { speechErrorCode, trackSpeech, trackConfirmedSpeechPurchase } from "@/lib/speech/telemetry";
import { resumeHistoryFeedback } from "@/lib/speech/historyFeedback";
import SpeechHistorySummary from "./SpeechHistorySummary";
type Attempt = {
  id: string;
  topic: string;
  transcript: string | null;
  duration: number;
  status: string;
  feedback: SpeechFeedback | null;
  created_at: string;
  previous_id: string | null;
};
const button =
  "min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold disabled:opacity-50";
export default function SpeechAccount() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resumingId, setResumingId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [anonymous, setAnonymous] = useState(true);
  const [billing, setBilling] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [subscription, setSubscription] = useState({
    active: false,
    periodEnd: null as string | null,
    manageable: false,
  });
  const offer = useRef<HTMLElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const offerSeen = useRef(false);
  useEffect(() => {
    if (!loaded || !billing || subscription.active || !offer.current || offerSeen.current)
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || offerSeen.current) return;
      offerSeen.current = true;
      trackSpeech("speech_checkout_offer_view", { content_source: "speech_account" });
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(offer.current);
    return () => observer.disconnect();
  }, [loaded, billing, subscription.active]);

  async function openBilling(destination: "checkout" | "portal") {
    trackSpeech(`speech_${destination}_start`, { content_source: "speech_account" });
    try {
      const data = await practiceFetch(destination, {});
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
  useEffect(() => {
    let active = true;
    const id = new URLSearchParams(window.location.search).get("attempt");
    practiceFetch(id ? `history?id=${encodeURIComponent(id)}` : "history")
      .then((data) => {
        if (!active) return;
        setAttempts(data.attempts);
        setAnonymous(data.anonymous);
        setBilling(data.billingAvailable);
        setEmailAvailable(data.emailAvailable);
        setEmailVerified(data.emailVerified);
        trackConfirmedSpeechPurchase(data.purchase);
        if (data.emailVerified) trackSpeech("speech_email_verified", { content_source: "speech_account" });
        setSubscription(data.subscription);
        if (
          new URLSearchParams(window.location.search).get("payment") ===
          "return"
        )
          setMessage(
            data.subscription.active
              ? "Your subscription is active. You can continue practicing."
              : "Your subscription is not confirmed yet. If you completed payment, refresh in a moment. Do not pay again while confirmation is pending.",
          );
        setLoaded(true);
        trackSpeech("speech_history_view", { content_source: "speech_account" });
      })
      .catch((error) => {
        if (active)
          setMessage(
            error instanceof Error ? error.message : "Could not load history.",
          );
      });
    return () => {
      active = false;
    };
  }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function load() {
    const data = await practiceFetch("history");
    setAttempts(data.attempts);
    setAnonymous(data.anonymous);
    setBilling(data.billingAvailable);
    setEmailAvailable(data.emailAvailable);
    setEmailVerified(data.emailVerified);
    trackConfirmedSpeechPurchase(data.purchase);
    if (data.emailVerified) trackSpeech("speech_email_verified", { content_source: "speech_account" });
    setSubscription(data.subscription);
    if (new URLSearchParams(window.location.search).get("payment") === "return")
      setMessage(
        data.subscription.active
          ? "Your subscription is active. You can continue practicing."
          : "Your subscription is not confirmed yet. If you completed payment, refresh in a moment. Do not pay again while confirmation is pending.",
      );
    setLoaded(true);
  }
  async function emailLink(existing: boolean) {
    const event = existing ? "speech_recovery" : "speech_email_link";
    trackSpeech(`${event}_start`, { content_source: "speech_account" });
    const auth = (await speechClient()).auth;
    const redirect = `${window.location.origin}/speech/account`;
    const {
      data: { session },
    } = await auth.getSession();
    if (!existing && !session) {
      const result = await auth.signInAnonymously();
      if (result.error) throw result.error;
    }
    const result = existing
      ? await auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false, emailRedirectTo: redirect },
        })
      : await auth.updateUser({ email }, { emailRedirectTo: redirect });
    if (result.error) {
      trackSpeech(`${event}_error`, { content_source: "speech_account", error_code: "service" });
      throw new Error(
        existing
          ? "Could not send a sign-in link. Please check your email and try again later."
          : "Could not link this email. If you already have an account, use the sign-in option.",
      );
    }
    trackSpeech(`${event}_sent`, { content_source: "speech_account" });
    setMessage(
      "Check your email to confirm. Then return here and refresh your history.",
    );
  }
  return (
    <div data-clarity-mask="true" className="space-y-7">
      <Link href="/speech" className="text-sm underline">
        Back to speech topics
      </Link>
      <h1 className="text-3xl font-bold">Your speech practice</h1>
      <p className="text-[var(--text-secondary)]">
        Review your feedback, keep your progress, and choose what to practice
        next.
      </p>
      {emailVerified ? (
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
              try { sessionStorage.removeItem("rt_speech_checkout_pending"); } catch { /* optional measurement */ }
              window.location.assign("/speech/account");
            })}
          >
            Sign out on this device
          </button>
        </section>
      ) : emailAvailable ? (
        <section className="glass-card space-y-4 p-5">
          <h2 className="text-xl font-semibold">
            Keep your practice across devices
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Free practice works without an email. Link an email before clearing
            browser data or switching devices so you can recover your saved
            feedback.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(() => emailLink(false));
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
              <button className={button} disabled={busy}>
                Link my email
              </button>
              <button
                type="button"
                className={button}
                disabled={busy || !email.includes("@")}
                onClick={() => run(() => emailLink(true))}
              >
                Sign in to an existing account
              </button>
            </div>
          </form>
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
      ) : (
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
          <button className={button} disabled={busy} onClick={() => run(load)}>
            {loaded ? "Refresh history" : "Load my history"}
          </button>
        </div>
        {loaded && !attempts.length && (
          <p>
            No saved attempts yet. Start with a topic and a short recording.
          </p>
        )}
        {attempts.map((attempt) => (
          <article
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
                <SpeechHistorySummary nextStep={attempt.feedback.priority.nextStep} repeated={Boolean(attempt.previous_id)} />
                <details>
                  <summary className="cursor-pointer py-2 text-sm">
                    Feedback and transcript
                  </summary>
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
      {loaded && (billing || subscription.manageable) && (
        <section ref={offer} className="glass-card space-y-4 p-5">
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
          <p>
            40 recorded attempts per billing month, including retries. Each
            attempt includes transcription and feedback, up to two minutes.
            Unused attempts do not roll over.
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Renews monthly until canceled. Cancel through Manage subscription.
            Access continues to the end of your paid period.
          </p>
          <div className="flex flex-wrap gap-3">
            {billing && !subscription.active && (
              <button
                className={button}
                disabled={busy}
                onClick={() => {
                  if (!emailVerified) {
                    trackSpeech("speech_checkout_start", { content_source: "speech_account" });
                    setMessage("Verify your email above to continue to secure checkout. Your subscription will stay linked to this account.");
                    emailInput.current?.scrollIntoView({ block: "center", behavior: "smooth" });
                    emailInput.current?.focus({ preventScroll: true });
                    return;
                  }
                  void run(() => openBilling("checkout"));
                }}
              >
                Subscribe for $12/month
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
          {!emailVerified && (
            <p className="text-sm">
              Verify your email above before subscribing.
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
      {loaded && !anonymous && (
        <button
          className={button}
          disabled={busy}
          onClick={() =>
            run(async () => {
              await (await speechClient()).auth.signOut();
              setAttempts([]);
              setLoaded(false);
              setMessage("Signed out.");
            })
          }
        >
          Sign out
        </button>
      )}
      {message && (
        <p
          role="status"
          className="rounded-xl border border-white/20 p-4 text-sm"
        >
          {message}
        </p>
      )}
    </div>
  );
}
