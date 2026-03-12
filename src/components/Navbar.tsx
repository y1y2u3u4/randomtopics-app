"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MODES } from "@/data/types";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#08080f]/90 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🎲</span>
            <span
              className="font-bold text-lg tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="gradient-text">Random</span>
              <span className="text-[var(--text-primary)]">Topics</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {MODES.map((mode) => (
              <Link
                key={mode.slug}
                href={`/${mode.slug}`}
                className={`nav-link px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === `/${mode.slug}` ? "active" : ""
                }`}
              >
                <span className="mr-1">{mode.emoji}</span>
                {mode.label.split(" ")[0]}
              </Link>
            ))}
            <Link
              href="/funny"
              className={`nav-link px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === "/funny" ? "active" : ""
              }`}
            >
              <span className="mr-1">😂</span>Funny
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-[var(--text-secondary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu with slide-down animation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 border-t border-white/5 mt-2 pt-3">
                <div className="flex flex-col gap-1">
                  {MODES.map((mode) => (
                    <Link
                      key={mode.slug}
                      href={`/${mode.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={`nav-link px-3 py-2.5 rounded-lg text-sm ${
                        pathname === `/${mode.slug}` ? "active" : ""
                      }`}
                    >
                      <span className="mr-2">{mode.emoji}</span>
                      {mode.label}
                    </Link>
                  ))}
                  <Link
                    href="/funny"
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link px-3 py-2.5 rounded-lg text-sm ${
                      pathname === "/funny" ? "active" : ""
                    }`}
                  >
                    <span className="mr-2">😂</span>Funny Topics
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setMobileOpen(false)}
                    className={`nav-link px-3 py-2.5 rounded-lg text-sm ${
                      pathname === "/categories" ? "active" : ""
                    }`}
                  >
                    <span className="mr-2">📂</span>All Categories
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
