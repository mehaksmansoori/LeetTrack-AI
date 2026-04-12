const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export const getWeekStart = (date = new Date()) => {
  const value = startOfDay(date);
  const day = value.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  value.setDate(value.getDate() + diff);
  return value;
};

const buildDateRange = (days) => {
  const today = startOfDay(new Date());
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today.getTime() - DAY_IN_MS * (days - index - 1));
    return {
      label: date.toISOString().slice(0, 10),
      timestamp: Math.floor(date.getTime() / 1000)
    };
  });
};

export const parseSubmissionCalendar = (calendarString = "{}") => {
  try {
    const raw = JSON.parse(calendarString);
    return Object.entries(raw).map(([timestamp, count]) => ({
      timestamp: Number(timestamp),
      count: Number(count)
    }));
  } catch {
    return [];
  }
};

export const buildActivitySeries = (calendarEntries, days) => {
  const byDate = new Map(calendarEntries.map((entry) => [entry.timestamp, entry.count]));

  return buildDateRange(days).map(({ label, timestamp }) => ({
    date: label,
    count: byDate.get(timestamp) || 0
  }));
};

export const sumSeries = (series) =>
  series.reduce((total, item) => total + Number(item.count || 0), 0);

export const calculateConsistencyScore = ({ streak = 0, last30Days = [] }) => {
  const activeDays = last30Days.filter((day) => day.count > 0).length;
  const activeDayRatio = activeDays / Math.max(last30Days.length, 1);
  const streakScore = Math.min(streak, 14) / 14;
  const weeklyMomentum = Math.min(sumSeries(last30Days) / 45, 1);

  return Math.round((activeDayRatio * 0.5 + streakScore * 0.25 + weeklyMomentum * 0.25) * 100);
};

export const getDifficultyBreakdown = (submissionStats = []) => {
  const stats = submissionStats.filter((item) => item.difficulty !== "All");

  return stats.map((item) => ({
    difficulty: item.difficulty,
    solved: Number(item.count || 0)
  }));
};

export const summarizeDifficultyBreakdown = (breakdown = []) => {
  const lookup = breakdown.reduce((accumulator, item) => {
    accumulator[item.difficulty.toLowerCase()] = item.solved;
    return accumulator;
  }, {});

  return {
    easy: lookup.easy || 0,
    medium: lookup.medium || 0,
    hard: lookup.hard || 0,
    total: breakdown.reduce((sum, item) => sum + item.solved, 0)
  };
};

export const getTopicInsights = (tagProblemCounts = {}) => {
  const categories = [
    ["fundamental", tagProblemCounts.fundamental || []],
    ["intermediate", tagProblemCounts.intermediate || []],
    ["advanced", tagProblemCounts.advanced || []]
  ];

  const normalized = categories.flatMap(([category, topics]) =>
    topics.map((topic) => ({
      topic: topic.tagName,
      solved: Number(topic.problemsSolved || 0),
      category
    }))
  );

  const allTopics = normalized
    .filter((topic) => topic.solved > 0)
    .sort((left, right) => right.solved - left.solved);

  return {
    all: allTopics,
    strong: allTopics.slice(0, 5),
    weak: [...allTopics].reverse().slice(0, 5).reverse()
  };
};

export const compareWeeks = (last30Days) => {
  const currentWeek = last30Days.slice(-7);
  const previousWeek = last30Days.slice(-14, -7);
  const currentWeekSolved = sumSeries(currentWeek);
  const previousWeekSolved = sumSeries(previousWeek);
  const delta = currentWeekSolved - previousWeekSolved;
  const deltaPercentage =
    previousWeekSolved === 0 ? (currentWeekSolved > 0 ? 100 : 0) : Math.round((delta / previousWeekSolved) * 100);

  return {
    currentWeekSolved,
    previousWeekSolved,
    delta,
    deltaPercentage
  };
};

export const buildResumeSummary = ({ profile, comparison, metrics, strongTopics, mode }) => {
  const topics = strongTopics.slice(0, 3).map((topic) => topic.topic).join(", ");
  const improvement =
    comparison.delta > 0
      ? `improved weekly output by ${comparison.delta} problems`
      : comparison.delta < 0
        ? `is rebuilding momentum after a ${Math.abs(comparison.delta)} problem dip`
        : "maintained a steady week-over-week pace";

  return `${profile.realName || "This candidate"} has solved ${metrics.totalSolved} LeetCode problems with ${metrics.totalMedium} medium and ${metrics.totalHard} hard problems, maintains a ${metrics.streak}-day streak, ${improvement}, and shows strongest depth in ${topics || "core DSA topics"} for ${mode} preparation.`;
};

export const buildSnapshotPayload = ({ rawProfile, mode }) => {
  const difficultyBreakdown = getDifficultyBreakdown(rawProfile.submitStats);
  const difficultySummary = summarizeDifficultyBreakdown(difficultyBreakdown);
  const last30Days = buildActivitySeries(rawProfile.submissionCalendar, 30);
  const last7Days = last30Days.slice(-7);
  const comparison = compareWeeks(last30Days);
  const topics = getTopicInsights(rawProfile.tagProblemCounts);
  const consistencyScore = calculateConsistencyScore({
    streak: rawProfile.streak,
    last30Days
  });

  const metrics = {
    solvedThisWeek: sumSeries(last7Days),
    solvedLast30Days: sumSeries(last30Days),
    totalSolved: difficultySummary.total,
    totalEasy: difficultySummary.easy,
    totalMedium: difficultySummary.medium,
    totalHard: difficultySummary.hard,
    streak: rawProfile.streak,
    totalActiveDays: rawProfile.totalActiveDays,
    consistencyScore
  };

  return {
    profile: {
      realName: rawProfile.profile.realName || rawProfile.username,
      avatar: rawProfile.profile.userAvatar || "",
      ranking: rawProfile.profile.ranking || 0,
      reputation: rawProfile.profile.reputation || 0,
      summary: rawProfile.profile.aboutMe || ""
    },
    metrics,
    comparison,
    activity: {
      last7Days,
      last30Days
    },
    difficultyBreakdown,
    contest: rawProfile.contest,
    topics,
    recentSubmissions: rawProfile.recentSubmissions,
    resumeSummary: buildResumeSummary({
      profile: rawProfile.profile,
      comparison,
      metrics,
      strongTopics: topics.strong,
      mode
    })
  };
};
