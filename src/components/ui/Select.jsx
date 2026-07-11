import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { inputBaseClasses, inputStateClasses, inputSizeClasses } from "./inputStyles";

const Select = forwardRef(
  (
    { error = false, size = "md", options, className = "", children, ...props },
    ref
  ) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={clsx(
            inputBaseClasses,
            inputStateClasses(error),
            inputSizeClasses[size],
            "appearance-none pr-10",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-ink-subtle pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
