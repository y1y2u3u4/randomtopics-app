import { getSpeechServerReport } from "@/lib/speech/serverReport";

export default async function SpeechServerAnalytics() {
  let report;
  try { report = await getSpeechServerReport(); } catch {
    return <section className="glass-card p-5"><h2 className="text-xl font-semibold">练习服务端核对 · 过去24小时</h2><p className="mt-2">数据库统计暂不可用，不表示没有提交。</p></section>;
  }
  const date = (iso: string) => new Date(iso).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
  return <section className="glass-card space-y-3 p-5">
    <h2 className="text-xl font-semibold">练习服务端核对 · 过去24小时</h2>
    <p className="text-sm">{date(report.start)} 至 {date(report.end)}（北京时间）。这是独立的滚动窗口，不跟随下方 GA4 日期选项。</p>
    {!report.complete && <p role="status">记录超过本次查询上限，以下仅为部分数据，不可计算完整转化率。</p>}
    <div className="grid gap-3 sm:grid-cols-3">{[
      ["v5 首轮提交 / 已完成反馈", `${report.firstAttempts} / ${report.firstComplete}`],
      ["v5 重练提交 / 已完成反馈", `${report.retryAttempts} / ${report.retryComplete}`],
      ["窗口内首轮完成且已有重练完成", `${report.firstWithCompletedRetry} / ${report.firstComplete}`],
      ["v5 失败 / 处理中或待反馈", `${report.failed} / ${report.pending}`],
      ["排除的明确 QA 记录", report.qa], ["旧版或未分类记录", report.unclassified],
    ].map(([label, value]) => <div key={label}><p className="text-sm text-[var(--text-muted)]">{label}</p><p className="text-xl font-semibold">{value}</p></div>)}</div>
    <p className="text-xs text-[var(--text-muted)]">仅统计明确标记 v5 且非 QA 的记录，仍不能排除未标记自测。服务端完成不等于用户看到反馈；账户不是 GA4 访客。窗口末尾的首轮尚未得到同等重练机会，以上配对是即时进展，不能当作次日留存或与 GA4 人数混算。</p>
  </section>;
}
