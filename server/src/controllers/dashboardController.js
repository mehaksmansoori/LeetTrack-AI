import { WeeklySnapshot } from "../models/WeeklySnapshot.js";
import { StudyPlan } from "../models/StudyPlan.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const mode = req.query.mode || req.user.preferredMode || "internship";

  const [latestSnapshot, history, latestStudyPlan] = await Promise.all([
    WeeklySnapshot.findOne({ user: req.user._id }).sort({ capturedAt: -1 }),
    WeeklySnapshot.find({ user: req.user._id })
      .sort({ weekStart: -1 })
      .limit(8)
      .select("weekStart metrics comparison"),
    StudyPlan.findOne({ user: req.user._id, mode }).sort({ createdAt: -1 })
  ]);

  if (!latestSnapshot) {
    return res.status(404).json({
      message: "No synced LeetCode data found yet. Sync a profile to unlock the dashboard."
    });
  }

  res.json({
    snapshot: latestSnapshot,
    trend: history.reverse().map((entry) => ({
      weekStart: entry.weekStart.toISOString().slice(0, 10),
      solvedThisWeek: entry.metrics.solvedThisWeek,
      consistencyScore: entry.metrics.consistencyScore
    })),
    latestStudyPlan
  });
});
