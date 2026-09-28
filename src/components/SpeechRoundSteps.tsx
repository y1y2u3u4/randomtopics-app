export default function SpeechRoundSteps({ step }: { step: number }) {
  return <ol aria-label="Your practice round" className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
    {["Give your answer", "See one suggestion", "Try it once", "Compare answers"].map((label, index) =>
      <li key={label} aria-current={step === index + 1 ? "step" : undefined}
        className={`rounded-lg border p-2 ${step === index + 1 ? "border-[var(--neon-cyan)]/50 bg-[var(--neon-cyan)]/10" : "border-white/10 text-[var(--text-muted)]"}`}>
        <span className="mr-1 font-semibold">{index + 1}.</span>{label}
      </li>)}
  </ol>;
}
