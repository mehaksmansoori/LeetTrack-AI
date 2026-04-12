import { useState } from "react";
import { BrainCircuit, LineChart, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

const AuthPage = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-8 text-[var(--text-primary)]">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(95,174,255,0.30),_transparent_35%),linear-gradient(135deg,rgba(7,11,25,0.95),rgba(16,24,40,0.88))] p-8 lg:p-12">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Full-stack prep intelligence
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight lg:text-6xl">
              LeetTrack AI turns raw LeetCode activity into a real interview roadmap.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[var(--text-secondary)]">
              Sync a public LeetCode profile, track weekly momentum, compare progress, and generate personalized study plans for internships and placements.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: <LineChart className="h-5 w-5" />,
                title: "Weekly analytics",
                copy: "Monitor streaks, activity, consistency, and problem difficulty mix."
              },
              {
                icon: <BrainCircuit className="h-5 w-5" />,
                title: "AI study plans",
                copy: "Get structured next steps tailored to your weak topics and hiring mode."
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "Placement focus",
                copy: "Switch between internship and placement prep without losing context."
              }
            ].map((feature) => (
              <article key={feature.title} className="rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="inline-flex rounded-full bg-white/10 p-3 text-[var(--text-primary)]">{feature.icon}</div>
                <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="flex rounded-full border border-white/10 bg-black/10 p-1">
            {["login", "signup"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMode(item);
                  setError("");
                }}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-medium transition ${
                  mode === item ? "bg-[var(--accent)] text-slate-950" : "text-[var(--text-secondary)]"
                }`}
              >
                {item === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--text-secondary)]">Full name</span>
                <input
                  className="auth-input"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Mehak Sharma"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-secondary)]">Email</span>
              <input
                className="auth-input"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="mehak@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--text-secondary)]">Password</span>
              <input
                className="auth-input"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="At least 6 characters"
              />
            </label>

            {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

            <button type="submit" className="primary-button w-full" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Log in to dashboard" : "Create your account"}
            </button>
          </form>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/10 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">What happens next</p>
            <ol className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
              <li>1. Add a public LeetCode profile URL.</li>
              <li>2. Sync weekly performance analytics and contest context.</li>
              <li>3. Generate an AI study plan tailored to your target hiring path.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
