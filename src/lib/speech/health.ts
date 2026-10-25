// Hourly speech health check (2026-10-25): a dead provider key failed every attempt for days unnoticed.
export const ALERT_WINDOW_MINUTES = 60;
export const ALERT_MIN_FAILED = 5;

export interface SpeechHealth { failed: number; ok: number }

export function speechAlert(health: SpeechHealth): boolean {
  return health.failed >= ALERT_MIN_FAILED && health.ok === 0;
}

export function alertText(health: SpeechHealth, at: Date): string {
  return `[speech-alert] randomtopics.app Speech Coach: ${health.failed} failed, 0 succeeded in the last ${ALERT_WINDOW_MINUTES} min (checked ${at.toISOString()}). Check OPENROUTER_API_KEY and provider status.`;
}
