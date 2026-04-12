import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    snapshot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeeklySnapshot",
      required: true
    },
    mode: {
      type: String,
      enum: ["internship", "placement"],
      required: true
    },
    source: {
      type: String,
      enum: ["openai", "heuristic"],
      required: true
    },
    summary: String,
    focusAreas: [String],
    dailyTargets: [
      {
        day: String,
        target: String
      }
    ],
    weeklyPlan: [
      {
        title: String,
        action: String
      }
    ],
    recommendedProblems: [
      {
        title: String,
        reason: String,
        difficulty: String
      }
    ],
    coachNote: String
  },
  {
    timestamps: true
  }
);

studyPlanSchema.index({ user: 1, mode: 1, createdAt: -1 });

export const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);
