import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Reusable password field with a show/hide toggle. Forwards its ref so it
// can be wired up directly to react-hook-form's register().
const PasswordInput = forwardRef(({ error, className = "", ...props }, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={`w-full px-4 py-3 pr-11 border rounded-lg outline-none transition focus:ring-2 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300 focus:ring-indigo-500"
        } ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none focus:text-indigo-600"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
