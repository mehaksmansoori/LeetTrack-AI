const modes = [
  {
    id: "internship",
    label: "Internship Mode",
    description: "Build strong fundamentals and medium-level confidence."
  },
  {
    id: "placement",
    label: "Placement Mode",
    description: "Push into harder patterns and interview-ready depth."
  }
];

const ModeToggle = ({ value, onChange }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {modes.map((mode) => {
      const active = value === mode.id;

      return (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={`rounded-[22px] border p-4 text-left transition ${
            active
              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-white/10 bg-black/10 hover:border-white/20"
          }`}
        >
          <p className="text-sm font-semibold text-[var(--text-primary)]">{mode.label}</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{mode.description}</p>
        </button>
      );
    })}
  </div>
);

export default ModeToggle;
