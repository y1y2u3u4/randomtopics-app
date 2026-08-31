export type PremiumDepth = "Light" | "Medium" | "Deep";

export interface PremiumPromptItem {
  id: string;
  prompt: string;
  category: string;
  audience: string;
  useCase: string;
  duration: string;
  depth: PremiumDepth;
  choices?: [string, string];
  values?: string[];
  followUps: string[];
  facilitationTip?: string;
}

export interface PremiumFilter {
  key: "category" | "audience" | "useCase" | "duration" | "depth";
  label: string;
  allLabel: string;
  options: string[];
}

export interface PremiumCollectionConfig {
  slug: string;
  path: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  intro: string;
  published: string;
  updated: string;
  source: string;
  promptNoun: string;
  itemCountLabel: string;
  filters: PremiumFilter[];
  items: PremiumPromptItem[];
  tool: {
    title: string;
    description: string;
    actionLabel: string;
    emptyLabel: string;
    copyStyle: "plain" | "classroom" | "work";
    daily: boolean;
    planner: boolean;
  };
  guide: {
    title: string;
    intro: string;
    steps: { title: string; description: string }[];
  };
  qualityNotes: string[];
  disclaimer?: string;
  parentLink: { label: string; href: string };
  relatedLinks: { label: string; href: string; description: string }[];
  faq: { question: string; answer: string }[];
  library: {
    category: "education" | "business" | "philosophy";
    modes: ("conversation" | "debate" | "icebreaker")[];
  };
}

export function validatePremiumCollection(
  config: PremiumCollectionConfig,
  expectedCount: number,
): void {
  if (config.items.length !== expectedCount) {
    throw new Error(`${config.slug}: expected ${expectedCount} items, received ${config.items.length}`);
  }

  const ids = new Set<string>();
  const prompts = new Set<string>();
  for (const item of config.items) {
    const normalizedPrompt = item.prompt.trim().toLowerCase().replace(/\s+/g, " ");
    if (ids.has(item.id)) throw new Error(`${config.slug}: duplicate item id ${item.id}`);
    if (prompts.has(normalizedPrompt)) throw new Error(`${config.slug}: duplicate prompt ${item.prompt}`);
    if (!item.prompt.trim() || !item.category || !item.audience || !item.useCase || !item.duration) {
      throw new Error(`${config.slug}: incomplete item ${item.id}`);
    }
    if (item.followUps.length === 0) throw new Error(`${config.slug}: item ${item.id} has no follow-up`);
    ids.add(item.id);
    prompts.add(normalizedPrompt);
  }

  for (const filter of config.filters) {
    for (const option of filter.options) {
      if (!config.items.some((item) => item[filter.key] === option)) {
        throw new Error(`${config.slug}: unused ${filter.key} filter option ${option}`);
      }
    }
  }
}

export function validateFilterPairCoverage(
  config: PremiumCollectionConfig,
  firstKey: PremiumFilter["key"],
  secondKey: PremiumFilter["key"],
): void {
  const first = config.filters.find((filter) => filter.key === firstKey);
  const second = config.filters.find((filter) => filter.key === secondKey);
  if (!first || !second) {
    throw new Error(`${config.slug}: missing filter pair ${firstKey}/${secondKey}`);
  }

  for (const firstOption of first.options) {
    for (const secondOption of second.options) {
      if (!config.items.some((item) =>
        item[firstKey] === firstOption && item[secondKey] === secondOption
      )) {
        throw new Error(
          `${config.slug}: empty filter pair ${firstKey}=${firstOption}, ${secondKey}=${secondOption}`,
        );
      }
    }
  }
}
