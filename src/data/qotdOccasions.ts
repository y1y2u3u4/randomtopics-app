// 2026-10-27: occasion lists for /question-of-the-day, the sub-categories the
// top-ranking QOTD pages cover and the daily rotation does not.
export const QOTD_OCCASIONS: { id: string; title: string; emoji: string; questions: string[] }[] = [
  { id: "remote", title: "Remote and hybrid teams", emoji: "🏠", questions: [
    "What does your workspace look like today?", "What's one thing you'd miss about working from home?",
    "What's your go-to work-from-home lunch?", "Which app could you not work without?",
    "What's the best background noise for focusing?", "What's one remote-work habit you'd recommend to a new hire?",
  ] },
  { id: "onboarding", title: "New hires and onboarding", emoji: "👋", questions: [
    "What's a skill you bring that isn't on your résumé?", "What was your very first job?",
    "How do you like to receive feedback?", "What's one thing you hope to learn here in your first 90 days?",
    "What's a fun fact your new teammates should know?", "Which time of day are you sharpest?",
  ] },
  { id: "wellbeing", title: "Wellbeing check-ins", emoji: "🌱", questions: [
    "On a scale of 1 to 10, how's your energy today?", "What's one small thing that made you smile this week?",
    "How do you recharge after a long day?", "What's a boundary that helps you work better?",
    "What's one thing you're looking forward to this week?", "What would make tomorrow a little easier?",
  ] },
  { id: "gratitude", title: "Gratitude and recognition", emoji: "🙏", questions: [
    "Who helped you out this week, and how?", "What's a recent win you're proud of?",
    "What's something at work you're thankful for right now?", "Which teammate taught you something recently?",
    "What's a tool or process that saved you time this month?", "What's the best advice a coworker ever gave you?",
  ] },
  { id: "seasonal", title: "Seasonal and holiday", emoji: "🍂", questions: [
    "What's your favorite fall tradition?", "Best Halloween costume you've ever worn?",
    "What dish would you bring to a team Thanksgiving potluck?", "What's one goal you want to hit before the year ends?",
    "Hot cocoa or pumpkin spice latte?", "What's a holiday tradition from your family that others might not know?",
  ] },
  { id: "yes-no", title: "Quick yes-or-no questions", emoji: "✅", questions: [
    "Have you ever met someone famous?", "Do you make your bed every morning?",
    "Have you ever been on TV?", "Can you whistle?",
    "Do you read the last page of a book first?", "Would you go to space if you could?",
  ] },
];
