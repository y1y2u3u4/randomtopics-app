import type { Category, Mode } from "@/data/types";

// Inline SVG hero illustration, themed per category. Deterministic (no
// randomness — safe for SSR/hydration), styled to match the site's neon
// glassmorphism. Gives every category/mode page a real visual element:
// text-only pages read as low-effort to both users and AdSense reviewers.

interface SceneSpec {
  glyph: string;
  accent: string;
  accent2: string;
  label: string;
  // decorative floating shapes: [cx, cy, r]
  orbs: [number, number, number][];
}

const SCENES: Record<Category, SceneSpec> = {
  science: { glyph: "🔬", accent: "#00e5ff", accent2: "#00ff88", label: "Science topics illustration: microscope among orbiting molecules", orbs: [[80, 40, 14], [640, 30, 10], [560, 110, 18], [120, 120, 8]] },
  technology: { glyph: "💻", accent: "#b14eff", accent2: "#00e5ff", label: "Technology topics illustration: laptop in a circuit constellation", orbs: [[90, 100, 16], [620, 45, 12], [180, 30, 8], [560, 120, 9]] },
  philosophy: { glyph: "🤔", accent: "#ffe234", accent2: "#b14eff", label: "Philosophy topics illustration: thinker among question orbs", orbs: [[70, 50, 12], [630, 100, 16], [540, 30, 8], [140, 115, 10]] },
  psychology: { glyph: "🧠", accent: "#ff2d78", accent2: "#b14eff", label: "Psychology topics illustration: brain with neural sparks", orbs: [[100, 35, 10], [610, 110, 14], [650, 40, 8], [90, 110, 12]] },
  history: { glyph: "🏛️", accent: "#ffe234", accent2: "#ff6b35", label: "History topics illustration: monument under a timeline of stars", orbs: [[85, 105, 15], [600, 35, 11], [530, 115, 9], [150, 40, 8]] },
  "art-culture": { glyph: "🎨", accent: "#ff2d78", accent2: "#ffe234", label: "Art and culture topics illustration: palette with color orbits", orbs: [[75, 45, 13], [640, 95, 17], [550, 25, 8], [130, 120, 9]] },
  "food-travel": { glyph: "🌮", accent: "#ff6b35", accent2: "#00ff88", label: "Food and travel topics illustration: dish on a journey path", orbs: [[95, 110, 14], [615, 40, 12], [660, 110, 8], [110, 30, 9]] },
  relationships: { glyph: "💞", accent: "#ff2d78", accent2: "#00e5ff", label: "Relationships topics illustration: linked hearts constellation", orbs: [[80, 40, 12], [630, 105, 15], [560, 35, 9], [125, 115, 10]] },
  education: { glyph: "🎓", accent: "#00e5ff", accent2: "#ffe234", label: "Education topics illustration: graduation cap with idea sparks", orbs: [[90, 100, 13], [620, 35, 14], [540, 115, 8], [155, 35, 9]] },
  politics: { glyph: "🏛️", accent: "#00e5ff", accent2: "#ff2d78", label: "Politics topics illustration: debate podiums facing off", orbs: [[85, 45, 11], [635, 100, 13], [555, 30, 9], [120, 110, 12]] },
  entertainment: { glyph: "🎬", accent: "#b14eff", accent2: "#ff6b35", label: "Entertainment topics illustration: clapperboard premiere scene", orbs: [[75, 105, 16], [625, 45, 10], [665, 115, 8], [140, 35, 9]] },
  sports: { glyph: "⚽", accent: "#00ff88", accent2: "#00e5ff", label: "Sports topics illustration: ball mid-play with motion arcs", orbs: [[95, 40, 12], [610, 110, 14], [655, 35, 9], [105, 115, 8]] },
  business: { glyph: "📈", accent: "#00ff88", accent2: "#ffe234", label: "Business topics illustration: rising chart among market orbs", orbs: [[80, 110, 13], [640, 40, 11], [545, 110, 10], [150, 30, 8]] },
  nature: { glyph: "🌿", accent: "#00ff88", accent2: "#00e5ff", label: "Nature topics illustration: leaves in a living ecosystem", orbs: [[90, 35, 14], [615, 105, 12], [660, 45, 8], [115, 110, 10]] },
  health: { glyph: "💪", accent: "#ff6b35", accent2: "#00ff88", label: "Health topics illustration: vitality pulse with energy orbs", orbs: [[85, 100, 12], [630, 35, 13], [550, 110, 9], [145, 40, 10]] },
  "weird-fun": { glyph: "🛸", accent: "#b14eff", accent2: "#00ff88", label: "Weird and fun topics illustration: UFO beaming up question marks", orbs: [[70, 40, 15], [645, 110, 12], [565, 30, 10], [130, 115, 8]] },
};

const MODE_SCENES: Record<Mode, SceneSpec> = {
  conversation: { glyph: "💬", accent: "#00e5ff", accent2: "#ff2d78", label: "Conversation starters illustration: two speech bubbles meeting mid-air", orbs: [[85, 45, 13], [630, 100, 15], [555, 30, 9], [130, 115, 10]] },
  writing: { glyph: "✍️", accent: "#b14eff", accent2: "#ffe234", label: "Writing prompts illustration: pen tracing an idea constellation", orbs: [[90, 105, 14], [620, 40, 12], [660, 110, 8], [115, 35, 9]] },
  debate: { glyph: "⚔️", accent: "#ff2d78", accent2: "#00e5ff", label: "Debate topics illustration: two podiums squared off under stage light", orbs: [[80, 40, 12], [640, 105, 14], [560, 35, 9], [125, 110, 11]] },
  speech: { glyph: "🎤", accent: "#ffe234", accent2: "#ff6b35", label: "Speech topics illustration: microphone in a spotlight of ideas", orbs: [[95, 110, 13], [615, 35, 11], [655, 105, 8], [110, 40, 10]] },
  icebreaker: { glyph: "🧊", accent: "#00e5ff", accent2: "#00ff88", label: "Icebreaker questions illustration: ice cube cracking into conversation sparks", orbs: [[75, 50, 14], [635, 95, 13], [545, 25, 9], [140, 120, 8]] },
};

const PARTY_SCENES: Record<string, SceneSpec> = {
  "would-you-rather": { glyph: "🤷", accent: "#ffe234", accent2: "#ff2d78", label: "Would You Rather illustration: a fork between two glowing choices", orbs: [[85, 45, 13], [635, 100, 15], [555, 30, 9], [130, 115, 10]] },
  "never-have-i-ever": { glyph: "🙈", accent: "#ff2d78", accent2: "#b14eff", label: "Never Have I Ever illustration: ten fingers up under party lights", orbs: [[90, 105, 14], [620, 40, 12], [660, 110, 8], [115, 35, 9]] },
  "truth-or-dare": { glyph: "🎭", accent: "#b14eff", accent2: "#ff6b35", label: "Truth or Dare illustration: masks of truth and dare facing off", orbs: [[80, 40, 12], [640, 105, 14], [560, 35, 9], [125, 110, 11]] },
  "this-or-that": { glyph: "⚖️", accent: "#00e5ff", accent2: "#ffe234", label: "This or That illustration: scales weighing two quick choices", orbs: [[95, 110, 13], [615, 35, 11], [655, 105, 8], [110, 40, 10]] },
  "most-likely-to": { glyph: "👉", accent: "#00ff88", accent2: "#ff2d78", label: "Most Likely To illustration: fingers pointing across the circle", orbs: [[75, 50, 14], [635, 95, 13], [545, 25, 9], [140, 120, 8]] },
  "two-truths-and-a-lie": { glyph: "🃏", accent: "#ff6b35", accent2: "#00e5ff", label: "Two Truths and a Lie illustration: three cards, one bluffing", orbs: [[85, 100, 12], [630, 35, 13], [550, 110, 9], [145, 40, 10]] },
  "spin-the-wheel": { glyph: "🎡", accent: "#b14eff", accent2: "#00ff88", label: "Spin the Wheel illustration: a prize wheel mid-spin", orbs: [[70, 40, 15], [645, 110, 12], [565, 30, 10], [130, 115, 8]] },
  "paranoia-questions": { glyph: "🤫", accent: "#ff2d78", accent2: "#00e5ff", label: "Paranoia illustration: a whispered secret passing down the circle", orbs: [[80, 110, 13], [640, 40, 11], [545, 110, 10], [150, 30, 8]] },
  "hot-seat-questions": { glyph: "🔥", accent: "#ff6b35", accent2: "#ffe234", label: "Hot Seat illustration: one glowing chair in the spotlight", orbs: [[90, 35, 14], [615, 105, 12], [660, 45, 8], [115, 110, 10]] },
};

function IllustrationSvg({ scene, keyId }: { scene: SceneSpec; keyId: string }) {
  const gid = `cat-grad-${keyId}`;
  const gid2 = `cat-glow-${keyId}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8" aria-hidden={false}>
      <svg
        viewBox="0 0 720 150"
        role="img"
        aria-label={scene.label}
        className="w-full h-auto rounded-2xl border border-[rgba(255,255,255,0.06)]"
        style={{ background: "linear-gradient(135deg, rgba(10,14,30,0.9), rgba(20,16,40,0.9))" }}
      >
        <title>{scene.label}</title>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={scene.accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={scene.accent2} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id={gid2} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={scene.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={scene.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* glow behind the glyph */}
        <circle cx="360" cy="75" r="64" fill={`url(#${gid2})`} />

        {/* orbit rings */}
        <ellipse cx="360" cy="75" rx="150" ry="52" fill="none" stroke={scene.accent} strokeOpacity="0.25" strokeWidth="1.5" />
        <ellipse cx="360" cy="75" rx="230" ry="66" fill="none" stroke={scene.accent2} strokeOpacity="0.15" strokeWidth="1" />

        {/* floating orbs */}
        {scene.orbs.map(([cx, cy, r], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={`url(#${gid})`} stroke={i % 2 ? scene.accent2 : scene.accent} strokeOpacity="0.4" strokeWidth="1" />
            <circle cx={cx - r / 3} cy={cy - r / 3} r={Math.max(1.5, r / 5)} fill="#ffffff" opacity="0.35" />
          </g>
        ))}

        {/* connector lines suggesting a constellation of ideas */}
        <path
          d={`M ${scene.orbs[0][0]} ${scene.orbs[0][1]} L 300 75 M ${scene.orbs[1][0]} ${scene.orbs[1][1]} L 420 75 M ${scene.orbs[2][0]} ${scene.orbs[2][1]} L 415 90`}
          stroke={scene.accent}
          strokeOpacity="0.18"
          strokeWidth="1"
          fill="none"
        />

        {/* central glyph */}
        <text x="360" y="97" textAnchor="middle" fontSize="60">
          {scene.glyph}
        </text>
      </svg>
    </div>
  );
}

export default function CategoryIllustration({ category }: { category: Category }) {
  const scene = SCENES[category];
  if (!scene) return null;
  return <IllustrationSvg scene={scene} keyId={category} />;
}

export function ModeIllustration({ mode }: { mode: Mode }) {
  const scene = MODE_SCENES[mode];
  if (!scene) return null;
  return <IllustrationSvg scene={scene} keyId={`mode-${mode}`} />;
}

export function PartyIllustration({ game }: { game: string }) {
  const scene = PARTY_SCENES[game];
  if (!scene) return null;
  return <IllustrationSvg scene={scene} keyId={`party-${game}`} />;
}
