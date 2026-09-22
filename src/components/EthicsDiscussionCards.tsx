import { ETHICS_DISCUSSION_CARDS } from "@/data/ethicsDiscussionCards";
import EthicsCardActions from "./EthicsCardActions";

export default function EthicsDiscussionCards() {
  return <section id="ready-to-discuss" aria-labelledby="ethics-cards-title" className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-24">
    <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Take one into your discussion</p>
    <h2 id="ethics-cards-title" className="mt-2 text-2xl font-bold">3 ready-to-use ethical discussion cards</h2>
    <p className="mt-3 text-sm text-[var(--text-secondary)]">Three cases from the collection below, with two starting positions and follow-up questions. These are not the only choices or an answer key. Consider a third option and let anyone pass.</p>
    <div className="mt-6 space-y-5">{ETHICS_DISCUSSION_CARDS.map(card => <article key={card.id} className="glass-card p-6 sm:p-8">
      <h3 className="text-lg font-bold">{card.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{card.scenario}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{card.options.map((option, i) => <div key={option.choice} className="rounded-xl border border-white/10 p-4">
        <p className="text-xs font-bold text-[var(--neon-cyan)]">Option {i === 0 ? "A" : "B"}</p>
        <h4 className="mt-2 text-sm font-semibold">{option.choice}</h4>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{option.reason}</p>
        <p className="mt-2 text-sm text-[var(--text-muted)]"><strong>Trade-off:</strong> {option.cost}</p>
      </div>)}</div>
      <p className="mt-5 text-sm font-semibold">Keep the discussion going</p>
      <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm text-[var(--text-secondary)]">{card.followUps.map(q => <li key={q}>{q}</li>)}</ol>
      <EthicsCardActions card={card} />
    </article>)}</div>
  </section>;
}
