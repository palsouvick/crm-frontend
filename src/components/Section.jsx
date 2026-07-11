const Section = ({ title, description, actions, children }) => (
  <section className="space-y-4">
    {(title || actions) && (
      <div className="flex items-center justify-between">
        <div>
          {title && <h2 className="text-h4 font-semibold text-ink">{title}</h2>}
          {description && <p className="text-body text-ink-muted mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    )}
    {children}
  </section>
);

export default Section;
