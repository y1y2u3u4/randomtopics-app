import type { ReactNode } from "react";

export const yes = <span className="text-[var(--neon-cyan)]">Yes</span>;
export const no = <span className="text-[var(--text-muted)]">No</span>;

/** Feature table: this page vs. the top search results for the same tool. */
export default function CompareTable({ rows, them, note }: { rows: [string, ReactNode, ReactNode][]; them: string; note: string }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left border-b border-white/15">
              <th className="py-2 pr-3">Feature</th>
              <th className="py-2 pr-3">This page</th>
              <th className="py-2 pr-3">{them}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([f, us, other]) => (
              <tr key={f} className="border-b border-white/10 align-top">
                <td className="py-2 pr-3">{f}</td>
                <td className="py-2 pr-3">{us}</td>
                <td className="py-2 pr-3">{other}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[var(--text-muted)]">{note}</p>
    </>
  );
}
