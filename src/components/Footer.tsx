import Link from "next/link";
import { MODES, CATEGORIES } from "@/data/types";

export default function Footer() {
  return (
    <footer className="mt-auto pt-16 pb-8 px-4 sm:px-6 relative">
      {/* Subtle gradient line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--neon-pink), var(--neon-cyan), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-secondary)",
              }}
            >
              Generators
            </h3>
            <ul className="space-y-2">
              {MODES.map((mode) => (
                <li key={mode.slug}>
                  <Link
                    href={`/${mode.slug}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {mode.emoji} {mode.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/funny"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  😂 Funny Topics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-secondary)",
              }}
            >
              Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.id}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {cat.emoji} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-secondary)",
              }}
            >
              More Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(8).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/categories/${cat.id}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {cat.emoji} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-secondary)",
              }}
            >
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <span
              className="font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="gradient-text">Random</span>
              <span className="text-[var(--text-primary)]">Topics</span>
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} randomtopics.app. Free random topic generator for everyone.
          </p>
        </div>
      </div>
    </footer>
  );
}
