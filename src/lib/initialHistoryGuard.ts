// This must run as a synchronous inline head script, before Next's chunks.
// A hard document replacement can retain same-document history entries. If a
// visitor traverses one before hydration, Next has no popstate listener yet and
// would pair the destination URL with the original document's server tree.
export const INITIAL_HISTORY_READY = "rt:initial-router-ready";

export const initialHistoryGuardScript = `(() => {
  let initialRoute = location.pathname + location.search;
  try {
    // CSS can delay even an inline head script. Recover the document's actual
    // request URL if history already moved before this listener could run.
    const documentUrl = new URL(performance.getEntriesByType('navigation')[0]?.name || location.href);
    initialRoute = documentUrl.pathname + documentUrl.search;
  } catch { /* Keep future early traversals guarded if timing is unavailable. */ }
  let traversing = false;
  const onPopState = (event) => {
    if (location.pathname + location.search === initialRoute) return;
    traversing = true;
    event?.stopImmediatePropagation();
    location.replace(location.href);
  };
  window.addEventListener('popstate', onPopState, { capture: true });
  window.addEventListener('${INITIAL_HISTORY_READY}', () => {
    // Once an early traversal starts, keep guarding until that document exits.
    if (!traversing) window.removeEventListener('popstate', onPopState, { capture: true });
  }, { once: true });
  onPopState();
})();`;
