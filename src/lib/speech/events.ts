// Versioned names need no GA custom-dimension registration for the core reports.
export const SPEECH_ISSUE_CODES = ["quota", "daily_limit", "insufficient_speech", "session", "conflict", "service", "invalid_audio_or_text", "permission_denied", "no_device", "device_busy", "client_or_network", "recording_interrupted", "empty_audio", "invalid_file_size"] as const;
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
  "speech_recording_download", "speech_transcribe_slow", "speech_feedback_slow",
  "speech_compare_improved", "speech_compare_similar", "speech_compare_mixed",
  "speech_compare_insufficient", "speech_replay_allowed", "speech_replay_declined",
] as const;
export type SpeechEvent = typeof SPEECH_EVENTS[number];
export const SPEECH_FUNNELS = [
  { key: "activation", title: "流量 → 首次反馈", steps: [
    ["进入有练习功能的页面", "speech_page_view"],
    ["看到可用练习入口", "speech_entry_view"], ["打开练习", "speech_coach_open"],
    ["开始首次录音或选文件", "speech_first_attempt_start"],
    ["提交转写", "speech_transcribe_start"], ["看到首次反馈", "speech_first_feedback_view"],
  ] },
  { key: "retry", title: "首次反馈 → 重练完成", steps: [
    ["看到首次反馈", "speech_first_feedback_view"], ["点击重练", "speech_retry_start"],
    ["开始第二次尝试", "speech_retry_attempt_start"], ["看到第二次反馈", "speech_retry_feedback_view"],
  ] },
  { key: "intent", title: "反馈 → 付费兴趣（非付款）", steps: [
    ["看到反馈", "speech_feedback_view"], ["看到付费意愿问题", "speech_offer_view"],
    ["明确表示有付费兴趣", "speech_paid_interest_yes"],
  ] },
] as const;
