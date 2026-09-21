"use client";
import { useState } from "react";

export default function SitewideReportSync() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function sync() {
    setBusy(true);
    setMessage("正在读取全站历史数据并写入私有表格，请稍候。");
    try {
      const response = await fetch("/api/internal/analytics/sitewide", { method: "POST", headers: { Accept: "application/json" } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "sitewide_sync_failed");
      setMessage(`全站同步完成：GA4 截止 ${result.gaEnd}，GSC 截止 ${result.gscEnd}，${result.tables.length} 个报表。完成时间 ${result.generatedAt}。`);
    } catch (error) {
      const code = error instanceof Error && /^[a-z_]+(?:_\d{3})?$/.test(error.message) ? error.message : "request_failed";
      setMessage(`同步未确认完成（${code}）。请核对私有表格 Report Coverage；未出现新完成记录时勿使用旧快照作为本次结果。`);
    } finally { setBusy(false); }
  }
  return <div className="max-w-xl"><button type="button" className="mode-chip" disabled={busy} onClick={sync}>{busy ? "正在同步全站分析…" : "同步全站分析到私有表格"}</button><p role="status" className="mt-2 text-sm text-[var(--text-secondary)]">{message}</p></div>;
}
