"use client";
import { useCallback, useEffect, useState } from "react";
import SubPaywall from "@/components/subs/SubPaywall";
import { useSubPlan } from "@/components/subs/useSubPlan";
import { subFetch, trackSub, trackSubUsage } from "@/lib/subs/client";
import { BOT_CATEGORIES, BOT_MAX_CHANNELS, type BotPlatform } from "@/lib/subs/bot";

interface Channel {
  id: string; platform: BotPlatform; label: string; category: string; frequency: string; sendHour: number; timezone: string;
  masked: string; trialEndsAt: string; sentCount: number; lastSentAt: string | null; lastError: string | null; active: boolean; sending: boolean;
}
interface ListResult { access: boolean; channels: Channel[] }

const PLATFORMS: { id: BotPlatform; label: string; placeholder: string }[] = [
  { id: "slack", label: "Slack", placeholder: "https://hooks.slack.com/services/T000/B000/XXXX" },
  { id: "discord", label: "Discord", placeholder: "https://discord.com/api/webhooks/123456789/abcdef…" },
  { id: "teams", label: "Microsoft Teams", placeholder: "https://prod-00.westus.logic.azure.com/workflows/…" },
];
const FREQUENCIES = [
  { id: "daily", label: "Every day" },
  { id: "weekdays", label: "Weekdays (Mon–Fri)" },
  { id: "weekly", label: "Once a week (Mondays)" },
];
const field = "w-full rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm text-[#f4ecdf] placeholder:text-white/35 focus:outline-none focus:border-white/40";
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;
const nameOf = (id: string) => PLATFORMS.find((p) => p.id === id)?.label ?? id;
const categoryOf = (id: string) => BOT_CATEGORIES.find((c) => c.id === id)?.label ?? id;

export default function BotSetup({ defaultPlatform = "slack" }: { defaultPlatform?: BotPlatform }) {
  const plan = useSubPlan("bot");
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [now, setNow] = useState(0);
  const [platform, setPlatform] = useState<BotPlatform>(defaultPlatform);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("mixed");
  const [frequency, setFrequency] = useState("weekdays");
  const [hour, setHour] = useState(9);
  const [timezone, setTimezone] = useState("UTC");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- detect the viewer's time zone once after mount */
  useEffect(() => {
    try { setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"); } catch { /* keep UTC */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const refresh = useCallback(async () => {
    try {
      const result = await subFetch<ListResult>("bot", { action: "list" });
      setChannels(result?.channels ?? []);
    } catch {
      setChannels([]);
    }
    setNow(Date.now());
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of this user's channels
    void refresh();
  }, [refresh]);

  const message = (e: unknown) => (e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.");

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setBusy("add");
    setNotice(null);
    try {
      const result = await subFetch<{ first: boolean; sent: boolean; error: string | null }>(
        "bot", { action: "add", platform, webhookUrl: url.trim(), category, frequency, sendHour: hour, timezone }, true);
      if (result?.first) trackSub("bot", "trial_start");
      if (result?.sent) {
        trackSubUsage("bot_message_sent", "bot", { platform, kind: "add" });
        setNotice({ ok: true, text: `Test question sent. Check your ${nameOf(platform)} channel.` });
      } else if (result?.error) {
        setNotice({ ok: false, text: `Saved, but the test message failed: ${result.error}` });
      } else {
        setNotice({ ok: true, text: "Channel saved. Your free week is over, so it will post once you pick a plan." });
      }
      setUrl("");
      await refresh();
    } catch (e) {
      setNotice({ ok: false, text: message(e) });
    }
    setBusy(null);
  }

  async function test(channel: Channel) {
    setBusy(channel.id);
    setNotice(null);
    try {
      await subFetch("bot", { action: "test", id: channel.id });
      trackSubUsage("bot_message_sent", "bot", { platform: channel.platform, kind: "test" });
      setNotice({ ok: true, text: `Test question sent to ${nameOf(channel.platform)}.` });
    } catch (e) {
      setNotice({ ok: false, text: message(e) });
    }
    await refresh();
    setBusy(null);
  }

  async function remove(channel: Channel) {
    setBusy(channel.id);
    setNotice(null);
    try {
      await subFetch("bot", { action: "remove", id: channel.id });
      setNotice({ ok: true, text: "Channel removed. The bot will not post there again." });
    } catch (e) {
      setNotice({ ok: false, text: message(e) });
    }
    await refresh();
    setBusy(null);
  }

  const list = channels ?? [];
  const full = list.length >= BOT_MAX_CHANNELS;
  const trialEnd = list.length ? Math.min(...list.map((c) => new Date(c.trialEndsAt).getTime())) : 0;
  const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / 86_400_000));
  const trialOver = list.length > 0 && now > 0 && trialEnd <= now;
  const showPaywall = !plan.active && plan.state !== "checking" && list.length > 0 && now > 0 && (trialOver || daysLeft <= 2);
  const status = (c: Channel) => {
    if (!c.active) return "Paused";
    if (c.sending) return plan.active ? "Sending (plan active)" : `Sending (free week: ${Math.max(0, Math.ceil((new Date(c.trialEndsAt).getTime() - now) / 86_400_000))} days left)`;
    return "Stopped: free week is over";
  };

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 space-y-4">
        <h2 className="text-lg font-bold text-[#f4ecdf]">Add a channel</h2>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Platform">
          {PLATFORMS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={platform === p.id} onClick={() => setPlatform(p.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${platform === p.id ? "border-[#f4ecdf] bg-[#f4ecdf] text-[#14110f]" : "border-white/15 text-white/75 hover:border-white/40"}`}>
              {p.label}
            </button>
          ))}
        </div>
        <label className="block text-sm text-white/70">
          Webhook URL
          <input className={`${field} mt-1`} type="url" required autoComplete="off" spellCheck={false} value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder={PLATFORMS.find((p) => p.id === platform)?.placeholder} />
          <span className="mt-1 block text-xs text-white/50">Treat it like a password: anyone with the URL can post to the channel. We only show its last 4 characters back.</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-white/70">Questions
            <select className={`${field} mt-1`} value={category} onChange={(e) => setCategory(e.target.value)}>
              {BOT_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="block text-sm text-white/70">How often
            <select className={`${field} mt-1`} value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              {FREQUENCIES.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </label>
          <label className="block text-sm text-white/70">Time
            <select className={`${field} mt-1`} value={hour} onChange={(e) => setHour(Number(e.target.value))}>
              {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{hourLabel(h)}</option>)}
            </select>
          </label>
          <label className="block text-sm text-white/70">Time zone
            <input className={`${field} mt-1`} value={timezone} onChange={(e) => setTimezone(e.target.value)} spellCheck={false} />
          </label>
        </div>
        <button type="submit" disabled={busy !== null || full || !url.trim()}
          className="rounded-full bg-[#f4ecdf] px-6 py-3 text-sm font-bold text-[#14110f] disabled:opacity-50">
          {busy === "add" ? "Adding…" : full ? `Limit of ${BOT_MAX_CHANNELS} channels reached` : list.length ? "Add channel and send a test" : "Start free week and send a test"}
        </button>
        <p className="text-xs text-white/50">Posts go out at the chosen hour (the bot checks once an hour). The first channel starts a 7-day free trial; no card needed.</p>
        {notice && <p role="status" className={`text-sm ${notice.ok ? "text-emerald-300" : "text-rose-300"}`}>{notice.text}</p>}
      </form>

      {plan.active && <p className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-200">Plan active. Your channels keep posting on schedule.</p>}
      {plan.message && <p className="text-sm text-white/70">{plan.message}</p>}

      {list.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 space-y-3" aria-label="Your channels">
          <h2 className="text-lg font-bold text-[#f4ecdf]">Your channels</h2>
          <ul className="space-y-3">
            {list.map((c) => (
              <li key={c.id} className="rounded-xl border border-white/10 bg-black/20 p-3 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-[#f4ecdf]">{nameOf(c.platform)} <span className="font-normal text-white/50">{c.masked}</span></p>
                  <p className={`text-xs font-semibold ${c.sending ? "text-emerald-300" : "text-amber-300"}`}>{status(c)}</p>
                </div>
                <p className="text-sm text-white/65">{categoryOf(c.category)} · {FREQUENCIES.find((f) => f.id === c.frequency)?.label} · {hourLabel(c.sendHour)} {c.timezone} · {c.sentCount} sent</p>
                {c.lastError && <p className="text-sm text-rose-300">Last problem: {c.lastError}</p>}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => test(c)} disabled={busy !== null || !c.sending}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/85 hover:border-white/50 disabled:opacity-40">
                    {busy === c.id ? "Working…" : "Send a test now"}
                  </button>
                  <button type="button" onClick={() => remove(c)} disabled={busy !== null}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 hover:text-rose-300 disabled:opacity-40">Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {showPaywall && (
        <SubPaywall product="bot"
          heading={trialOver ? "Sending is paused" : `Your free week ends in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
          note={trialOver ? "The free week is over, so the bot has stopped posting. Pick a plan and it resumes at the next scheduled time." : "Pick a plan before it ends so the questions keep arriving."} />
      )}
    </div>
  );
}
