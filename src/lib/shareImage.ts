/** Phones: native share sheet with the PNG. Desktop (or if sharing fails): plain download. */
export async function shareCanvasPng(canvas: HTMLCanvasElement, filename: string, title: string, url: string): Promise<"shared" | "downloaded"> {
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("could not encode image");
  const file = new File([blob], filename, { type: "image/png" });
  const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  if (touch && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title, url });
      return "shared";
    } catch (e) {
      if ((e as Error).name === "AbortError") return "shared";
    }
  }
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 4000);
  return "downloaded";
}

/** Word-wrap `text` to `maxWidth` using the context's current font. */
export function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
