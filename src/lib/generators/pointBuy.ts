// D&D 5e point buy: 27 points, every score starts at 8 and can be raised to 15 before bonuses.
export const POINT_BUDGET = 27;
export const MIN_SCORE = 8;
export const MAX_SCORE = 15;
export const SCORE_CAP = 20;

export const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

export const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
export const ABILITY_NAMES = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"] as const;

export const modifier = (score: number) => Math.floor((score - 10) / 2);
export const fmtMod = (m: number) => (m >= 0 ? `+${m}` : `${m}`);
export const totalCost = (scores: readonly number[]) => scores.reduce((s, v) => s + (POINT_COST[v] ?? 0), 0);

// Order: STR DEX CON INT WIS CHA. Every preset costs exactly 27 points.
export const POINT_BUY_PRESETS: { id: string; label: string; scores: number[] }[] = [
  { id: "standard", label: "Standard array", scores: [15, 14, 13, 12, 10, 8] },
  { id: "balanced", label: "Balanced 13/13/13/12/12/12", scores: [13, 13, 13, 12, 12, 12] },
  { id: "max3", label: "Max three 15/15/15", scores: [15, 15, 15, 8, 8, 8] },
  { id: "jack", label: "Jack of all trades", scores: [14, 13, 13, 12, 12, 10] },
  { id: "fighter", label: "Fighter", scores: [15, 13, 14, 8, 12, 10] },
  { id: "rogue", label: "Rogue", scores: [8, 15, 14, 10, 12, 13] },
  { id: "wizard", label: "Wizard", scores: [8, 14, 14, 15, 12, 8] },
  { id: "cleric", label: "Cleric", scores: [13, 8, 14, 10, 15, 12] },
];

// 2014 races as a fixed ability bonus (STR DEX CON INT WIS CHA).
export const RACES_2014: { id: string; label: string; bonus: number[] }[] = [
  { id: "human", label: "Human (+1 all)", bonus: [1, 1, 1, 1, 1, 1] },
  { id: "hilldwarf", label: "Hill dwarf (CON +2, WIS +1)", bonus: [0, 0, 2, 0, 1, 0] },
  { id: "mountaindwarf", label: "Mountain dwarf (STR +2, CON +2)", bonus: [2, 0, 2, 0, 0, 0] },
  { id: "highelf", label: "High elf (DEX +2, INT +1)", bonus: [0, 2, 0, 1, 0, 0] },
  { id: "woodelf", label: "Wood elf (DEX +2, WIS +1)", bonus: [0, 2, 0, 0, 1, 0] },
  { id: "lightfoot", label: "Lightfoot halfling (DEX +2, CHA +1)", bonus: [0, 2, 0, 0, 0, 1] },
  { id: "dragonborn", label: "Dragonborn (STR +2, CHA +1)", bonus: [2, 0, 0, 0, 0, 1] },
  { id: "rockgnome", label: "Rock gnome (INT +2, CON +1)", bonus: [0, 0, 1, 2, 0, 0] },
  { id: "halforc", label: "Half-orc (STR +2, CON +1)", bonus: [2, 0, 1, 0, 0, 0] },
  { id: "tiefling", label: "Tiefling (CHA +2, INT +1)", bonus: [0, 0, 0, 1, 0, 2] },
  { id: "halfelf", label: "Half-elf (CHA +2, +1 DEX, +1 CON)", bonus: [0, 1, 1, 0, 0, 2] },
];
