const SectionCard = ({ title, eyebrow, action, children, className = "" }) => (
  <section className={`rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl ${className}`}>
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{eyebrow}</p> : null}
        <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default SectionCard;
