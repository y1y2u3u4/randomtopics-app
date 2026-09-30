import { getSpeechServerReport } from "@/lib/speech/serverReport";

export default async function SpeechServerAnalytics() {
  let report;
  try { report = await getSpeechServerReport(); } catch {
    return <section className="glass-card p-5"><h2 className="text-xl font-semibold">练习服务端核对 · 过去24小时</h2><p className="mt-2">数据库统计暂不可用，不表示没有提交。</p></section>;
  }
  const sourceLabels: Record<string, string> = {
    speech_hub: "演讲话题页", impromptu_speech_generator: "即兴演讲页",
    table_topics_generator: "Table Topics 页", handoff_home: "首页所选题目", handoff_wheel: "转盘所选题目", speech_account: "历史练习", unknown: "来源未知",
  };
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
    <details open><summary className="font-semibold">本次入口更新 · 按提交来源核对</summary>
      <p className="my-2 text-xs text-[var(--text-muted)]">仅含 expanded_v1 且明确非 QA 的新提交。旧客户端不补标；下表是保存结果，不是页面曝光、GA 人数或付款转化。</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>来源</th><th>首练提交</th><th>首练反馈保存</th><th>重练反馈保存</th><th>待反馈 / 失败</th></tr></thead>
        <tbody>{report.expandedExposure.sources.map(row => <tr key={row.source} className="border-t border-white/10"><td className="py-2">{sourceLabels[row.source] ?? row.source}</td><td>{row.firstAttempts}</td><td>{row.firstComplete}</td><td>{row.retryComplete}</td><td>{row.pending} / {row.failed}</td></tr>)}</tbody>
      </table></div>
    </details>
    <details open><summary className="font-semibold">练习用途 · 服务端保存结果</summary>
      <p className="my-2 text-xs text-[var(--text-muted)]">仅统计明确非 QA 记录。用途可跳过；发布前未采集与发布后未选择分开。账号可以跨用途，不能把各行账号数相加；完成不等于用户看见或认可。</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>用途</th><th>账号</th><th>首练提交 / 完成</th><th>重练完成</th></tr></thead>
        <tbody>{report.purposes.map(row => <tr key={row.purpose} className="border-t border-white/10"><td className="py-2">{{ once: "准备一次发言", habit: "持续训练", explore: "体验看看", unspecified: "未选择用途", unrecorded: "未采集用途" }[row.purpose] ?? row.purpose}</td><td>{row.accounts}</td><td>{row.firstAttempts} / {row.firstComplete}</td><td>{row.retryComplete}</td></tr>)}</tbody>
      </table></div>
    </details>
    <details open><summary className="font-semibold">已记录的语音模型费用 · 美元</summary>
      <p className="my-2 text-xs text-[var(--text-muted)]">仅为此窗口练习记录保存的转写和反馈用量，包含已保存的重试。失败但未保存用量的请求不在内；不是 OpenRouter 完整账单，也不包含历史取题费用。</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>记录类型</th><th>已知费用</th><th>含费用的调用 / 含用量的调用</th></tr></thead>
        <tbody>{report.costs.groups.map(row => <tr key={row.cohort} className="border-t border-white/10"><td className="py-2">{{ non_qa: "明确非 QA", qa: "明确 QA", unclassified: "旧版或未分类" }[row.cohort]}</td><td>{row.callsWithCost ? `$${row.knownCostUsd.toFixed(4)}` : "未收到费用记录"}</td><td>{row.callsWithCost} / {row.callsWithUsage}</td></tr>)}</tbody>
      </table></div>
    </details>
    <p className="text-xs text-[var(--text-muted)]">仅统计明确标记 v5 且非 QA 的记录，仍不能排除未标记自测。服务端完成不等于用户看到反馈；账户不是 GA4 访客。窗口末尾的首轮尚未得到同等重练机会，以上配对是即时进展，不能当作次日留存或与 GA4 人数混算。</p>
  </section>;
}
