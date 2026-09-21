// Versioned names need no GA custom-dimension registration for the core reports.
export const SPEECH_ISSUE_CODES = ["quota", "daily_limit", "insufficient_speech", "session", "conflict", "service", "invalid_audio_or_text", "permission_denied", "no_device", "device_busy", "client_or_network", "recording_interrupted", "empty_audio", "invalid_file_size"] as const;
export const SPEECH_ENTRY_EVENTS = [
  "speech_entry_v3_page", "speech_entry_v3_view", "speech_entry_v3_click", "speech_entry_v3_error",
  "speech_coach_v3_open", "speech_example_open", "speech_example_practice",
] as const;
export const SPEECH_EVENTS = [
  ...SPEECH_ISSUE_CODES.map((code) => `speech_issue_${code}` as const),
  "speech_page_view", "speech_entry_view", "speech_coach_open", "speech_coach_return",
  "speech_first_attempt_start", "speech_retry_attempt_start",
  "speech_record_request", "speech_record_start", "speech_record_complete",
  "speech_record_error", "speech_audio_selected", "speech_audio_ready",
  "speech_transcribe_start", "speech_transcript_ready", "speech_transcribe_error",
  "speech_feedback_start", "speech_feedback_ready", "speech_feedback_view", "speech_feedback_error",
  "speech_first_feedback_view", "speech_retry_feedback_view",
  "speech_feedback_yes", "speech_feedback_no", "speech_retry_start",
  "speech_comparison_view", "speech_offer_view", "speech_paid_interest_yes",
  "speech_paid_interest_no", "speech_paid_interest_unsure", "speech_quota_hit",
  "speech_history_view", "speech_history_open", "speech_history_resume",
  "speech_history_feedback_start", "speech_history_feedback_ready", "speech_history_feedback_error", "speech_history_feedback_view",
  "speech_recording_download", "speech_transcribe_slow", "speech_feedback_slow",
  "speech_compare_improved", "speech_compare_similar", "speech_compare_mixed",
  "speech_compare_insufficient", "speech_replay_allowed", "speech_replay_declined",
  "speech_checkout_offer_view", "speech_checkout_start", "speech_checkout_redirect",
  "speech_checkout_error", "speech_portal_start", "speech_portal_redirect", "speech_portal_error",
  "speech_email_link_start", "speech_email_link_sent", "speech_email_link_error", "speech_email_verified",
  "speech_recovery_start", "speech_recovery_sent", "speech_recovery_error", "speech_payment_confirmed",
  ...SPEECH_ENTRY_EVENTS,
] as const;
export type SpeechEvent = typeof SPEECH_EVENTS[number];
export const SPEECH_FUNNELS = [
  { key: "entry_v3", title: "新入口 · 有效曝光 → 首次反馈", steps: [
    ["进入新版页面", "speech_entry_v3_page"], ["按钮可见一秒", "speech_entry_v3_view"],
    ["点击免费练习", "speech_entry_v3_click"], ["打开练习面板", "speech_coach_v3_open"],
    ["开始录音或选文件", "speech_first_attempt_start"], ["看到首次反馈", "speech_first_feedback_view"],
  ] },
  { key: "example_v3", title: "新入口 · 示例 → 实际尝试", steps: [
    ["进入新版页面", "speech_entry_v3_page"], ["查看反馈示例", "speech_example_open"],
    ["从示例开始练习", "speech_example_practice"], ["开始录音或选文件", "speech_first_attempt_start"],
    ["看到首次反馈", "speech_first_feedback_view"],
  ] },
  { key: "activation", title: "旧入口曝光口径 · 历史参考", steps: [
    ["进入有练习功能的页面", "speech_page_view"],
    ["看到可用练习入口", "speech_entry_view"], ["打开练习", "speech_coach_open"],
    ["开始首次录音或选文件", "speech_first_attempt_start"],
    ["提交转写", "speech_transcribe_start"], ["看到首次反馈", "speech_first_feedback_view"],
  ] },
  { key: "retry", title: "首次反馈 → 重练完成", steps: [
    ["看到首次反馈", "speech_first_feedback_view"], ["点击重练", "speech_retry_start"],
    ["开始第二次尝试", "speech_retry_attempt_start"], ["看到第二次反馈", "speech_retry_feedback_view"],
  ] },
  { key: "history_recovery", title: "历史恢复 → 看到反馈", steps: [
    ["请求恢复历史反馈", "speech_history_feedback_start"], ["历史反馈生成完成", "speech_history_feedback_ready"],
    ["在历史中看到反馈", "speech_history_feedback_view"],
  ] },
  { key: "intent", title: "反馈 → 付费兴趣（非付款）", steps: [
    ["看到反馈", "speech_feedback_view"], ["看到付费意愿问题", "speech_offer_view"],
    ["明确表示有付费兴趣", "speech_paid_interest_yes"],
  ] },
  { key: "checkout", title: "$12 套餐 → 前往收银台（非付款）", steps: [
    ["看到每月 $12 套餐", "speech_checkout_offer_view"],
    ["点击订阅", "speech_checkout_start"],
    ["取得收银台链接并跳转", "speech_checkout_redirect"],
  ] },
  { key: "email", title: "关联邮箱 → 验证完成", steps: [
    ["开始关联邮箱", "speech_email_link_start"], ["验证邮件已发出", "speech_email_link_sent"],
    ["账号已验证", "speech_email_verified"],
  ] },
  { key: "purchase", title: "访问 → 练习 → 实付确认", steps: [
    ["进入练习页面", "speech_page_view"], ["打开练习", "speech_coach_open"],
    ["看到首次反馈", "speech_first_feedback_view"], ["看到每月 $12 套餐", "speech_checkout_offer_view"],
    ["点击订阅", "speech_checkout_start"], ["前往收银台", "speech_checkout_redirect"],
    ["返回网站且 Stripe 确认已付款", "speech_payment_confirmed"],
  ] },
] as const;
