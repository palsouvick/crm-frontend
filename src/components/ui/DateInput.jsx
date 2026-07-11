import { forwardRef } from "react";
import { Calendar } from "lucide-react";
import clsx from "clsx";
import { inputBaseClasses, inputStateClasses, inputSizeClasses } from "./inputStyles";

const DateInput = forwardRef(
  ({ error = false, size = "md", className = "", ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="date"
          className={clsx(
            inputBaseClasses,
            inputStateClasses(error),
            inputSizeClasses[size],
            "pr-10",
            className
          )}
          {...props}
        />
        <Calendar className="absolute inset-y-0 right-3 my-auto w-4 h-4 text-ink-subtle pointer-events-none" />
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export default DateInput;
