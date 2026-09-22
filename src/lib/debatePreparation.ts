export const fields = ["My position and reason", "Strongest opposing argument", "Evidence I still need to verify", "My opening statement"];
export function debateDraft(text: string, notes: string[]) {
  return [text, ...fields.flatMap((label, i) => notes[i]?.trim() ? [`${label}:\n${notes[i].trim()}`] : [])].join("\n\n");
}
