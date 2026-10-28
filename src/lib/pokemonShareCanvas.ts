import { TYPE_COLORS, dexLabel, filterSummary, type Pokemon, type PokemonFilters } from "@/lib/pokemon";
import { shareCanvasPng } from "@/lib/shareImage";

const BODY = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** 1080px-wide card of type-coloured tiles (no Pokémon images): name, Pokédex number, types. */
export function renderPokemonCanvas(list: readonly Pokemon[], title: string, filters: PokemonFilters): HTMLCanvasElement {
  const w = 1080, pad = 54, gap = 22, cols = list.length <= 2 ? 1 : list.length <= 6 ? 2 : 3;
  const tileW = (w - pad * 2 - gap * (cols - 1)) / cols;
  const tileH = cols === 1 ? 190 : cols === 2 ? 170 : 150;
  const rows = Math.ceil(list.length / cols);
  const head = 190, foot = 150;
  const h = head + rows * tileH + (rows - 1) * gap + foot;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unsupported");
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#14122b");
  bg.addColorStop(1, "#0a1a30");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFE234";
  ctx.font = `800 52px ${BODY}`;
  ctx.fillText(title, pad, 94);
  ctx.fillStyle = "#B9C0DA";
  ctx.font = `500 28px ${BODY}`;
  ctx.fillText(filterSummary(filters), pad, 142);

  list.forEach((p, i) => {
    const x = pad + (i % cols) * (tileW + gap);
    const y = head + Math.floor(i / cols) * (tileH + gap);
    const c = TYPE_COLORS[p.types[0]];
    const g = ctx.createLinearGradient(x, y, x + tileW, y + tileH);
    g.addColorStop(0, c.bg);
    g.addColorStop(1, TYPE_COLORS[p.types[p.types.length - 1]].bg);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(x, y, tileW, tileH, 24);
    ctx.fill();
    // Ink readable on the first type colour, which dominates the left of the tile.
    ctx.fillStyle = c.text;
    ctx.globalAlpha = 0.75;
    ctx.font = `700 ${cols === 3 ? 24 : 28}px ${BODY}`;
    ctx.fillText(dexLabel(p), x + 24, y + (cols === 3 ? 42 : 48));
    ctx.globalAlpha = 1;
    let size = cols === 3 ? 38 : 48;
    ctx.font = `800 ${size}px ${BODY}`;
    while (ctx.measureText(p.name).width > tileW - 48 && size > 20) { size -= 2; ctx.font = `800 ${size}px ${BODY}`; }
    ctx.fillText(p.name, x + 24, y + tileH / 2 + (cols === 3 ? 16 : 20));
    ctx.font = `600 ${cols === 3 ? 22 : 26}px ${BODY}`;
    ctx.fillText(p.types.join(" / "), x + 24, y + tileH - (cols === 3 ? 24 : 30));
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 38px ${BODY}`;
  ctx.fillText("randomtopics.app/random-pokemon-generator", w / 2, h - 80);
  ctx.fillStyle = "#8D94B5";
  ctx.font = `500 22px ${BODY}`;
  ctx.fillText("Unofficial fan tool. Not affiliated with Nintendo, Game Freak or The Pokémon Company.", w / 2, h - 36);
  return canvas;
}

export async function sharePokemonImage(list: readonly Pokemon[], title: string, filters: PokemonFilters): Promise<"shared" | "downloaded"> {
  const canvas = renderPokemonCanvas(list, title, filters);
  return shareCanvasPng(canvas, "random-pokemon.png", title, "https://randomtopics.app/random-pokemon-generator");
}
