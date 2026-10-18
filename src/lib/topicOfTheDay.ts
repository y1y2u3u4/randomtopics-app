// Shared by the server page (past 7 days) and the client card (today).
export const DAY = 86_400_000;
export const TOPIC_OF_THE_DAY_SALT = 41;
/** Days since 1970 for the viewer's local calendar date. */
export const localDay = (d: Date) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
export const topicIndexForDay = (day: number, length: number) => ((day * TOPIC_OF_THE_DAY_SALT) % length + length) % length;
