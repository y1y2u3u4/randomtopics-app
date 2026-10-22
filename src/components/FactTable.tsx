import type { ReactNode } from "react";

interface FactTableProps {
  heading: string;
  intro?: ReactNode;
  columns: string[];
  rows: ReactNode[][];
  note?: ReactNode;
}

/** Plain, server-rendered comparison table (GEO: quotable facts in a real <table>). */
export default function FactTable({ heading, intro, columns, rows, note }: FactTableProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          {heading}
        </h2>
        {intro ? <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{intro}</p> : null}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                {columns.map((column) => (
                  <th key={column} scope="col" className="py-2 pr-4 font-semibold">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 align-top">
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={j} scope="row" className="py-3 pr-4 font-semibold text-[var(--text-primary)]">{cell}</th>
                    ) : (
                      <td key={j} className="py-3 pr-4 text-[var(--text-secondary)] leading-relaxed">{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {note ? <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">{note}</p> : null}
      </div>
    </section>
  );
}
