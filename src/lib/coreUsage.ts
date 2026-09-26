/** Coarse, browser-local usage signals. No text, identifiers or full URLs. */
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Params = Record<string, unknown>;
const GAP = 30 * 60_000;
const MAX_AGE = 30 * 24 * 60 * 60_000;
export function coreUsageEvents(path: string, event: string, params: Params, local: Store, session: Store, now = Date.now(), qa = false): string[] {
  const action = ["copy_result", "save_result", "share_result", "copy_error", "save_error", "share_error"].includes(event);
  if (path === "/spin-the-wheel" && params.action_surface === "spin_result" && action) return [`post_spin_${event.replace("_result", "")}`];
  if (path === "/debate" && params.action_surface === "debate_preparation" && action) return [`debate_prep_${event.replace("_result", "")}`];
  if (path === "/debate/motions" && params.action_surface === "debate_motion_preparation" && action) return [`motion_prep_${event.replace("_result", "")}`];
  const handoffEvents = (["/speech", "/es/speech"].includes(path) && ["handoff_home", "handoff_wheel", "handoff_es_article"].includes(String(params.content_source)) && (action || ["timer_first_start", "timer_complete", "timer_restart"].includes(event))) ? [`${params.content_source}_${event.replace("_result", "")}`] : [];
  if (path === "/topics/ethical-dilemma-questions" && params.action_surface === "ethics_card" && ["copy_result", "save_result", "share_result", "copy_error", "save_error", "share_error"].includes(event)) return [`ethics_card_${event.replace("_result", "")}`];
  const flow = path === "/question-of-the-day" ? "qotd" : path === "/speech" ? "speech" :
    ["/es/topics/most-likely-to-questions", "/es/most-likely-to"].includes(path) ? "party" : null;
  if (!flow) return handoffEvents;
  const out: string[] = [...handoffEvents];
  const prefix = `rt-core-${qa ? "qa-" : ""}${flow}-`;
  const number = (store: Store, key: string) => {
    const value = Number(store.getItem(prefix + key));
    return Number.isFinite(value) && value > 0 && value <= now ? value : 0;
  };
  const source = params.action_surface;
  if (flow === "qotd" && ["qotd_daily", "qotd_random", "qotd_list"].includes(String(source))) {
    if (["copy_result", "save_result", "share_result", "copy_error", "save_error", "share_error"].includes(event))
      out.push(`${source}_${event.replace("_result", "")}`);
  }
  if (flow === "party" && source === "party_round_collection" && ["copy_result", "save_result", "share_result", "copy_error", "save_error", "share_error"].includes(event))
    out.push(`party_round_${event.replace("_result", "")}`);
  // Storage failure must not suppress the source-specific success/error events.
  try {
    const seen = number(local, "seen"), used = number(local, "used");
    if (event === "page_view") {
      out.push(`${flow}_usage_visit`);
      if (used && now - used <= MAX_AGE && seen && now - seen >= GAP) out.push(`${flow}_return_after_use`);
      if (flow === "party") {
        const pending = number(session, "unfinished");
        if (pending && now - pending <= MAX_AGE && path.includes("/topics/")) out.push("party_revisit_unfinished");
      }
    }
    local.setItem(prefix + "seen", String(now));
    if (used && now - used > MAX_AGE) local.removeItem(prefix + "used");
    const action = ["copy_result", "save_result", "share_result"].includes(event);
    if (action || (flow === "speech" && ["timer_complete", "speech_feedback_view"].includes(event)) ||
      (flow === "party" && event === "party_round_complete")) local.setItem(prefix + "used", String(now));
    if (flow === "speech") {
      if (event === "timer_complete") session.setItem(prefix + "completed", String(now));
      if (event === "speech_feedback_v5_request") {
        const completed = number(session, "completed");
        if (completed && now - completed <= GAP) {
          out.push("speech_after_timer_feedback_request");
          session.removeItem(prefix + "completed");
        }
      }
    }
    if (flow === "party" && params.content_source === "es_most_likely_article") {
      if (event === "generate_success") session.setItem(prefix + "unfinished", String(now));
      if (event === "party_round_complete") session.removeItem(prefix + "unfinished");
      if (event === "party_article_to_tool" && number(session, "unfinished")) out.push("party_tool_entry_with_unfinished");
    }
  } catch { /* Blocked storage: no return inference; primary actions still work. */ }
  return out;
}
