// A qualified impression is distinct from a click and is never synthesized by one.
export function observeVisibleAction(button: HTMLButtonElement, onView: () => void) {
  return observeVisibleContent(button, onView, () => !button.disabled);
}

export function observeVisibleContent(element: HTMLElement, onView: () => void, available = () => true) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  let intersects = false;
  let finished = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const eligible = () => intersects && available() && element.isConnected &&
    document.visibilityState === "visible" && document.hasFocus();
  const cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  const update = () => {
    if (finished || !eligible()) { cancel(); return; }
    if (timer !== undefined) return;
    timer = setTimeout(() => {
      timer = undefined;
      if (!eligible() || finished) return;
      finished = true;
      observer.disconnect();
      onView();
    }, 1000);
  };
  const observer = new IntersectionObserver(([entry]) => {
    intersects = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.5);
    update();
  }, { threshold: [0, 0.5, 1] });
  observer.observe(element);
  document.addEventListener("visibilitychange", update);
  window.addEventListener("focus", update);
  window.addEventListener("blur", cancel);
  return () => {
    finished = true;
    cancel();
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
    window.removeEventListener("focus", update);
    window.removeEventListener("blur", cancel);
  };
}
