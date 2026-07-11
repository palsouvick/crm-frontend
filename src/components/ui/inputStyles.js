export const inputSizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-body",
};

export const inputBaseClasses =
  "w-full rounded-control border bg-surface text-ink placeholder:text-ink-subtle outline-none transition focus:ring-2";

export const inputStateClasses = (error) =>
  error
    ? "border-danger-600 focus:ring-danger-600"
    : "border-border focus:ring-primary-500";
