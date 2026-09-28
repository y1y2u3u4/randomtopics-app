/** Stored speech-operation costs only, not the provider's complete application bill. */
export function summarizeSpeechCosts(rows: readonly { usage: unknown }[]) {
  const groups = (['non_qa', 'qa', 'unclassified'] as const).map(cohort => ({
    cohort, attempts: 0, callsWithUsage: 0, callsWithCost: 0, knownCostUsd: 0,
    promptTokens: 0, completionTokens: 0, reasoningTokens: 0,
  }));
  const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
  const number = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
  for (const row of rows) {
    const usage = object(row.usage), context = object(usage.context);
    const cohort = context.qa === true ? 'qa' : context.version === 'v5' && context.qa === false ? 'non_qa' : 'unclassified';
    const group = groups.find(item => item.cohort === cohort)!;
    group.attempts++;
    const collect = (value: unknown, depth = 0) => {
      const u = object(value);
      if (Array.isArray(u.attempts) && depth < 3) { u.attempts.forEach(attempt => collect(attempt, depth + 1)); return; }
      if (!['cost', 'prompt_tokens', 'completion_tokens'].some(key => key in u)) return;
      group.callsWithUsage++;
      const cost = number(u.cost);
      if (cost !== null) { group.knownCostUsd += cost; group.callsWithCost++; }
      group.promptTokens += number(u.prompt_tokens) ?? 0;
      group.completionTokens += number(u.completion_tokens) ?? 0;
      group.reasoningTokens += number(object(u.completion_tokens_details).reasoning_tokens) ?? 0;
    };
    collect(usage.transcription);
    collect(usage.feedback);
    if (Array.isArray(usage.earlierFeedbackUsage)) usage.earlierFeedbackUsage.forEach(item => collect(item));
  }
  return { scope: 'stored_speech_usage', completeProviderBill: false,
    limitation: 'Failed operations without saved usage are absent; topic costs are not included.', groups };
}
