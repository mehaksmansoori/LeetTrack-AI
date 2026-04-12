const StudyPlanCard = ({ plan }) => {
  if (!plan) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/15 bg-black/10 p-6 text-sm text-[var(--text-secondary)]">
        Generate a plan to get personalized next steps, daily targets, and interview-focused topic recommendations.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--text-muted)]">AI Summary</p>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{plan.summary}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Focus Areas</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {plan.focusAreas.map((focus) => (
              <span key={focus} className="rounded-full border border-white/10 px-3 py-2 text-sm text-[var(--text-primary)]">
                {focus}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Coach Note</h3>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{plan.coachNote}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-[22px] border border-white/10 bg-black/10 p-5 xl:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Weekly Plan</h3>
          <div className="mt-4 space-y-3">
            {plan.weeklyPlan.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/8 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.action}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Daily Targets</h3>
          <div className="mt-4 space-y-3">
            {plan.dailyTargets.map((item) => (
              <div key={item.day} className="rounded-2xl border border-white/8 px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.day}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.target}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-white/10 bg-black/10 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">Suggested Problems</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {plan.recommendedProblems.map((problem) => (
            <div key={`${problem.title}-${problem.difficulty}`} className="rounded-2xl border border-white/8 px-4 py-4">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{problem.title}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{problem.difficulty}</p>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">{problem.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanCard;
