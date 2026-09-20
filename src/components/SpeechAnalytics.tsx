import Link from "next/link";
import { getSpeechReport } from "@/lib/googleReporting";
const number = new Intl.NumberFormat("zh-CN");
const rate = (n: number, d: number) => d ? `${(100 * n / d).toFixed(1)}%` : "—";
export default async function SpeechAnalytics({ days = 7, refresh = false }: { days?: number; refresh?: boolean }) {
  let report;
  try { report = await getSpeechReport(days, refresh); } catch {
    return <section className="glass-card p-6"><h2 className="text-xl font-bold">演讲练习分析</h2><p className="mt-3">GA4 数据暂不可用。请检查报表连接；这不代表没有用户。</p></section>;
  }
  const count = (event: string) => report.events.find((r) => r.eventName === event)?.eventCount ?? 0;
  const yes = count("speech_feedback_yes");
  const no = count("speech_feedback_no");
  const breakdownEvents = ["speech_entry_view", "speech_first_feedback_view", "speech_retry_feedback_view", "speech_paid_interest_yes"];
  const labels = ["入口曝光人数", "首次反馈人数", "重练反馈人数", "有付费兴趣人数"];
  const clarity = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return <section id="speech-analytics" className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-bold">演讲练习 · 从流量到价值</h2><p className="mt-2 text-sm text-[var(--text-muted)]">最近 {report.days} 个完整日（GA4 属性时区）· 仅正式域名 · speech-v2</p></div>
      <div className="flex gap-3"><Link className="underline" href="?speech_days=7#speech-analytics">7 天</Link><Link className="underline" href="?speech_days=28#speech-analytics">28 天</Link>
        {clarity && <a className="underline" href={`https://clarity.microsoft.com/projects/view/${clarity}/recordings`} target="_blank" rel="noreferrer">Clarity 回放</a>}</div>
    </div>
    <p className="text-sm text-[var(--text-secondary)]">有序漏斗按 GA4 用户去重，必须按顺序完成，每相邻步骤不超过 24 小时。可跨会话，不保证是同一条录音；清除 Cookie、换设备及拦截统计会影响识别。数据未成熟时先看人数。</p>
    <div className="grid gap-4 lg:grid-cols-3">{report.funnels.map((funnel) => <article key={funnel.key} className="glass-card p-5">
      <h3 className="font-semibold">{funnel.title}</h3>
      {!funnel.available ? <p className="mt-4 text-sm text-amber-200">有序漏斗接口暂不可用，不能用事件次数相除替代。</p> : <ol className="mt-4 space-y-3">{funnel.rows.map((row, index) => <li key={row.label}>
        <div className="flex justify-between gap-2 text-sm"><span>{index + 1}. {row.label}</span><strong>{number.format(row.users)}</strong></div>
        <div className="mt-1 h-1 rounded bg-white/10"><div className="h-1 rounded bg-cyan-300" style={{ width: `${funnel.rows[0]?.users ? Math.min(100, 100 * row.users / funnel.rows[0].users) : 0}%` }} /></div>
        {index > 0 && <p className="mt-1 text-xs text-[var(--text-muted)]">上一步 → 本步 {rate(row.users, funnel.rows[index - 1].users)}</p>}
      </li>)}</ol>}
      {funnel.qualified && <p className="mt-3 text-xs">GA4 提示此结果受采样或隐私阈值影响。</p>}
    </article>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[
      ["反馈有用率", rate(yes, yes + no), `${yes} 次有用 / ${yes + no} 次明确评价；不是全部使用者满意度`],
      ["转写失败", String(count("speech_transcribe_error")), `${count("speech_transcribe_start")} 次提交；重试也计一次请求`],
      ["反馈失败", String(count("speech_feedback_error")), `${count("speech_feedback_start")} 次请求；历史恢复请求单独记录`],
      ["额度触达", String(count("speech_quota_hit")), "次数；不会自动算成付费意愿"],
      ["付费兴趣：愿意", String(count("speech_paid_interest_yes")), "未展示价格的自报兴趣，非付费转化"],
      ["付费兴趣：不确定", String(count("speech_paid_interest_unsure")), "需要更多价值证明"],
      ["只想免费使用", String(count("speech_paid_interest_no")), "与未回答用户分开"],
      ["超过 15 秒的请求", `${count("speech_transcribe_slow")} / ${count("speech_feedback_slow")}`, "转写 / 反馈成功请求中的慢请求"],
    ].map(([label, value, note]) => <article key={label} className="glass-card p-4"><h3 className="text-sm">{label}</h3><p className="my-2 text-2xl font-bold">{value}</p><p className="text-xs text-[var(--text-muted)]">{note}</p></article>)}</div>
    {["device", "source"].map((kind) => {
      const rows = kind === "device" ? report.devices.map((r) => ({ ...r, key: r.device })) : report.sources.map((r) => ({ ...r, key: r.source }));
      const keys = [...new Set(rows.map((r) => r.key))];
      return <details key={kind} className="glass-card p-5" open={kind === "device"}><summary className="cursor-pointer font-semibold">{kind === "device" ? "设备" : "会话来源 / 媒介"}拆解 · 各事件独立人数</summary>
        <div className="overflow-x-auto"><table className="mt-4 w-full min-w-[620px] text-left text-sm"><thead><tr><th>分组</th>{labels.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{keys.map((key) => <tr key={key} className="border-t border-white/10"><td className="py-3">{key}</td>{breakdownEvents.map((event) => <td key={event}>{number.format(rows.find((r) => r.key === key && r.event === event)?.users ?? 0)}</td>)}</tr>)}</tbody></table></div>
        {!keys.length && <p className="mt-3 text-sm">暂无正式流量数据。</p>}
      </details>;
    })}
    <details className="glass-card p-5"><summary className="cursor-pointer">全部练习事件 · 用于核对接收</summary><div className="overflow-x-auto"><table className="mt-3 w-full text-left text-sm"><thead><tr><th>事件</th><th>次数</th><th>用户</th></tr></thead><tbody>{report.events.map((r) => <tr key={r.eventName}><td className="py-1">{r.eventName}</td><td>{r.eventCount}</td><td>{r.totalUsers}</td></tr>)}</tbody></table></div></details>
    <details className="glass-card p-5"><summary className="cursor-pointer">失败原因 · 权限、设备、静音、额度、服务</summary><ul className="mt-3 space-y-2 text-sm">{report.events.filter((r) => r.eventName.startsWith("speech_issue_")).map((r) => <li key={r.eventName}>{r.eventName.replace("speech_issue_", "")}：{r.eventCount} 次 / {r.totalUsers} 人</li>)}</ul></details>
    <p className="text-xs text-[var(--text-muted)]">回放仅覆盖已同意的成人演讲页访客，因此回放数不是全部用户数。付费兴趣问卷未指定价格，不证明支付意愿或收入。</p>
  </section>;
}
