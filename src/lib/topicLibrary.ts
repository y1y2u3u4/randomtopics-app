"use client";

import type { Topic } from "@/data/types";
import { topics } from "@/data/topics";

const FAVORITES_KEY = "rt_favorite_topics_v2";
const RECENT_KEY = "rt_recent_topics_v1";
const LEGACY_FAVORITE_KEYS = ["rt_favorites", "rt-saved-topics"] as const;
const LIBRARY_EVENT = "randomtopics:library-change";

function isTopic(value: unknown): value is Topic {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Topic>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.category === "string" &&
    Array.isArray(candidate.modes) &&
    typeof candidate.depth === "string" &&
    Array.isArray(candidate.talkingPoints)
  );
}

function readJson(key: string): unknown {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function readTopicArray(key: string): Topic[] {
  const value = readJson(key);
  return Array.isArray(value) ? value.filter(isTopic) : [];
}

function writeTopicArray(key: string, value: Topic[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(LIBRARY_EVENT));
    return true;
  } catch {
    // Private browsing and strict storage policies can reject localStorage.
    return false;
  }
}

function migrateLegacyFavorites(): Topic[] {
  const ids = new Set<string>();
  for (const key of LEGACY_FAVORITE_KEYS) {
    const value = readJson(key);
    if (!Array.isArray(value)) continue;
    for (const item of value) {
      if (typeof item === "string") ids.add(item);
      else if (isTopic(item)) ids.add(item.id);
    }
  }

  if (ids.size === 0) return [];
  const migrated = topics.filter((topic) => ids.has(topic.id));
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated));
  } catch {
    // Migration is best-effort; legacy data remains available for a retry.
  }
  return migrated;
}

function dedupeTopics(value: Topic[], limit: number): Topic[] {
  const seen = new Set<string>();
  const result: Topic[] = [];
  for (const topic of value) {
    if (seen.has(topic.id)) continue;
    seen.add(topic.id);
    result.push(topic);
    if (result.length >= limit) break;
  }
  return result;
}

export function getFavoriteTopics(): Topic[] {
  if (typeof window === "undefined") return [];
  try {
    if (localStorage.getItem(FAVORITES_KEY) !== null) {
      return readTopicArray(FAVORITES_KEY);
    }
  } catch {
    return [];
  }
  return migrateLegacyFavorites();
}

export function isFavoriteTopic(topicId: string): boolean {
  return getFavoriteTopics().some((topic) => topic.id === topicId);
}

export type FavoriteToggleResult = { saved: boolean; persisted: boolean };

export function toggleFavoriteTopic(topic: Topic): FavoriteToggleResult {
  const current = getFavoriteTopics();
  const exists = current.some((saved) => saved.id === topic.id);
  const next = exists
    ? current.filter((saved) => saved.id !== topic.id)
    : dedupeTopics([topic, ...current], 100);
  const persisted = writeTopicArray(FAVORITES_KEY, next);
  return { saved: persisted ? !exists : exists, persisted };
}

export function getRecentTopics(): Topic[] {
  return readTopicArray(RECENT_KEY);
}

export function getFavoriteTopicsSnapshot(): string {
  return JSON.stringify(getFavoriteTopics());
}

export function getRecentTopicsSnapshot(): string {
  return JSON.stringify(getRecentTopics());
}

export function getEmptyTopicLibrarySnapshot(): string {
  return "[]";
}

export function recordRecentTopics(generated: Topic[]): void {
  if (generated.length === 0) return;
  writeTopicArray(RECENT_KEY, dedupeTopics([...generated, ...getRecentTopics()], 50));
}

export function clearRecentTopics(): void {
  writeTopicArray(RECENT_KEY, []);
}

export function subscribeToTopicLibrary(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(LIBRARY_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(LIBRARY_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
