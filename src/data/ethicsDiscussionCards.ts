export const ETHICS_DISCUSSION_CARDS = [
  {
    id: "credit", title: "Who gets credit?",
    scenario: "A coworker takes credit for your idea in a meeting. Correcting them publicly would embarrass them and create workplace tension. How do you handle it?",
    options: [
      { choice: "Correct the record in the meeting", reason: "Accurate attribution protects your work and lets the team judge the idea fairly.", cost: "A public correction may damage trust before you know whether it was deliberate." },
      { choice: "Speak privately first", reason: "A private conversation gives your coworker a chance to explain and repair the mistake.", cost: "The team may keep the wrong impression, and a repeated pattern could go unchallenged." },
    ],
    followUps: ["What would change if this had happened three times before?", "How could you correct the record while giving the coworker room to respond?"],
  },
  {
    id: "promise", title: "A promise or an urgent request?",
    scenario: "You promised your child you would attend their school play, but your boss asks you to stay for an emergency meeting that could affect your entire team's jobs. What do you choose?",
    options: [
      { choice: "Keep the promise and attend the play", reason: "Showing up protects a commitment to someone who depends on you.", cost: "Your absence may leave colleagues without information they need during a serious problem." },
      { choice: "Stay for the emergency meeting", reason: "Your contribution could help protect the livelihoods of several people.", cost: "Breaking an important promise can weaken your child's trust, even with an explanation." },
    ],
    followUps: ["What evidence would you need that your presence is actually essential?", "Could delegation or joining briefly preserve both responsibilities, and what would still be lost?"],
  },
  {
    id: "layoff", title: "Performance or personal impact?",
    scenario: "Your company asks you to lay off a team member. One person is a single parent who desperately needs the job but has lower performance. The other is single with savings but is a top performer. Who do you let go?",
    options: [
      { choice: "Use consistent, job-related performance criteria", reason: "A transparent standard can protect fairness to the team and the work that must continue.", cost: "The decision may cause the greatest hardship to the person with the least financial protection." },
      { choice: "Give more weight to the immediate hardship", reason: "Considering the consequences for dependents can reduce the most severe harm.", cost: "Using personal circumstances can be intrusive and unfair to someone whose needs are less visible." },
    ],
    followUps: ["What alternatives to either layoff should be investigated first?", "What information can be used fairly, and what support should be available to anyone affected?"],
  },
] as const;
export type EthicsDiscussionCard = typeof ETHICS_DISCUSSION_CARDS[number];
export function ethicsCardText(card: EthicsDiscussionCard) {
  return [card.title, card.scenario, ...card.options.map((option, i) => `Option ${i === 0 ? "A" : "B"}: ${option.choice}\nReason: ${option.reason}\nTrade-off: ${option.cost}`), "Discuss:", ...card.followUps.map((q, i) => `${i + 1}. ${q}`), "These are starting positions, not the only choices or a correct-answer key. Anyone may pass."].join("\n\n");
}
