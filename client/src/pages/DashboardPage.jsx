import { useEffect, useState } from "react";
import { LogOut, MoonStar, RefreshCw, Sparkles, SunMedium } from "lucide-react";
import SectionCard from "../components/SectionCard";
import StatCard from "../components/StatCard";
import ModeToggle from "../components/ModeToggle";
import ActivityChart from "../components/ActivityChart";
import DifficultyChart from "../components/DifficultyChart";
import TopicListCard from "../components/TopicListCard";
import StudyPlanCard from "../components/StudyPlanCard";
import TrendChart from "../components/TrendChart";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";
import { formatDelta, formatNumber } from "../lib/utils";

const statAccents = [
  { background: "rgba(95,174,255,0.14)", text: "#cde7ff" },
  { background: "rgba(74,222,128,0.14)", text: "#d9fbe2" },
  { background: "rgba(245,158,11,0.14)", text: "#fde6b2" },
  { background: "rgba(248,113,113,0.14)", text: "#ffd2d2" }
];

const DashboardPage = () => {
  const { token, user, setUser, logout } = useAuth();
  const [mode, setMode] = useState(user?.preferredMode || "internship");
  const [profileInput, setProfileInput] = useState(user?.leetcodeProfileUrl || "");
  const [dashboard, setDashboard] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("leettrack-theme") || "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("leettrack-theme", theme);
  }, [theme]);

  useEffect(() => {
    setProfileInput(user?.leetcodeProfileUrl || "");
  }, [user]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest(`/dashboard?mode=${mode}`, { token });
        setDashboard(response);
        setStudyPlan(response.latestStudyPlan);
      } catch (loadError) {
        setDashboard(null);
        setStudyPlan(null);

        if (!loadError.message.includes("No synced")) {
          setError(loadError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [mode, token]);

  const handleSync = async () => {
    setSyncing(true);
    setError("");

    try {
      const response = await apiRequest("/profile/sync", {
        method: "POST",
        body: {
          profileUrl: profileInput,
          mode
        },
        token
      });

      setUser(response.user);
      const dashboardResponse = await apiRequest(`/dashboard?mode=${mode}`, { token });
      setDashboard(dashboardResponse);
      setStudyPlan(dashboardResponse.latestStudyPlan);
    } catch (syncError) {
      setError(syncError.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    setError("");

    try {
      const response = await apiRequest("/recommendations/generate", {
        method: "POST",
        body: { mode },
        token
      });
      setStudyPlan(response.studyPlan);
    } catch (planError) {
      setError(planError.message);
    } finally {
      setGenerating(false);
    }
  };

  const snapshot = dashboard?.snapshot;

  return (
    <div className="min-h-screen bg-[var(--bg)] px-4 py-6 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(95,174,255,0.24),_transparent_30%),linear-gradient(135deg,rgba(7,11,25,0.95),rgba(15,23,42,0.92))] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">LeetTrack AI Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold lg:text-5xl">
                {snapshot ? `${snapshot.profile.realName || user?.name}, here is your weekly interview signal.` : "Connect your LeetCode profile to unlock insights."}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                Sync your public LeetCode profile, track momentum by week, and generate AI recommendations aligned to your internship or placement goals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className="secondary-button" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button type="button" className="secondary-button" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
              <label className="block">
                <span className="mb-2 block text-sm text-[var(--text-secondary)]">LeetCode profile URL or username</span>
                <input
                  className="auth-input"
                  value={profileInput}
                  onChange={(event) => setProfileInput(event.target.value)}
                  placeholder="https://leetcode.com/u/your-username/"
                />
              </label>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="primary-button" onClick={handleSync} disabled={syncing || !profileInput.trim()}>
                  <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing profile..." : "Sync profile"}
                </button>
                <button type="button" className="secondary-button" onClick={handleGeneratePlan} disabled={generating || !snapshot}>
                  <Sparkles className="h-4 w-4" />
                  {generating ? "Generating..." : "Generate AI plan"}
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur">
              <p className="mb-4 text-sm font-medium text-[var(--text-secondary)]">Preparation mode</p>
              <ModeToggle value={mode} onChange={setMode} />
            </div>
          </div>
        </header>

        {error ? <div className="rounded-[24px] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-white/6 p-8 text-sm text-[var(--text-secondary)]">
            Loading your dashboard...
          </div>
        ) : snapshot ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Solved this week"
                value={snapshot.metrics.solvedThisWeek}
                description={`${formatDelta(snapshot.comparison.delta)} vs previous week`}
                accent={statAccents[0]}
              />
              <StatCard
                label="Total solved"
                value={snapshot.metrics.totalSolved}
                description={`${formatNumber(snapshot.metrics.totalMedium)} medium and ${formatNumber(snapshot.metrics.totalHard)} hard`}
                accent={statAccents[1]}
              />
              <StatCard
                label="Consistency score"
                value={snapshot.metrics.consistencyScore}
                description={`${snapshot.metrics.streak}-day active streak`}
                accent={statAccents[2]}
              />
              <StatCard
                label="Contest rating"
                value={snapshot.contest.rating}
                description={snapshot.contest.rating ? `Top ${snapshot.contest.topPercentage}% globally` : "Contest data unavailable"}
                accent={statAccents[3]}
              />
            </section>

            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <SectionCard title="Overview" eyebrow="Weekly Report">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="text-sm leading-7 text-[var(--text-secondary)]">{snapshot.resumeSummary}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">30-day volume</p>
                        <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{formatNumber(snapshot.metrics.solvedLast30Days)}</p>
                      </div>
                      <div className="rounded-[20px] border border-white/10 bg-black/10 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Active days</p>
                        <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{formatNumber(snapshot.metrics.totalActiveDays)}</p>
                      </div>
                    </div>
                  </div>
                  <DifficultyChart data={snapshot.difficultyBreakdown} />
                </div>
              </SectionCard>

              <SectionCard title="Topic Signals" eyebrow="Strength Analysis">
                <div className="grid gap-4">
                  <TopicListCard
                    title="Strong topics"
                    topics={snapshot.topics.strong}
                    emptyMessage="Solve a few topic-tagged problems to reveal strengths."
                  />
                  <TopicListCard
                    title="Weak topics"
                    topics={snapshot.topics.weak}
                    emptyMessage="More topic diversity will help reveal weak areas."
                  />
                </div>
              </SectionCard>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <SectionCard title="Daily Activity" eyebrow="Consistency Graph">
                <ActivityChart data={snapshot.activity.last30Days} />
              </SectionCard>

              <SectionCard title="Progress Tracker" eyebrow="Weekly Momentum">
                <TrendChart data={dashboard.trend} />
              </SectionCard>
            </div>

            <SectionCard title="Recommendations" eyebrow="AI Coach">
              <StudyPlanCard plan={studyPlan} />
            </SectionCard>

            <SectionCard title="Recent Accepted Submissions" eyebrow="Fresh Signals">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {snapshot.recentSubmissions?.length ? (
                  snapshot.recentSubmissions.map((submission) => (
                    <div key={`${submission.title}-${submission.timestamp}`} className="rounded-[22px] border border-white/10 bg-black/10 p-4">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{submission.title}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{submission.titleSlug}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">No recent accepted submissions available yet.</p>
                )}
              </div>
            </SectionCard>
          </>
        ) : (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/6 p-8 text-sm leading-7 text-[var(--text-secondary)]">
            Add a LeetCode profile URL above and sync it to populate the dashboard, weekly analytics, and recommendation engine.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
