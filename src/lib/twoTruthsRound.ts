/** Draw statement ideas, not biographical facts or automatically assigned truths. */
export function drawStatementIdeas(pool: readonly string[], used: ReadonlySet<string>, random = Math.random) {
  const unique = [...new Set(pool)];
  if (unique.length < 3) return null;
  const nextUsed = new Set(used);
  const statements: string[] = [];
  while (statements.length < 3) {
    let available = unique.filter((item) => !nextUsed.has(item) && !statements.includes(item));
    if (!available.length) {
      for (const item of unique) nextUsed.delete(item);
      for (const item of statements) nextUsed.add(item);
      available = unique.filter((item) => !statements.includes(item));
    }
    const next = available[Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)))];
    statements.push(next);
    nextUsed.add(next);
  }
  return { statements, used: nextUsed };
}

export function isCompleteRound(statements: readonly string[]) {
  const cleaned = statements.map((text) => text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim());
  return cleaned.length === 3 && cleaned.every(Boolean) && new Set(cleaned).size === 3;
}

/** Never include the selected lie in a player-facing copy or share payload. */
export function formatPlayerRound(statements: readonly string[]) {
  return `Two truths and a lie — which statement is false?\n${statements.map((text, index) => `${index + 1}. ${text.trim()}`).join("\n")}`;
}
