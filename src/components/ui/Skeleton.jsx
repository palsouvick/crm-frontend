import clsx from "clsx";

const variantClasses = {
  block: "rounded-control",
  circle: "rounded-full",
  text: "rounded",
};

const Skeleton = ({ variant = "block", width, height, lines = 1, className = "" }) => {
  if (variant === "text") {
    return (
      <div className={clsx("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            style={{ width: i === lines - 1 && lines > 1 ? "70%" : width }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "bg-neutral-200 dark:bg-neutral-800 animate-pulse",
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
