const TopicListCard = ({ title, topics, emptyMessage }) => (
  <div className="rounded-[22px] border border-white/10 bg-black/10 p-4">
    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{title}</h3>
    <div className="mt-4 space-y-3">
      {topics?.length ? (
        topics.map((topic) => (
          <div key={topic.topic} className="flex items-center justify-between rounded-2xl border border-white/8 px-4 py-3">
            <span className="text-sm text-[var(--text-primary)]">{topic.topic}</span>
            <span className="text-sm text-[var(--text-secondary)]">{topic.solved} solved</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">{emptyMessage}</p>
      )}
    </div>
  </div>
);

export default TopicListCard;
