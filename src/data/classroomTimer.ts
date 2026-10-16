// Classroom timer routines (2026-10-16). A routine is a sequence of timed
// phases; some phases show a random question from the kids / student banks.

export type QuestionSource = "discussion" | "journal" | "brain-break" | "would-you-rather";

export interface TimerPhase {
  label: string;
  seconds: number;
  /** One line telling the class what to do during this phase. */
  instruction: string;
  question?: QuestionSource;
}

export interface TimerRoutine {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  phases: TimerPhase[];
}

export const TIMER_PRESETS = [30, 60, 120, 180, 300, 600, 900, 1200];

export const TIMER_ROUTINES: TimerRoutine[] = [
  { id: "timer", name: "Just a timer", emoji: "⏱️", summary: "One countdown, any length.", phases: [{ label: "Timer", seconds: 300, instruction: "" }] },
  {
    id: "think-pair-share", name: "Think–Pair–Share", emoji: "💬", summary: "1 min think, 2 min with a partner, 1 min share.",
    phases: [
      { label: "Think", seconds: 60, instruction: "Think quietly about your answer. No talking yet.", question: "discussion" },
      { label: "Pair", seconds: 120, instruction: "Turn to your partner. Each person shares; listen without interrupting.", question: "discussion" },
      { label: "Share", seconds: 60, instruction: "A few pairs share with the whole class.", question: "discussion" },
    ],
  },
  {
    id: "discussion", name: "Group discussion", emoji: "🗣️", summary: "2 min small-group talk, 1 min report back.",
    phases: [
      { label: "Discuss", seconds: 120, instruction: "Talk it over in your group. Everyone speaks at least once.", question: "would-you-rather" },
      { label: "Report", seconds: 60, instruction: "One reporter per group shares the group's answer.", question: "would-you-rather" },
    ],
  },
  {
    id: "quick-write", name: "Quick write", emoji: "✏️", summary: "5 minutes of quiet writing on one prompt.",
    phases: [{ label: "Write", seconds: 300, instruction: "Write until the timer ends. Don't stop to erase — keep your pencil moving.", question: "journal" }],
  },
  {
    id: "brain-break", name: "Brain break", emoji: "🤸", summary: "A 1-minute movement break, then back to work.",
    phases: [{ label: "Move", seconds: 60, instruction: "Stand up and follow the activity. Freeze when the timer ends.", question: "brain-break" }],
  },
  {
    id: "clean-up", name: "Clean-up countdown", emoji: "🧹", summary: "2 minutes to tidy up before the bell.",
    phases: [{ label: "Clean up", seconds: 120, instruction: "Put supplies away, push in chairs, check the floor around you." }],
  },
];

export const BRAIN_BREAKS = [
  "Do 10 jumping jacks, then stretch up to the ceiling.",
  "Freeze dance: dance until the teacher says freeze.",
  "Simon says, with only silly moves.",
  "Touch your toes, then your shoulders, then your head — repeat faster.",
  "March in place and count to 30 together.",
  "Balance on one foot for 15 seconds, then switch.",
  "Pretend to swim, fly, then climb a ladder.",
  "Shake out your hands, arms, legs and feet, five times each.",
  "Mirror a partner's slow movements.",
  "Do the robot, then the noodle (stiff, then floppy).",
  "Five deep breaths: smell the flower, blow out the candle.",
  "Pass a silent wave around the room as fast as you can.",
];

export const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;

export const routineLength = (r: TimerRoutine) => r.phases.reduce((n, p) => n + p.seconds, 0);
