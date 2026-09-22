// Measurement labels only; never used for authorization, quotas or billing.
export const SPEECH_EXPOSURE_VERSION = "expanded_v1";
export const SPEECH_ENTRY_SOURCES = [
  "speech_hub", "impromptu_speech_generator", "table_topics_generator",
  "speech_account", "unknown",
] as const;
export type SpeechEntrySource = typeof SPEECH_ENTRY_SOURCES[number];
export function speechEntrySource(value: unknown): SpeechEntrySource | undefined {
  return SPEECH_ENTRY_SOURCES.find(source => source === value);
}
