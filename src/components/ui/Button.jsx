import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const baseClasses =
  "inline-flex items-center justify-center gap-2 font-medium rounded-control transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-neutral-700 text-white hover:bg-neutral-800",
  outline:
    "border border-border bg-transparent text-ink hover:bg-surface-hover",
  ghost: "bg-transparent text-ink hover:bg-surface-hover",
  danger: "bg-danger-600 text-white hover:bg-danger-700",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-button px-4 py-2.5",
  lg: "text-base px-5 py-3",
};

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon = null,
      rightIcon = null,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
