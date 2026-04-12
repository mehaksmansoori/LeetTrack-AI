import { formatNumber } from "../lib/utils";

const StatCard = ({ label, value, description, accent }) => (
  <article className="rounded-[24px] border border-white/10 p-4">
    <div className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: accent.background, color: accent.text }}>
      {label}
    </div>
    <p className="text-3xl font-semibold text-[var(--text-primary)]">{formatNumber(value)}</p>
    <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
  </article>
);

export default StatCard;
