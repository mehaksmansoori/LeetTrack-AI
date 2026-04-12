import { User } from "../models/User.js";
import { WeeklySnapshot } from "../models/WeeklySnapshot.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchLeetCodeProfile } from "../services/leetcodeService.js";
import { buildSnapshotPayload, getWeekStart } from "../services/analyticsService.js";
import { extractLeetCodeUsername } from "../utils/extractLeetCodeUsername.js";

export const syncProfile = asyncHandler(async (req, res) => {
  const { profileUrl, mode = "internship" } = req.body;

  if (!profileUrl) {
    res.status(400);
    throw new Error("A LeetCode profile URL or username is required.");
  }

  const rawProfile = await fetchLeetCodeProfile(profileUrl);
  const snapshotPayload = buildSnapshotPayload({ rawProfile, mode });
  const weekStart = getWeekStart();

  const snapshot = await WeeklySnapshot.findOneAndUpdate(
    { user: req.user._id, weekStart },
    {
      user: req.user._id,
      leetcodeUsername: rawProfile.username,
      weekStart,
      capturedAt: new Date(),
      ...snapshotPayload
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      leetcodeProfileUrl: profileUrl,
      leetcodeUsername: extractLeetCodeUsername(profileUrl),
      preferredMode: mode,
      lastSyncedAt: new Date()
    },
    { new: true }
  ).select("-password");

  res.json({
    message: "LeetCode profile synced successfully.",
    user,
    snapshot
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const latestSnapshot = await WeeklySnapshot.findOne({ user: req.user._id }).sort({ capturedAt: -1 });

  res.json({
    user: req.user,
    snapshot: latestSnapshot
  });
});
