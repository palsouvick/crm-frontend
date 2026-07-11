import { forwardRef } from "react";
import clsx from "clsx";

const sizeClasses = {
  sm: { track: "w-8 h-4.5", thumb: "w-3.5 h-3.5", translate: "translate-x-3.5" },
  md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
};

const Switch = forwardRef(
  ({ checked = false, disabled = false, size = "md", className = "", ...props }, ref) => {
    const dims = sizeClasses[size];

    return (
      <label className={clsx("relative inline-flex items-center cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="sr-only peer"
          {...props}
        />
        <span
          className={clsx(
            dims.track,
            "rounded-full bg-neutral-300 peer-checked:bg-primary-600 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2"
          )}
        />
        <span
          className={clsx(
            dims.thumb,
            "absolute left-0.5 top-1/2 -translate-y-1/2 rounded-full bg-white shadow transition-transform",
            checked && dims.translate
          )}
        />
      </label>
    );
  }
);

Switch.displayName = "Switch";

export default Switch;
