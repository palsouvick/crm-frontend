import { forwardRef } from "react";
import clsx from "clsx";

const Radio = forwardRef(({ label, className = "", id, ...props }, ref) => {
  const radio = (
    <input
      ref={ref}
      type="radio"
      id={id}
      className={clsx(
        "w-4 h-4 border-border text-primary-600 accent-primary-600 focus:ring-2 focus:ring-primary-500",
        className
      )}
      {...props}
    />
  );

  if (!label) return radio;

  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-body text-ink cursor-pointer">
      {radio}
      {label}
    </label>
  );
});

Radio.displayName = "Radio";

export default Radio;
