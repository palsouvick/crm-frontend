import clsx from "clsx";

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.[0] ?? "";
  return initials.toUpperCase();
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-panel",
};

const Avatar = ({ name, src, size = "md", shape = "circle", className = "" }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx("object-cover", shapeClasses[shape], sizeClasses[size], className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex items-center justify-center bg-primary-600 text-white font-medium shrink-0",
        shapeClasses[shape],
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </span>
  );
};

export default Avatar;
