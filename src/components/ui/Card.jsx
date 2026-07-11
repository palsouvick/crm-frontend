import clsx from "clsx";

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const Card = ({ padding = "md", className = "", children, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-surface border border-border rounded-panel shadow-sm",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className = "", children, ...props }) => (
  <div
    className={clsx("px-6 py-4 border-b border-border", className)}
    {...props}
  >
    {children}
  </div>
);

const CardBody = ({ className = "", children, ...props }) => (
  <div className={clsx("p-6", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children, ...props }) => (
  <div
    className={clsx("px-6 py-4 border-t border-border", className)}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
