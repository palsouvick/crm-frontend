import { forwardRef } from "react";
import clsx from "clsx";

const Checkbox = forwardRef(({ label, className = "", id, ...props }, ref) => {
  const checkbox = (
    <input
      ref={ref}
      type="checkbox"
      id={id}
      className={clsx(
        "w-4 h-4 rounded border-border text-primary-600 accent-primary-600 focus:ring-2 focus:ring-primary-500",
        className
      )}
      {...props}
    />
  );

  if (!label) return checkbox;

  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-body text-ink cursor-pointer">
      {checkbox}
      {label}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;
