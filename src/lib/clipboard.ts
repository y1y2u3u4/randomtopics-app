/**
 * Copy text without making the product depend on the Clipboard API.
 * Permission-restricted and embedded browsers frequently block
 * navigator.clipboard even during a user gesture, so keep the synchronous
 * textarea fallback. The caller decides how to present a manual fallback.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continue to the user-gesture fallback below.
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

export type ShareTextResult =
  | { status: "shared"; method: "native" | "clipboard" }
  | { status: "aborted" }
  | { status: "failed"; fallbackText: string };

/**
 * Share a generated result without treating a cancelled native share sheet as
 * either a success or an error. Browsers without Web Share fall back to a
 * copied result + URL; callers can expose fallbackText when copying is blocked.
 */
export async function shareText({
  title,
  text,
  url,
}: {
  title: string;
  text: string;
  url: string;
}): Promise<ShareTextResult> {
  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return { status: "shared", method: "native" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { status: "aborted" };
      }
      // Some desktop browsers expose Web Share but reject a particular payload.
      // Continue to the copy-link fallback instead of losing the user action.
    }
  }

  const fallbackText = `${text}\n${url}`;
  if (await copyText(fallbackText)) {
    return { status: "shared", method: "clipboard" };
  }
  return { status: "failed", fallbackText };
}
