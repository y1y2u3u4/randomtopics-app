"use client";
import GeneratedResultActions from "./GeneratedResultActions";
import PrintButton from "./PrintButton";
import { ethicsCardText, type EthicsDiscussionCard } from "@/data/ethicsDiscussionCards";

export default function EthicsCardActions({ card }: { card: EthicsDiscussionCard }) {
  const text = ethicsCardText(card);
  return <div className="mt-5 space-y-3">
    <GeneratedResultActions text={text} copyLabel="Copy discussion card" shareTitle={card.title}
      saveTopic={{ id: `ethics-discussion-${card.id}`, text: card.scenario, category: "philosophy", modes: ["debate", "conversation"], depth: "deep", talkingPoints: [text] }}
      toolType="ethics_discussion_card" contentSource="ethical_dilemma_article" actionSurface="ethics_card" isPostGenerate={false} showSavedLink compact />
    <PrintButton heading={card.title} items={[card.scenario, ...card.options.map((option, i) => `Option ${i === 0 ? "A" : "B"}: ${option.choice}. Reason: ${option.reason} Trade-off: ${option.cost}`), ...card.followUps]}
      intro="Discuss both positions, consider another option, and let anyone pass. Fictional discussion exercise, not professional advice." label="Print this discussion card" />
  </div>;
}
