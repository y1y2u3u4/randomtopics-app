"use client";
import { useState } from "react";

export default function CopyBlock({
  code,
  label,
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
          {label}
        </p>
      )}
      <div className="relative">
        <pre className="text-xs text-[var(--text-secondary)] bg-[rgba(0,0,0,0.3)] rounded-lg p-4 overflow-x-auto border border-[rgba(255,255,255,0.06)]">
          <code>{code}</code>
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-xs px-3 py-1 rounded-md border transition-all cursor-pointer"
          style={{
            borderColor: copied
              ? "var(--neon-green)"
              : "rgba(255,255,255,0.1)",
            color: copied ? "var(--neon-green)" : "var(--text-muted)",
            background: "rgba(0,0,0,0.5)",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
