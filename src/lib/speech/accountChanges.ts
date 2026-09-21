import type { SupabaseClient } from "@supabase/supabase-js";

// Never request another auth operation while Supabase is dispatching auth events.
// A deferred refresh also coalesces focus, visibility and auth notifications.
export function watchSpeechAccount(
  auth: Pick<SupabaseClient["auth"], "onAuthStateChange">,
  refresh: () => void,
  identityChanged: () => void,
  waitingForVerification: () => boolean,
) {
  let active = true;
  let identity: string | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if (!active) return;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => { timer = undefined; if (active) refresh(); }, 0);
  };
  const { data } = auth.onAuthStateChange((event, session) => {
    const nextIdentity = session?.user.id;
    if (event === "INITIAL_SESSION") { identity = nextIdentity; return; }
    if (identity !== nextIdentity) {
      identity = nextIdentity;
      identityChanged();
    }
    if (event === "SIGNED_OUT") {
      if (timer !== undefined) clearTimeout(timer);
      timer = undefined;
      // Another tab can sign out this tab. Re-read after the auth callback
      // finishes so private history disappears and the guest UI can load.
      schedule();
      return;
    }
    if (["SIGNED_IN", "USER_UPDATED", "TOKEN_REFRESHED"].includes(event)) schedule();
  });
  const focus = () => {
    if (document.visibilityState === "visible" && waitingForVerification()) schedule();
  };
  window.addEventListener("focus", focus);
  document.addEventListener("visibilitychange", focus);
  return () => {
    active = false;
    if (timer !== undefined) clearTimeout(timer);
    data.subscription.unsubscribe();
    window.removeEventListener("focus", focus);
    document.removeEventListener("visibilitychange", focus);
  };
}
