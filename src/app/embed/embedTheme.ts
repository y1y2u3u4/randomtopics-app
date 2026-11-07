// Shared colors for the iframe widgets under /embed (no site chrome, no ads).
export function embedTheme(theme: string | null) {
  const dark = theme === "dark";
  return {
    dark,
    bg: dark ? "#0e0e1a" : "#ffffff",
    text: dark ? "#eef2ff" : "#1a1a2e",
    muted: dark ? "#8b95b0" : "#5b6275",
    border: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    accent: "#ff2d78",
    accent2: "#ff6b35",
  };
}

export const embedFont = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
