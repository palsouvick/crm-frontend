// Chart colors reference the CSS custom properties from styles/tokens.css
// (Tailwind v4's @theme block emits these as real CSS variables), so Recharts
// SVG props stay in sync with light/dark theme without any re-render.
export const chartColor = {
  primary: "var(--color-primary-600)",
  primaryMuted: "var(--color-primary-300)",
  success: "var(--color-success-600)",
  danger: "var(--color-danger-600)",
  warning: "var(--color-warning-600)",
  info: "var(--color-info-600)",
  neutral: "var(--color-neutral-400)",
  grid: "var(--color-border)",
  axisText: "var(--color-ink-muted)",
};

export const categorical = [
  chartColor.primary,
  chartColor.success,
  chartColor.warning,
  chartColor.info,
  chartColor.danger,
];

export const leadStatusColor = {
  new: chartColor.info,
  contacted: chartColor.warning,
  qualified: chartColor.primaryMuted,
  won: chartColor.success,
  lost: chartColor.danger,
};
