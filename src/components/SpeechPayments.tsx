import { checkoutConversionReport } from "@/lib/speech/purchases";
export default async function SpeechPayments() {
  const report = await checkoutConversionReport(1).catch(() => null);
  if (!report?.available) return <section className="glass-card p-5"><h2 className="text-xl font-bold">Stripe 实付核对</h2><p className="mt-3">支付报表尚不可用，不能据此判断没有成交。</p></section>;
  return <section className="glass-card space-y-4 p-5">
    <h2 className="text-xl font-bold">Stripe 实付核对 · {report.live ? "正式账户" : "测试账户"}</h2>
    <p className="text-sm">过去 24 小时创建的结账，以当前付款状态核对；包括付款后未返回网站的客户。不是按到账时间统计的收入报表。</p>
    <div className="grid gap-3 sm:grid-cols-4">{[
      ["创建结账", report.checkouts], ["已付款结账", report.paid],
      ["付款账号", report.paidCustomers], ["首次付款账号", report.complete ? report.firstPaidCustomers : "未知"],
      ["再次订阅结账", report.complete ? report.repeatPaidCheckouts : "未知"], ["未完成", report.open],
      ["已过期", report.expired], ["结账完成但未付", report.unpaidComplete],
    ].map(([name, value]) => <div key={name}><p className="text-sm">{name}</p><strong className="text-2xl">{value}</strong></div>)}</div>
    {!report.complete && <p className="text-amber-200">历史读取达到上限，首次/再次付款及完整性不能确认。</p>}
    <p className="text-xs text-[var(--text-muted)]">这里只统计 USD 12 正金额订阅结账，续费不创建新结账，退款和净收入不包含在此表。此队列与 GA4 用户口径不同，不直接相除。窗口：{report.start} 至 {report.generatedAt}。</p>
  </section>;
}
