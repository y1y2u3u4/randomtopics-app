"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Topic } from "@/data/types";
import { track } from "@/lib/track";
import { practiceFetch, PracticeRequestError } from "@/lib/speech/client";
import { recordingToWav } from "@/lib/speech/audio";
import type { SpeechFeedback } from "@/lib/speech/schema";

type Stage =
  | "ready"
  | "permission"
  | "recording"
  | "recorded"
  | "transcribing"
  | "review"
  | "analyzing"
  | "complete";
type Result = {
  id: string;
  transcript: string;
  feedback: SpeechFeedback;
  duration: number;
};
const button =
  "min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
const primary = `${button} bg-[var(--neon-cyan)] text-black`;
export default function SpeechCoach({
  topic,
  topics,
  onTopicChange,
  contentSource,
  visible,
}: {
  topic: Topic;
  topics: Topic[];
  onTopicChange: (topic: Topic) => void;
  contentSource: string;
  visible: boolean;
}) {
  const [stage, setStage] = useState<Stage>("ready");
  const [seconds, setSeconds] = useState(0);
  const [target, setTarget] = useState(60);
  const [error, setError] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [previous, setPrevious] = useState<Result | null>(null);
  const [id, setId] = useState("");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const mounted = useRef(true);
  const generation = useRef(0);
  const started = useRef(0);
  const urls = useRef<string[]>([]);
  const busy = useRef(false);
  const emit = (
    event: string,
    extra: Record<string, string | number | boolean> = {},
  ) =>
    track(event, {
      content_source: contentSource,
      attempt: previous ? 2 : 1,
      ...extra,
    });
  const stop = () => {
    if (recorder.current?.state === "recording") recorder.current.stop();
    stream.current?.getTracks().forEach((t) => t.stop());
    if (timer.current) clearInterval(timer.current);
  };
  useEffect(() => {
    mounted.current = true;
    const recordingUrls = urls.current;
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      mounted.current = false;
      stop();
      recordingUrls.forEach(URL.revokeObjectURL);
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  useEffect(() => {
    if (!visible) {
      generation.current++;
      stop();
    }
  }, [visible]);
  async function start() {
    if (busy.current) return;
    busy.current = true;
    setError("");
    setStage("permission");
    const ticket = ++generation.current;
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      )
        throw new Error(
          "Recording is unavailable in this browser. Try a recent Safari or Chrome, or use the timer below.",
        );
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current || ticket !== generation.current) {
        media.getTracks().forEach((t) => t.stop());
        if (mounted.current) setStage("ready");
        return;
      }
      stream.current = media;
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find(
        (type) => MediaRecorder.isTypeSupported(type),
      );
      const recording = new MediaRecorder(
        media,
        mime ? { mimeType: mime } : undefined,
      );
      const chunks: Blob[] = [];
      recorder.current = recording;
      recording.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recording.onerror = () => {
        stop();
        if (mounted.current) {
          setError(
            "Recording was interrupted. Please check your microphone and try again.",
          );
          setStage("ready");
        }
      };
      recording.onstop = () => {
        media.getTracks().forEach((t) => t.stop());
        if (timer.current) clearInterval(timer.current);
        if (!mounted.current) return;
        const file = new Blob(chunks, { type: recording.mimeType });
        if (!file.size) {
          setStage("ready");
          setError("No audio was captured. Please try again.");
          return;
        }
        const url = URL.createObjectURL(file);
        urls.current.push(url);
        setBlob(file);
        setAudioUrl(url);
        setId(crypto.randomUUID());
        setSeconds(Math.round((performance.now() - started.current) / 1000));
        setStage("recorded");
        emit("speech_record_complete");
      };
      recording.start(250);
      started.current = performance.now();
      setSeconds(0);
      setStage("recording");
      emit("speech_record_start");
      // Stop slightly before two minutes to allow for container padding.
      timer.current = setInterval(() => {
        const elapsed = (performance.now() - started.current) / 1000;
        setSeconds(Math.floor(elapsed));
        if (elapsed >= Math.min(target, 119)) stop();
      }, 200);
    } catch (e) {
      stream.current?.getTracks().forEach((t) => t.stop());
      if (mounted.current) {
        setStage("ready");
        setError(
          e instanceof DOMException && e.name === "NotAllowedError"
            ? "Microphone access was not granted. You can allow it in your browser settings, or keep using the timer."
            : e instanceof DOMException && e.name === "NotFoundError"
              ? "No microphone was found. Connect one or upload an existing recording below. Your topics and timer are still available."
              : e instanceof DOMException && e.name === "NotReadableError"
                ? "Your microphone is busy or unavailable. Close other recording apps, or upload an existing recording."
                : e instanceof Error
                  ? e.message
                  : "Could not start recording.",
        );
        emit("speech_record_error");
      }
    } finally {
      busy.current = false;
    }
  }
  async function transcribe() {
    if (!blob || busy.current) return;
    busy.current = true;
    setError("");
    setStage("transcribing");
    try {
      const audio = await recordingToWav(blob);
      const data = await practiceFetch("transcribe", {
        id,
        topic: topic.text,
        previousId: previous?.id ?? null,
        audio,
      });
      if (mounted.current) {
        setTranscript(data.transcript);
        setSeconds(data.duration);
        setStage("review");
        emit("speech_transcript_ready");
      }
    } catch (e) {
      if (mounted.current) {
        if (e instanceof PracticeRequestError && e.retryWithNewId)
          setId(crypto.randomUUID());
        setError(e instanceof Error ? e.message : "Could not transcribe.");
        setStage("recorded");
      }
    } finally {
      busy.current = false;
    }
  }
  async function analyze() {
    if (busy.current) return;
    busy.current = true;
    setError("");
    setStage("analyzing");
    try {
      const data = await practiceFetch("feedback", { id, transcript });
      if (mounted.current) {
        setResult(data);
        setHelpful(null);
        setStage("complete");
        emit("speech_feedback_view");
      }
    } catch (e) {
      if (mounted.current) {
        setError(
          e instanceof Error ? e.message : "Could not generate feedback.",
        );
        setStage("review");
      }
    } finally {
      busy.current = false;
    }
  }
  function reset() {
    setBlob(null);
    setAudioUrl("");
    setTranscript("");
    setResult(null);
    setError("");
    setSeconds(0);
    setId("");
    setStage("ready");
    urls.current.forEach(URL.revokeObjectURL);
    urls.current.length = 0;
  }
  function upload(file: File | undefined) {
    if (!file) return;
    if (!file.size || file.size > 8_000_000) {
      setError(
        "Choose an audio file smaller than 8 MB, between 5 seconds and two minutes.",
      );
      return;
    }
    const url = URL.createObjectURL(file);
    urls.current.push(url);
    setBlob(file);
    setAudioUrl(url);
    setSeconds(0);
    setId(crypto.randomUUID());
    setError("");
    setStage("recorded");
    emit("speech_audio_selected");
  }
  const working = [
    "permission",
    "recording",
    "transcribing",
    "analyzing",
  ].includes(stage);
  return (
    <div className="mt-5 space-y-5 border-t border-white/10 pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 text-sm text-[var(--neon-cyan)]">
            {previous ? "Same topic · Second attempt" : "Your first attempt"}
          </p>
          <h3 className="text-xl font-semibold leading-relaxed">
            {topic.text}
          </h3>
        </div>
        <Link
          href="/speech/account"
          className="min-h-11 py-2 text-sm underline"
        >
          Practice history & account
        </Link>
      </div>
      {stage === "ready" && !previous && topics.length > 1 && (
        <label className="block text-sm">
          Choose a topic
          <select
            className="mt-2 w-full rounded-xl border border-white/15 bg-[var(--bg-primary)] p-3"
            value={topic.id}
            onChange={(e) => {
              const next = topics.find((t) => t.id === e.target.value);
              if (next) onTopicChange(next);
            }}
          >
            {!topics.some((t) => t.id === topic.id) && (
              <option value={topic.id}>{topic.text}</option>
            )}
            {topics.map((t) => (
              <option value={t.id} key={t.id}>
                {t.text}
              </option>
            ))}
          </select>
        </label>
      )}
      {previous && (
        <aside className="rounded-xl border border-[var(--neon-cyan)]/25 p-4">
          <p className="text-sm font-semibold">Focus on this one change</p>
          <p className="mt-2">{previous.feedback.priority.nextStep}</p>
        </aside>
      )}
      {["ready", "permission", "recording"].includes(stage) && (
        <div className="rounded-2xl bg-black/20 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">
                {stage === "recording"
                  ? "Recording · microphone on"
                  : "Practice time"}
              </p>
              <p className="mt-1 font-mono text-4xl tabular-nums">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {stage === "ready" && (
                <label className="text-sm">
                  Time
                  <select
                    aria-label="Recording time"
                    value={target}
                    onChange={(e) => setTarget(Number(e.target.value))}
                    className="ml-2 rounded-lg bg-[var(--bg-primary)] p-3"
                  >
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                  </select>
                </label>
              )}
              {stage === "recording" ? (
                <button type="button" className={primary} onClick={stop}>
                  Stop & listen
                </button>
              ) : (
                <button
                  type="button"
                  className={primary}
                  disabled={stage === "permission"}
                  onClick={start}
                >
                  {stage === "permission"
                    ? "Waiting for microphone…"
                    : "Start recording"}
                </button>
              )}
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
            Start with your point, give one concrete example, then return to
            your point. No outline required. Recording stops when you leave this
            tab.
          </p>
        </div>
      )}
      {audioUrl && (
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            Listen to your {seconds > 0 ? `${seconds}-second ` : ""}answer
          </p>
          <audio
            controls
            src={audioUrl}
            className="w-full"
            preload="metadata"
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              if (Number.isFinite(duration)) setSeconds(Math.ceil(duration));
            }}
          />
          <a
            className="inline-block min-h-11 py-2 text-sm underline"
            href={audioUrl}
            download={
              blob instanceof File
                ? blob.name
                : `speech-practice.${blob?.type.includes("mp4") ? "m4a" : "webm"}`
            }
          >
            Download recording
          </a>
        </div>
      )}
      {stage === "ready" && (
        <label className="block rounded-xl border border-white/15 p-4 text-sm">
          <span className="font-semibold">Or upload an existing recording</span>
          <span className="mt-1 block text-[var(--text-muted)]">
            5 seconds–2 minutes · up to 8 MB. Nothing is sent until you choose
            to transcribe.
          </span>
          <input
            type="file"
            accept="audio/*,.m4a,.wav,.mp3,.webm"
            className="mt-3 block max-w-full text-sm"
            onChange={(e) => {
              upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
      )}
      {stage === "recorded" && (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            Your recording stays on this device until you choose “Transcribe my
            answer”. Then it is sent through OpenRouter to a model provider. We
            save the transcript and feedback privately, not the audio.{" "}
            <Link href="/privacy" className="underline">
              Privacy details
            </Link>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={primary} onClick={transcribe}>
              Transcribe my answer
            </button>
            <button type="button" className={button} onClick={reset}>
              Record again
            </button>
          </div>
        </div>
      )}
      {["review", "analyzing"].includes(stage) && (
        <div>
          <label className="block font-semibold" htmlFor="speech-transcript">
            Check what we heard
          </label>
          <p className="mb-3 mt-1 text-sm text-[var(--text-muted)]">
            Correct transcription mistakes before getting feedback. Keep your
            original words so the comparison is useful.
          </p>
          <textarea
            id="speech-transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            maxLength={10000}
            rows={8}
            disabled={stage === "analyzing"}
            className="w-full rounded-xl border border-white/15 bg-black/20 p-4 text-base leading-relaxed"
          />
          <button
            type="button"
            className={`${primary} mt-3`}
            disabled={stage === "analyzing" || transcript.trim().length < 20}
            onClick={analyze}
          >
            Get specific feedback
          </button>
        </div>
      )}
      {["transcribing", "analyzing"].includes(stage) && (
        <p role="status" className="rounded-xl border border-white/10 p-4">
          {stage === "transcribing"
            ? "Listening to your answer…"
            : "Finding one useful change for your next attempt…"}{" "}
          This may take up to a minute. Your saved result will also appear in
          practice history.
        </p>
      )}
      {stage === "complete" && result && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-muted)]">
            Feedback on your words and structure. This does not assess your
            voice or accent.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <FeedbackCard
              title="Keep doing this"
              {...result.feedback.strength}
            />
            <FeedbackCard
              title="Change this next"
              {...result.feedback.priority}
            />
          </div>
          <div className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
            <h4 className="font-semibold">Your next attempt</h4>
            <p className="mt-2 leading-relaxed">
              {result.feedback.priority.nextStep}
            </p>
          </div>
          <details className="rounded-xl border border-white/10 p-4">
            <summary className="cursor-pointer font-semibold">
              Your point, example and ending
            </summary>
            <dl className="mt-4 space-y-3">
              {Object.entries(result.feedback.structure).map(([key, value]) => (
                <div key={key}>
                  <dt className="font-semibold capitalize">{key}</dt>
                  <dd className="mt-1 text-[var(--text-secondary)]">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 whitespace-pre-wrap text-sm text-[var(--text-muted)]">
              {result.transcript}
            </p>
          </details>
          {previous && (
            <div className="rounded-xl border border-white/15 p-5">
              <h4 className="font-semibold">
                What changed:{" "}
                {result.feedback.comparison.outcome.replaceAll("_", " ")}
              </h4>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <blockquote className="text-sm">
                  <span className="block text-[var(--text-muted)]">
                    First attempt
                  </span>
                  {result.feedback.comparison.beforeQuote ||
                    "Not enough evidence to quote."}
                </blockquote>
                <blockquote className="text-sm">
                  <span className="block text-[var(--text-muted)]">
                    Second attempt
                  </span>
                  {result.feedback.comparison.afterQuote ||
                    "Not enough evidence to quote."}
                </blockquote>
              </div>
              <p className="mt-3">{result.feedback.comparison.explanation}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">Was this feedback useful?</span>
            {helpful === null ? (
              [true, false].map((value) => (
                <button
                  type="button"
                  key={String(value)}
                  className={button}
                  onClick={() => {
                    setHelpful(value);
                    emit("speech_feedback_helpful", { helpful: value });
                  }}
                >
                  {value ? "Yes" : "Not yet"}
                </button>
              ))
            ) : (
              <span role="status" className="text-sm">
                Thanks for the feedback.
              </span>
            )}
          </div>
          {!previous ? (
            <button
              type="button"
              className={primary}
              onClick={() => {
                setPrevious(result);
                reset();
                emit("speech_retry_start");
              }}
            >
              Try this topic again
            </button>
          ) : (
            <Link href="/speech/account" className={`${button} inline-block`}>
              Continue practicing · See your options
            </Link>
          )}
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm leading-relaxed"
        >
          {error}{" "}
          <Link href="/speech/account" className="underline">
            Open practice history
          </Link>
        </p>
      )}
      {!working && (
        <p className="text-sm text-[var(--text-muted)]">
          You can hide this panel and keep using your topics, notes and timer.
          Unsubmitted recordings remain only in this open page.
        </p>
      )}
    </div>
  );
}
function FeedbackCard({
  title,
  quote,
  observation,
}: {
  title: string;
  quote: string;
  observation: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-5">
      <h4 className="font-semibold">{title}</h4>
      {quote && (
        <blockquote className="my-3 border-l-2 border-[var(--neon-cyan)]/60 pl-3 text-[var(--text-secondary)]">
          “{quote}”
        </blockquote>
      )}
      <p className="mt-3 leading-relaxed">{observation}</p>
    </div>
  );
}
