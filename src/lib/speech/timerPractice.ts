import type { Topic } from "@/data/types";

// Page-local connection between an existing coach and timers on the same page.
// Register only in client effects; nothing is stored, sent or added to a URL.
export type TimerCoach = { topic?: Topic; available: boolean; open: (topic: Topic) => boolean };
const coaches = new Map<string, TimerCoach>();
const listeners = new Set<() => void>();
export const subscribeTimerCoach = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const getTimerCoach = (source: string) => coaches.get(source);
export const noServerTimerCoach = () => undefined;
export function registerTimerCoach(source: string, coach: TimerCoach) {
  coaches.set(source, coach);
  listeners.forEach(listener => listener());
  return () => {
    if (coaches.get(source) !== coach) return;
    coaches.delete(source);
    listeners.forEach(listener => listener());
  };
}
