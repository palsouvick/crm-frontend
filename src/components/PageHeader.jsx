import Button from "./ui/Button";

const PageHeader = ({
  icon,
  title,
  subtitle,
  breadcrumbs,
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
  actions,
}) => {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-caption text-ink-subtle mb-2">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb}
            </span>
          ))}
        </nav>
      )}

      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-h2 font-bold text-ink flex items-center gap-2">
            {icon}
            {title}
          </h1>
          {subtitle && <p className="text-body text-ink-muted mt-1">{subtitle}</p>}
        </div>

        <div className="flex gap-3 items-center">
          {actions}

          {secondaryActionText && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}

          {primaryActionText && (
            <Button variant="primary" onClick={onPrimaryAction}>
              {primaryActionText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
