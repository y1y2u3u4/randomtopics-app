"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CLASSROOM_PACKS, classroomPrice, type ClassroomPackId, type ClassroomPurchase } from "@/lib/classroom/catalog";
import { classroomFetch, downloadClassroom, trackClassroom } from "@/lib/classroom/client";
import { practiceFetch, speechClient } from "@/lib/speech/client";

type State = { status: "loading" } | { status: "ready"; owned: ClassroomPackId[]; all: boolean; guest: boolean; signedIn: boolean } | { status: "error"; message: string };

// Classroom pack downloads. Confirms a Checkout return, moves a guest purchase
// after the emailed sign-in link, and lets buyers email themselves a new link.
export default function ClassroomAccount() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("classroom_session") ?? undefined;
        const auth = (await speechClient()).auth;
        const { data } = await auth.getSession();
        if (!data.session) { setState({ status: "ready", owned: [], all: false, guest: true, signedIn: false }); return; }
        if (params.get("claim") === "1" && !data.session.user.is_anonymous) {
          await practiceFetch("claim", {}).catch(() => undefined);
        }
        let result = await (await classroomFetch("purchases", { body: { sessionId } })).json();
        if (sessionId && result.granted.length === 0 && result.owned.length === 0) {
          await new Promise((r) => setTimeout(r, 2500));
          result = await (await classroomFetch("purchases", { body: { sessionId } })).json();
        }
        for (const purchase of result.granted as ClassroomPurchase[]) {
          const key = `rt_classroom_paid_${sessionId ?? purchase}`;
          try {
            if (!localStorage.getItem(key)) {
              trackClassroom("classroom_pack_purchase", { pack: purchase, value: classroomPrice(purchase).cents / 100 });
              localStorage.setItem(key, "1");
            }
          } catch { /* analytics never blocks downloads */ }
        }
        if (result.granted.length) setNotice(result.guest
          ? "Payment confirmed. Your files are below. We also emailed a sign-in link to the address you used at checkout, so you can download them again on any device."
          : "Payment confirmed. Your files are below.");
        if (sessionId) window.history.replaceState(null, "", "/account");
        setState({ status: "ready", owned: result.owned, all: result.all, guest: result.guest, signedIn: !data.session.user.is_anonymous });
      } catch (e) {
        setState({ status: "error", message: e instanceof Error && e.message ? e.message : "Your account could not be loaded. Please refresh." });
      }
    })();
  }, []);

  async function download(pack: ClassroomPackId, format: "pptx" | "pdf") {
    setBusy(`${pack}-${format}`);
    try { await downloadClassroom(pack, format); } catch (e) { setNotice(e instanceof Error ? e.message : "Download failed. Please try again."); }
    setBusy("");
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setSent("sending");
    try {
      const auth = (await speechClient()).auth;
      const { error } = await auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/account?claim=1` } });
      if (error) throw error;
      setSent("sent");
    } catch { setSent("error"); }
  }

  if (state.status === "loading") return <p className="text-[var(--text-muted)]">Loading your account…</p>;
  if (state.status === "error") return <p role="alert" className="text-[var(--neon-pink)]">{state.message}</p>;
  const owned = CLASSROOM_PACKS.filter((p) => state.owned.includes(p.id));
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Your classroom packs</h1>
      {notice && <p role="status" className="glass-card p-4 text-sm text-[var(--neon-cyan)]">{notice}</p>}
      {owned.length === 0 ? (
        <div className="glass-card p-6 space-y-3">
          <p className="text-[var(--text-secondary)]">No classroom packs on this browser yet.</p>
          <Link href="/classroom-packs" className="btn-generate inline-flex px-5 py-3 text-sm">See the classroom packs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {state.all && <p className="text-sm text-[var(--text-muted)]">You have every classroom pack, including packs we add later.</p>}
          {owned.map((p) => (
            <div key={p.id} className="glass-card p-5 space-y-3" data-classroom-owned={p.id}>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{p.title}</h2>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void download(p.id, "pptx")} disabled={busy !== ""} className="btn-generate px-4 py-2 text-sm">
                  {busy === `${p.id}-pptx` ? "Preparing…" : "Download slides (PPTX)"}
                </button>
                <button type="button" onClick={() => void download(p.id, "pdf")} disabled={busy !== ""} className="min-h-11 rounded-xl border border-white/15 px-4 py-2 text-sm text-[var(--text-primary)]">
                  {busy === `${p.id}-pdf` ? "Preparing…" : "Download printable PDF"}
                </button>
                <Link href={`/classroom/present?pack=${p.id}`} className="min-h-11 inline-flex items-center rounded-xl border border-[var(--neon-cyan)]/50 px-4 py-2 text-sm text-[var(--neon-cyan)]">Present ad-free</Link>
              </div>
            </div>
          ))}
          <div className="glass-card p-5 text-sm text-[var(--text-secondary)] space-y-1">
            <h2 className="font-semibold text-[var(--text-primary)]">Use the slides in Google Slides</h2>
            <p>Open slides.google.com → Blank presentation → File → Import slides → Upload → choose the PPTX → Select all → Import slides.</p>
          </div>
        </div>
      )}
      {!state.signedIn && (
        <form onSubmit={sendLink} className="glass-card p-5 space-y-3">
          <h2 className="font-semibold text-[var(--text-primary)]">Bought on another device?</h2>
          <p className="text-sm text-[var(--text-secondary)]">Enter the email you used at checkout and we&apos;ll send a sign-in link that brings your packs to this browser.</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input type="email" required maxLength={254} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address"
              className="min-h-11 flex-1 rounded-xl border border-white/15 bg-black/20 px-3 text-base text-[var(--text-primary)]" />
            <button type="submit" disabled={sent === "sending"} className="btn-generate px-5 py-2 text-sm">{sent === "sending" ? "Sending…" : "Email me a sign-in link"}</button>
          </div>
          {sent === "sent" && <p role="status" className="text-sm text-[var(--neon-cyan)]">Check your inbox for the sign-in link.</p>}
          {sent === "error" && <p role="alert" className="text-sm text-[var(--neon-pink)]">The link could not be sent. Please try again in a minute.</p>}
        </form>
      )}
      <p className="text-sm text-[var(--text-muted)]">Speech feedback practice is on <Link href="/speech/account" className="text-[var(--neon-cyan)]">your speech account</Link>.</p>
    </div>
  );
}
