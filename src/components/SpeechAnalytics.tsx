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
  const breakdownEvents = ["speech_entry_v5_view", "speech_entry_v5_click", "speech_start_v2_view", "speech_start_v2_begin", "speech_first_feedback_v5_view", "speech_retry_feedback_v5_view", "speech_checkout_redirect", "speech_payment_confirmed"];
  const labels = ["v5 入口有效曝光", "练习点击", "首练新按钮曝光", "首练新说明后开始", "首次反馈人数", "重练反馈人数", "结账跳转人数", "网站收到实付确认人数"];
  const hours = [...new Set(report.hourly.rows.filter(row => row.event.includes("_v5_")).map(row => row.hour))];
  const curveEvents = ["speech_entry_v5_page", "speech_entry_v5_view", "speech_entry_v5_click"];
  const exposureColumns = [
    ["导航可见", "speech_nav_view"], ["导航点击", "speech_nav_click"],
    ["本次入口更新可见", "speech_entry_expanded_view"], ["本次入口更新点击", "speech_entry_expanded_click"],
    ["首份反馈可见", "speech_first_feedback_v5_view"], ["精简价格可见", "speech_plan_hint_view"],
    ["完整套餐可见", "speech_plan_view"],
  ];
  const exposurePages = [...new Set(report.pages.rows.filter(row => exposureColumns.some(([, event]) => row.event === event)).map(row => row.page))];
  const clarity = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  return <section id="speech-analytics" className="space-y-5">
    {process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED !== "true" && <p role="status" className="rounded-xl border border-amber-300/30 p-4 text-sm text-amber-100">正式练习入口尚未开放。统计已部署，但目前不能用练习漏斗的零值判断用户是否愿意练习或付费。</p>}
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-2xl font-bold">演讲练习 · 从流量到价值</h2><p className="mt-2 text-sm text-[var(--text-muted)]">{report.days === 0 ? "今日截至目前，数据仍在处理" : `最近 ${report.days} 个完整日`}（GA4 属性时区）· 仅正式域名 · 基础事件 v2 / 当前入口和反馈 v5</p></div>
      <div className="flex gap-3"><Link className="underline" href="?speech_days=0#speech-analytics">今日</Link><Link className="underline" href="?speech_days=1#speech-analytics">昨日</Link><Link className="underline" href="?speech_days=7#speech-analytics">7 天</Link><Link className="underline" href="?speech_days=28#speech-analytics">28 天</Link>
        {clarity && <a className="underline" href={`https://clarity.microsoft.com/projects/view/${clarity}/recordings`} target="_blank" rel="noreferrer">Clarity 回放</a>}</div>
    </div>
    <p className="text-sm text-[var(--text-secondary)]">本次入口更新另外记录 expanded 入口事件，首练与重练反馈沿用 v5。旧版 v3/v4 兼容事件仍会记录，不能当作独立对照组。反馈可见要求标题至少50%可见、前台连续一秒，不代表已阅读或满意。有效曝光要求可用按钮至少 50% 可见、前台连续一秒。快速点击不会补记曝光；点击独立计数，旧版曝光率不可直接比较。QA 使用独立事件名称，不进入下方漏斗。</p>
    <p className="text-sm text-[var(--text-secondary)]">有序漏斗按 GA4 用户去重，必须按顺序完成，每相邻步骤不超过 24 小时。可跨会话，不保证是同一条录音；清除 Cookie、换设备及拦截统计会影响识别。数据未成熟时先看人数。</p>
    <p className="text-sm text-[var(--text-secondary)]">曝光到点击单独从有效曝光开始计算；完整入口漏斗还要求同一用户在窗口内先触达页面。完整漏斗为 0 不代表所有曝光后都无人点击，两种分母不能互换。完整套餐卡与精简价格提示分别统计，不可相加当作唯一人数。账号页套餐 v2 曝光统一为前台至少 50% 可见、连续一秒；旧版账号套餐曝光定义不同，不直接比较。</p>
    <details className="glass-card p-5" open><summary className="font-semibold">入口曝光效果 · 按事件所在页面拆解</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">按实际出现入口或反馈的页面分组，区别于会话落地页。各列为独立去重人数，不能相除当作有序转化；首次反馈列可能包含旧客户端，判断新版使用有序入口漏斗及服务端版本核对。精简价格提示从本次发布开始计曝光，不能补回历史。</p>
      {!report.pages.available ? <p className="mt-3">页面拆解暂不可用。</p> : !exposurePages.length ? <p className="mt-3">所选窗口尚未收到相应事件，需考虑 GA4 延迟与统计拦截。</p> : <div className="overflow-x-auto"><table className="mt-4 w-full min-w-[800px] text-left text-sm"><thead><tr><th>页面</th>{exposureColumns.map(([label]) => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>{exposurePages.map(page => <tr key={page} className="border-t border-white/10"><td className="py-2">{page}</td>{exposureColumns.map(([, event]) => <td key={event}>{number.format(report.pages.rows.find(row => row.page === page && row.event === event)?.users ?? 0)}</td>)}</tr>)}</tbody>
      </table></div>}
    </details>
    <details className="glass-card p-5" open><summary className="font-semibold">完整链路 · 埋点与接收状态</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">下列环节均已接入埋点。0 表示所选窗口尚未收到事件，不能据此判断功能未接入或用户没有需求；统计延迟、隐私阈值和拦截可能影响结果。新增事件仅从本次发布起记录，不能补回历史。次数不是去重用户数，也不能直接相除当有序转化率。</p>
      <div className="overflow-x-auto"><table className="mt-4 w-full text-left text-sm"><thead><tr><th>行为</th><th>事件次数</th><th>窗口接收状态</th></tr></thead>
        <tbody>{report.coverage.map(row => <tr key={row.event} className="border-t border-white/10"><td className="py-2">{row.label}</td><td>{row.count === null ? "—" : number.format(row.count)}</td><td>{row.status === "received" ? "已收到" : row.status === "unavailable" ? "数据暂不可用" : "本窗口未收到"}</td></tr>)}</tbody>
      </table></div>
    </details>
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
      ["v5 入口练习点击", String(count("speech_entry_v5_click")), "含未满一秒的快速点击；不是有效曝光的简单比率"],
      ["查看示例", String(count("speech_example_open")), "首次展开示例，表示兴趣，不表示已练习"],
      ["从示例开始练习", String(count("speech_example_practice")), "区分想先看结果与愿意尝试"],
      ["反馈有用率", rate(yes, yes + no), `${yes} 次有用 / ${yes + no} 次明确评价；不是全部使用者满意度`],
      ["转写失败", String(count("speech_transcribe_error")), `${count("speech_transcribe_start")} 次提交；重试也计一次请求`],
      ["反馈失败", String(count("speech_feedback_error")), `${count("speech_feedback_start")} 次请求；历史恢复请求单独记录`],
      ["历史恢复失败", String(count("speech_history_feedback_error")), `${count("speech_history_feedback_start")} 次恢复请求 / ${count("speech_history_feedback_ready")} 次完成`],
      ["历史反馈可见", String(count("speech_history_feedback_view")), "反馈建议在前台至少 50% 可见、连续一秒；包含查看已有结果，不混入首次反馈"],
      ["额度触达", String(count("speech_quota_hit")), "次数；不会自动算成付费意愿"],
      ["历史问卷：愿意", String(count("speech_paid_interest_yes")), "未展示价格的自报兴趣，非付费转化"],
      ["历史问卷：不确定", String(count("speech_paid_interest_unsure")), "需要更多价值证明"],
      ["历史问卷：只想免费", String(count("speech_paid_interest_no")), "与未回答用户分开"],
      ["超过 15 秒的请求", `${count("speech_transcribe_slow")} / ${count("speech_feedback_slow")}`, "转写 / 反馈成功请求中的慢请求"],
      ["精简价格提示可见", String(count("speech_plan_hint_view")), "前台至少 50% 可见、连续一秒；与完整套餐卡分开"],
      ["精简价格提示点击", String(count("speech_plan_hint_click")), "快速点击也会记录，不补造曝光"],
      ["账号套餐有效可见", String(count("speech_checkout_offer_v2_view")), "新版口径：前台至少 50% 可见、连续一秒"],
      ["反馈后方案可见", String(count("speech_plan_view")), "展示 $12/月价格；前台至少 50% 可见、连续一秒"],
      ["反馈后查看方案", String(count("speech_plan_click")), "明确展示价格后的点击，不是已付款"],
      ["订阅需要邮箱确认", String(count("speech_checkout_email_required")), "订阅点击后的验证步骤；与订阅点击可能是同一个人"],
      ["验证后付款按钮可见", String(count("speech_checkout_resume_view")), "已恢复选中套餐并展示可用付款按钮"],
      ["继续安全结账", String(count("speech_checkout_continue")), "已验证邮箱后明确点击继续；不是付款成功"],
      ["收银台跳转", String(count("speech_checkout_redirect")), "取得 Stripe 链接并发起跳转，不代表付款成功"],
      ["发起订阅失败", String(count("speech_checkout_error")), "创建或跳转收银台失败，可在失败原因中排查"],
    ].map(([label, value, note]) => <article key={label} className="glass-card p-4"><h3 className="text-sm">{label}</h3><p className="my-2 text-2xl font-bold">{value}</p><p className="text-xs text-[var(--text-muted)]">{note}</p></article>)}</div>
    <details className="glass-card p-5" open><summary className="font-semibold">v5 入口生产曲线 · 每小时独立用户数</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">时区：{report.hourly.timeZone}。小时人数不能相加当作每日去重用户，也不能直接相除当作有序转化率。发布所在小时可能只有部分时间。</p>
      {!report.hourly.available ? <p className="mt-3">小时数据暂不可用。</p> : !hours.length ? <p className="mt-3">尚未收到新版非 QA 事件；不代表没有需求。</p> : <div className="overflow-x-auto"><table className="mt-4 w-full min-w-[620px] text-left text-sm">
        <thead><tr>{["小时", "新版页面", "有效曝光", "练习点击"].map(label => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>{hours.map(hour => <tr key={hour} className="border-t border-white/10"><td className="py-3">{hour.slice(0, 4)}-{hour.slice(4, 6)}-{hour.slice(6, 8)} {hour.slice(8)}:00</td>
          {curveEvents.map(event => <td key={event}>{number.format(report.hourly.rows.find(row => row.hour === hour && row.event === event)?.users ?? 0)}</td>)}
        </tr>)}</tbody>
      </table></div>}
    </details>
    {["device", "source", "landing"].map((kind) => {
      const rows = kind === "device" ? report.devices.map((r) => ({ ...r, key: r.device })) : kind === "source" ? report.sources.map((r) => ({ ...r, key: r.source })) : report.landings.map((r) => ({ ...r, key: r.landing }));
      const keys = [...new Set(rows.map((r) => r.key))];
      return <details key={kind} className="glass-card p-5" open={kind === "device"}><summary className="cursor-pointer font-semibold">{kind === "device" ? "设备" : kind === "source" ? "会话来源 / 媒介" : "会话落地页"}拆解 · 各事件独立人数</summary>
        <div className="overflow-x-auto"><table className="mt-4 w-full min-w-[620px] text-left text-sm"><thead><tr><th>分组</th>{labels.map((label) => <th key={label}>{label}</th>)}</tr></thead><tbody>{keys.map((key) => <tr key={key} className="border-t border-white/10"><td className="py-3">{key}</td>{breakdownEvents.map((event) => <td key={event}>{number.format(rows.find((r) => r.key === key && r.event === event)?.users ?? 0)}</td>)}</tr>)}</tbody></table></div>
        {!keys.length && <p className="mt-3 text-sm">暂无正式流量数据。</p>}
      </details>;
    })}
    <details className="glass-card p-5" open><summary className="font-semibold">首次开始前 · 场景与疑问</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">首练新说明事件从发布起记录。开始包含点击录音或选择文件，不代表麦克风已授权、文件有效或已经提交。快速开始不会补造按钮曝光；设备表是独立人数，不能相除替代有序漏斗。原因仅来自主动回答，未回答保持未知；回答后仍能练习。</p>
      <ul className="mt-3 space-y-2 text-sm">{[
        ["speech_start_v2_view", "首练开始按钮有效曝光"], ["speech_start_v2_begin", "开始首次尝试"],
        ["speech_start_reason_view", "可选原因问题曝光"], ["speech_start_reason_select", "主动回答原因"],
        ["speech_start_reason_busy", "现在不方便说话"], ["speech_start_reason_unsure", "不知道说什么"],
        ["speech_start_reason_privacy", "担心音频隐私"], ["speech_start_reason_exploring", "只是了解功能"],
      ].map(([event, label]) => <li key={event}>{label}：{count(event)} 次</li>)}</ul>
    </details>
    <details className="glass-card p-5" open><summary className="font-semibold">付费前的选择 · 新套餐说明</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">卡片曝光与可点击按钮曝光分开。新版事件从发布后开始；点击不补造曝光。下面均为独立事件次数，不能相加当人数。可选原因不是离开页面的推断，未回答保持未知。</p>
      <ul className="mt-3 space-y-2 text-sm">{[
        ["speech_plan_v2_view", "套餐卡曝光"], ["speech_plan_v2_action_view", "套餐按钮曝光"], ["speech_plan_v2_click", "套餐按钮点击"],
        ["speech_plan_hint_action_view", "精简价格链接曝光"], ["speech_quota_plan_view", "额度套餐链接曝光"], ["speech_quota_plan_click", "额度套餐链接点击"],
        ["speech_plan_reason_view", "原因问题曝光"], ["speech_plan_reason_select", "主动回答原因"],
        ["speech_plan_reason_once", "只需要这次练习"], ["speech_plan_reason_value", "还需要看到更多帮助"],
        ["speech_plan_reason_subscription", "不想订阅"], ["speech_plan_reason_price", "价格不合适"], ["speech_plan_reason_later", "可能稍后练习"],
      ].map(([event, label]) => <li key={event}>{label}：{count(event)} 次</li>)}</ul>
    </details>
    <details className="glass-card p-5" open><summary className="font-semibold">用户主动选择的原因 · 非离开页面推断</summary>
      <p className="mt-2 text-xs text-[var(--text-muted)]">可选回答；未作答不代表满意、不满意或已完成目的。每项独立计数。</p>
      <ul className="mt-3 space-y-2 text-sm">{[
        ["inaccurate", "建议误读了回答"], ["hard_to_apply", "不知道如何应用"], ["transcription", "转写不准确"],
        ["task_complete", "已经得到需要的结果"], ["later", "打算稍后练习"], ["too_much_work", "操作步骤太多"],
      ].map(([key, label]) => <li key={key}>{label}：{count(`speech_reason_${key}`)} 次</li>)}</ul>
    </details>
    <details className="glass-card p-5"><summary className="cursor-pointer">全部练习事件 · 用于核对接收</summary><div className="overflow-x-auto"><table className="mt-3 w-full text-left text-sm"><thead><tr><th>事件</th><th>次数</th><th>用户</th></tr></thead><tbody>{report.events.map((r) => <tr key={r.eventName}><td className="py-1">{r.eventName}</td><td>{r.eventCount}</td><td>{r.totalUsers}</td></tr>)}</tbody></table></div></details>
    <details className="glass-card p-5"><summary className="cursor-pointer">失败原因 · 权限、设备、静音、额度、服务</summary><ul className="mt-3 space-y-2 text-sm">{report.events.filter((r) => r.eventName.startsWith("speech_issue_")).map((r) => <li key={r.eventName}>{r.eventName.replace("speech_issue_", "")}：{r.eventCount} 次 / {r.totalUsers} 人</li>)}</ul></details>
    <p className="text-xs text-[var(--text-muted)]">回放仅覆盖已同意的成人演讲页访客。网站实付事件要求同一浏览器曾发起结账、返回后经服务端向 Stripe 核实已付 USD 12，并按订单去重；未返回、跨设备或拦截统计会缺失。因此需同时看 Stripe 实付核对，不把兴趣问卷或跳转当付款，不把分组独立人数直接相除当有序漏斗。</p>
  </section>;
}
