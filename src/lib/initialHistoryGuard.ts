// This must run as a synchronous inline head script, before Next's chunks.
// A hard document replacement can retain same-document history entries. If a
// visitor traverses one before hydration, Next has no popstate listener yet and
// would pair the destination URL with the original document's server tree.
export const INITIAL_HISTORY_READY = "rt:initial-router-ready";

export const initialHistoryGuardScript = `(() => {
  const initialRoute = location.pathname + location.search;
  let traversing = false;
  const onPopState = (event) => {
    if (location.pathname + location.search === initialRoute) return;
    traversing = true;
    event.stopImmediatePropagation();
    location.replace(location.href);
  };
  window.addEventListener('popstate', onPopState, { capture: true });
  window.addEventListener('${INITIAL_HISTORY_READY}', () => {
    // Once an early traversal starts, keep guarding until that document exits.
    if (!traversing) window.removeEventListener('popstate', onPopState, { capture: true });
  }, { once: true });
})();`;
