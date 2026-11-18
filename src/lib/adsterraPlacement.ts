export const NATIVE_PLACEMENT = "adsterra-native-foot";

const ADSENSE_SLOT = '[data-ad-placement^="public-"], [data-ad-slot], ins.adsbygoogle, .google-auto-placed';
const CONTENT = "h1, h2, h3, h4, h5, h6, p, section, article";
const FAQ = "[data-adsterra-before-faq]";

// undefined means no safe position. null means append inside main.
export function adsterraInsertionPoint(main: HTMLElement): Element | null | undefined {
  const blocks = Array.from(main.children)
    .filter(block => block.getAttribute("data-ad-placement") !== NATIVE_PLACEMENT);
  const kinds = blocks.map(block => {
    if (block.matches(ADSENSE_SLOT) || block.querySelector(ADSENSE_SLOT)) return "ad";
    if (block.closest('[hidden], [aria-hidden="true"]')) return null;
    return Array.from(block.querySelectorAll(CONTENT))
      .concat(block.matches(CONTENT) ? [block] : [])
      .some(content => content.textContent?.trim() && !content.closest('[hidden], [aria-hidden="true"]'))
      ? "content" : null;
  });

  const safe = (index: number) =>
    kinds.slice(0, index).reverse().find(Boolean) !== "ad" &&
    kinds.slice(index).find(Boolean) !== "ad" &&
    kinds.slice(0, index).includes("content");

  const faq = blocks.findIndex(block => block.matches(FAQ));
  const footerAd = blocks.findIndex((block, index) =>
    index > faq && block.getAttribute("data-ad-placement") === "public-content");
  const start = faq >= 0 && footerAd >= 0 ? faq : blocks.length;

  // A terminal ad needs a real content block on its side of the Native.
  for (let index = start; index > 0; index--) {
    if (safe(index)) return blocks[index] ?? null;
  }
}
