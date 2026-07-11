// Shared Framer Motion timing/presets for the design-system components.
// Framer Motion reads transition values from JS, not CSS custom properties,
// so these durations mirror the design tokens in src/styles/tokens.css
// rather than being derived from them.

export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.35,
};

export const EASE = [0.4, 0, 0.2, 1];

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.base, ease: EASE },
};

export const slideDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: DURATION.base, ease: EASE },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: DURATION.fast, ease: EASE },
};
