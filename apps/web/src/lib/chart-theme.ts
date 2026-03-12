// Recharts doesn't support CSS variables natively,
// so we provide theme-aware style objects.
// These get passed as props to Recharts components.

export function getTooltipStyle(): React.CSSProperties {
  return {
    backgroundColor: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--foreground)",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };
}

// For axes and grids, Recharts needs actual color strings.
// We resolve CSS variables at render time via getComputedStyle.
export function resolveVar(varName: string): string {
  if (typeof window === "undefined") return "#71717a"; // SSR fallback
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "#71717a";
}
