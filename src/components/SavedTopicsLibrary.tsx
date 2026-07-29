"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Topic } from "@/data/types";
import type { Locale } from "@/i18n/config";
import TopicCard from "@/components/TopicCard";
import {
  clearRecentTopics,
  getEmptyTopicLibrarySnapshot,
  getFavoriteTopicsSnapshot,
  getRecentTopicsSnapshot,
  subscribeToTopicLibrary,
} from "@/lib/topicLibrary";
import { track } from "@/lib/track";

export default function SavedTopicsLibrary({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const favorites = JSON.parse(
    useSyncExternalStore(
      subscribeToTopicLibrary,
      getFavoriteTopicsSnapshot,
      getEmptyTopicLibrarySnapshot
    )
  ) as Topic[];
  const recent = JSON.parse(
    useSyncExternalStore(
      subscribeToTopicLibrary,
      getRecentTopicsSnapshot,
      getEmptyTopicLibrarySnapshot
    )
  ) as Topic[];

  const clearHistory = () => {
    clearRecentTopics();
    track("clear_recent_topics", { topic_locale: locale });
  };

  return (
    <div className="space-y-12">
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {isEs ? "Temas guardados" : "Saved topics"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isEs
                ? "Tus favoritos se guardan en este navegador, sin necesidad de una cuenta."
                : "Your favorites stay in this browser—no account required."}
            </p>
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {favorites.length} {isEs ? "guardados" : "saved"}
          </span>
        </div>

        {favorites.length > 0 ? (
          <div className="space-y-4">
            {favorites.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} index={index} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-4xl mb-3">☆</p>
            <p className="font-semibold text-[var(--text-primary)]">
              {isEs ? "Todavía no has guardado ningún tema" : "No saved topics yet"}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-2 mb-5">
              {isEs
                ? "Pulsa el corazón en cualquier resultado para añadirlo aquí."
                : "Tap the heart on any generated result to add it here."}
            </p>
            <Link href={isEs ? "/es" : "/"} className="btn-generate inline-flex px-5 py-2.5 text-sm">
              {isEs ? "Generar temas" : "Generate topics"}
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {isEs ? "Generados recientemente" : "Recently generated"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isEs ? "Tus últimos 50 resultados." : "Your latest 50 results."}
            </p>
          </div>
          {recent.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-pink)] transition-colors"
            >
              {isEs ? "Borrar historial" : "Clear history"}
            </button>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="space-y-4">
            {recent.map((topic, index) => (
              <TopicCard key={`${topic.id}-${index}`} topic={topic} index={Math.min(index, 4)} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center text-sm text-[var(--text-muted)]">
            {isEs
              ? "Los temas que generes aparecerán aquí automáticamente."
              : "Topics you generate will appear here automatically."}
          </div>
        )}
      </section>
    </div>
  );
}
