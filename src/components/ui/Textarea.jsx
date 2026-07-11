import { forwardRef } from "react";
import clsx from "clsx";
import { inputBaseClasses, inputStateClasses } from "./inputStyles";

const Textarea = forwardRef(
  ({ error = false, rows = 4, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          inputBaseClasses,
          inputStateClasses(error),
          "px-4 py-2.5 text-body",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
