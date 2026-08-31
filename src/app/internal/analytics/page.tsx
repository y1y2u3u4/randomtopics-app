import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { hasAnalyticsSession, isAnalyticsAuthConfigured } from "@/lib/analyticsAuth";
import {
  getAnalyticsDashboardData,
  type GaEventRow,
  type GaPageRow,
  type GscDimensionRow,
} from "@/lib/googleReporting";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Internal Analytics | RandomTopics" },
  description: "Private GA4 and Search Console reporting for RandomTopics.",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

function formatPercent(value: number): string {
  return `${decimal.format(value * 100)}%`;
}
function changePercent(
  current: number,
  previous: number,
  lowerIsBetter = false
): number | null {
  if (!Number.isFinite(previous) || previous === 0) return null;
  const raw = ((current - previous) / Math.abs(previous)) * 100;
  return lowerIsBetter ? -raw : raw;
}

function ChangePill({
  current,
  previous,
  lowerIsBetter = false,
}: {
  current: number;
  previous: number;
  lowerIsBetter?: boolean;
}) {
  const change = changePercent(current, previous, lowerIsBetter);
  if (change === null) {
    return <span className="text-xs text-[var(--text-muted)]">No baseline</span>;
  }
  const positive = change >= 0;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        positive
          ? "bg-emerald-400/10 text-emerald-300"
          : "bg-rose-400/10 text-rose-300"
      }`}
    >
      {positive ? "↑" : "↓"} {decimal.format(Math.abs(change))}%
    </span>
  );
}

function MetricCard({
  label,
  value,
  current,
  previous,
  lowerIsBetter,
  note,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  lowerIsBetter?: boolean;
  note: string;
}) {
  return (
    <article className="glass-card p-5 min-w-0">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <ChangePill
          current={current}
          previous={previous}
          lowerIsBetter={lowerIsBetter}
        />
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs text-[var(--text-muted)]">{note}</p>
    </article>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function EventTable({ rows }: { rows: GaEventRow[] }) {
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="border-b border-white/10 text-[var(--text-muted)]">
          <tr>
            <th className="px-5 py-3 font-medium">Event</th>
            <th className="px-5 py-3 text-right font-medium">Events</th>
            <th className="px-5 py-3 text-right font-medium">Key events</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={row.eventName} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3 font-mono text-xs text-cyan-200">{row.eventName}</td>
                <td className="px-5 py-3 text-right text-white">{integer.format(row.eventCount)}</td>
                <td className="px-5 py-3 text-right text-white">{integer.format(row.keyEvents)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-5 py-8 text-center text-[var(--text-muted)]">
                These events have not appeared in the selected period yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function GaPagesTable({ rows }: { rows: GaPageRow[] }) {
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-white/10 text-[var(--text-muted)]">
          <tr>
            <th className="px-5 py-3 font-medium">Page path</th>
            <th className="px-5 py-3 text-right font-medium">Users</th>
            <th className="px-5 py-3 text-right font-medium">Views</th>
            <th className="px-5 py-3 text-right font-medium">Key events</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.path} className="border-b border-white/5 last:border-0">
              <td className="max-w-md truncate px-5 py-3 font-mono text-xs text-cyan-100" title={row.path}>
                {row.path}
              </td>
              <td className="px-5 py-3 text-right">{integer.format(row.activeUsers)}</td>
              <td className="px-5 py-3 text-right">{integer.format(row.screenPageViews)}</td>
              <td className="px-5 py-3 text-right">{integer.format(row.keyEvents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GscTable({ rows, kind }: { rows: GscDimensionRow[]; kind: "page" | "query" }) {
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 text-[var(--text-muted)]">
          <tr>
            <th className="px-5 py-3 font-medium">{kind === "page" ? "Page" : "Query"}</th>
            <th className="px-5 py-3 text-right font-medium">Clicks</th>
            <th className="px-5 py-3 text-right font-medium">Impressions</th>
            <th className="px-5 py-3 text-right font-medium">CTR</th>
            <th className="px-5 py-3 text-right font-medium">Position</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-white/5 last:border-0">
              <td className="max-w-lg truncate px-5 py-3 text-cyan-100" title={row.key}>
                {row.key}
              </td>
              <td className="px-5 py-3 text-right">{integer.format(row.clicks)}</td>
              <td className="px-5 py-3 text-right">{integer.format(row.impressions)}</td>
              <td className="px-5 py-3 text-right">{formatPercent(row.ctr)}</td>
              <td className="px-5 py-3 text-right">{decimal.format(row.position)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoginView({ error }: { error?: string }) {
  const message =
    error === "invalid"
      ? "访问密码不正确，请重新输入。"
      : error === "configuration"
        ? "生产环境尚未配置分析面板密码。"
        : null;

  return (
    <main className="mx-auto flex min-h-[80vh] w-full max-w-lg items-center px-5 py-16">
      <section className="glass-card w-full p-7 sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Private reporting</p>
        <h1 className="mt-3 text-3xl font-bold text-white">RandomTopics Analytics</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          输入 Vercel 中保存的内部报表密码。Google 私钥只在服务端使用，不会发送到浏览器。
        </p>
        {message ? (
          <p className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {message}
          </p>
        ) : null}
        <form action="/api/internal/analytics/session" method="post" className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-[var(--text-secondary)]" htmlFor="secret">
            Dashboard password
          </label>
          <input
            id="secret"
            name="secret"
            type="password"
            required
            minLength={32}
            maxLength={512}
            autoComplete="current-password"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
          />
          <button type="submit" className="btn-generate w-full py-3 text-base">
            Open analytics
          </button>
        </form>
        <p className="mt-5 text-xs leading-5 text-[var(--text-muted)]">
          成功后会创建 90 天 HttpOnly 会话；页面与接口均为 noindex、no-store。
        </p>
      </section>
    </main>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (!(await hasAnalyticsSession())) {
    return <LoginView error={typeof params.error === "string" ? params.error : undefined} />;
  }

  let data;
  try {
    data = await getAnalyticsDashboardData(params.refresh === "1");
  } catch {
    return (
      <main className="mx-auto w-full max-w-3xl px-5 py-16">
        <section className="glass-card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Reporting unavailable</p>
          <h1 className="mt-3 text-3xl font-bold">无法读取 Google 报表</h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            服务端没有返回凭证详情。请先检查公开健康接口，再重新刷新。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/api/internal/analytics/health" className="mode-chip">Health check</Link>
            <Link href="/internal/analytics?refresh=1" className="mode-chip">Retry</Link>
          </div>
        </section>
      </main>
    );
  }

  const ga = data.ga4;
  const gsc = data.searchConsole;
  const configured = isAnalyticsAuthConfigured();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">Private reporting</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Traffic & Conversion Dashboard</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            GA4 与 Search Console 直接读取 · 五分钟服务端缓存 · 最近更新 {new Date(data.generatedAt).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/internal/analytics?refresh=1" className="mode-chip">↻ Refresh</Link>
          <Link href="/api/internal/analytics/summary" className="mode-chip">JSON</Link>
          <form action="/api/internal/analytics/logout" method="post">
            <button type="submit" className="mode-chip">Log out</button>
          </form>
        </div>
      </header>

      {!configured ? (
        <p className="mb-8 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
          Dashboard authentication is not fully configured.
        </p>
      ) : null}

      <div className="space-y-12">
        <Section title="GA4 · 最近完整 7 天" subtitle="与此前 7 个完整自然日比较；今日数据单独展示，不混入同比。">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Active users" value={integer.format(ga.current7.activeUsers)} current={ga.current7.activeUsers} previous={ga.previous7.activeUsers} note={`Today ${integer.format(ga.today.activeUsers)} · Yesterday ${integer.format(ga.yesterday.activeUsers)}`} />
            <MetricCard label="Sessions" value={integer.format(ga.current7.sessions)} current={ga.current7.sessions} previous={ga.previous7.sessions} note={`Today ${integer.format(ga.today.sessions)} · Yesterday ${integer.format(ga.yesterday.sessions)}`} />
            <MetricCard label="Page views" value={integer.format(ga.current7.screenPageViews)} current={ga.current7.screenPageViews} previous={ga.previous7.screenPageViews} note={`28 days ${integer.format(ga.current28.screenPageViews)}`} />
            <MetricCard label="Key events" value={integer.format(ga.current7.keyEvents)} current={ga.current7.keyEvents} previous={ga.previous7.keyEvents} note={`28 days ${integer.format(ga.current28.keyEvents)}`} />
          </div>
        </Section>

        <Section title="GA4 · 转化事件" subtitle="最近 28 天；新成功事件与旧关键事件兼容别名会分别展示。">
          <EventTable rows={ga.events28} />
        </Section>

        <Section title="GA4 · 页面表现" subtitle="最近 28 天，按页面浏览量排序。">
          <GaPagesTable rows={ga.pages28} />
        </Section>

        <Section title="Search Console · 最近完整 7 天" subtitle={`${gsc.current7Range.startDate} 至 ${gsc.current7Range.endDate}；最新可用日期 ${gsc.latestDate}。`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Clicks" value={integer.format(gsc.current7.clicks)} current={gsc.current7.clicks} previous={gsc.previous7.clicks} note={`28 days ${integer.format(gsc.current28.clicks)}`} />
            <MetricCard label="Impressions" value={integer.format(gsc.current7.impressions)} current={gsc.current7.impressions} previous={gsc.previous7.impressions} note={`28 days ${integer.format(gsc.current28.impressions)}`} />
            <MetricCard label="CTR" value={formatPercent(gsc.current7.ctr)} current={gsc.current7.ctr} previous={gsc.previous7.ctr} note={`Previous 7 days ${formatPercent(gsc.previous7.ctr)}`} />
            <MetricCard label="Average position" value={decimal.format(gsc.current7.position)} current={gsc.current7.position} previous={gsc.previous7.position} lowerIsBetter note={`Previous 7 days ${decimal.format(gsc.previous7.position)}`} />
          </div>
        </Section>

        <div className="grid gap-10 xl:grid-cols-2">
          <Section title="Top organic pages" subtitle={`${gsc.current28Range.startDate} 至 ${gsc.current28Range.endDate}`}>
            <GscTable rows={gsc.pages28} kind="page" />
          </Section>
          <Section title="Top organic queries" subtitle="最近 28 个完整 Search Console 数据日。">
            <GscTable rows={gsc.queries28} kind="query" />
          </Section>
        </div>
      </div>
    </main>
  );
}
