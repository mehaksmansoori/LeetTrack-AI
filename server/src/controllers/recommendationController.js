import { WeeklySnapshot } from "../models/WeeklySnapshot.js";
import { StudyPlan } from "../models/StudyPlan.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateStudyPlan } from "../services/aiRecommendationService.js";

export const generateRecommendations = asyncHandler(async (req, res) => {
  const mode = req.body.mode || req.user.preferredMode || "internship";
  const snapshot = await WeeklySnapshot.findOne({ user: req.user._id }).sort({ capturedAt: -1 });

  if (!snapshot) {
    res.status(404);
    throw new Error("Sync a LeetCode profile before generating recommendations.");
  }

  const recommendation = await generateStudyPlan({ snapshot, mode });
  const studyPlan = await StudyPlan.create({
    user: req.user._id,
    snapshot: snapshot._id,
    mode,
    ...recommendation
  });

  res.status(201).json({
    message: "Study plan generated successfully.",
    studyPlan
  });
});

export const getLatestRecommendation = asyncHandler(async (req, res) => {
  const mode = req.query.mode || req.user.preferredMode || "internship";
  const studyPlan = await StudyPlan.findOne({ user: req.user._id, mode }).sort({ createdAt: -1 });

  if (!studyPlan) {
    return res.status(404).json({
      message: "No study plan found yet for this mode."
    });
  }

  res.json({
    studyPlan
  });
});
