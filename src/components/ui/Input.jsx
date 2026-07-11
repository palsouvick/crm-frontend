import { forwardRef } from "react";
import clsx from "clsx";
import { inputBaseClasses, inputStateClasses, inputSizeClasses } from "./inputStyles";

const Input = forwardRef(
  (
    {
      error = false,
      size = "md",
      leftIcon = null,
      rightIcon = null,
      className = "",
      ...props
    },
    ref
  ) => {
    if (!leftIcon && !rightIcon) {
      return (
        <input
          ref={ref}
          className={clsx(
            inputBaseClasses,
            inputStateClasses(error),
            inputSizeClasses[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-ink-subtle pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            inputBaseClasses,
            inputStateClasses(error),
            inputSizeClasses[size],
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink-subtle">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
