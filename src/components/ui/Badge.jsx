import clsx from "clsx";

const variantClasses = {
  neutral: "bg-neutral-100 text-neutral-700",
  primary: "bg-primary-100 text-primary-700",
  success: "bg-success-100 text-success-700",
  warning: "bg-warning-100 text-warning-700",
  danger: "bg-danger-100 text-danger-700",
  info: "bg-info-100 text-info-700",
};

const dotClasses = {
  neutral: "bg-neutral-500",
  primary: "bg-primary-600",
  success: "bg-success-600",
  warning: "bg-warning-600",
  danger: "bg-danger-600",
  info: "bg-info-600",
};

const sizeClasses = {
  sm: "text-caption px-2 py-0.5",
  md: "text-xs px-3 py-1",
};

const Badge = ({
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={clsx("w-1.5 h-1.5 rounded-full", dotClasses[variant])} />
      )}
      {children}
    </span>
  );
};

export default Badge;
