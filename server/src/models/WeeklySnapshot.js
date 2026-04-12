import mongoose from "mongoose";

const weeklySnapshotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    leetcodeUsername: {
      type: String,
      required: true
    },
    weekStart: {
      type: Date,
      required: true,
      index: true
    },
    capturedAt: {
      type: Date,
      default: Date.now
    },
    profile: {
      realName: String,
      avatar: String,
      ranking: Number,
      reputation: Number,
      summary: String
    },
    metrics: {
      solvedThisWeek: Number,
      solvedLast30Days: Number,
      totalSolved: Number,
      totalEasy: Number,
      totalMedium: Number,
      totalHard: Number,
      streak: Number,
      totalActiveDays: Number,
      consistencyScore: Number
    },
    comparison: {
      currentWeekSolved: Number,
      previousWeekSolved: Number,
      delta: Number,
      deltaPercentage: Number
    },
    activity: {
      last7Days: [
        {
          date: String,
          count: Number
        }
      ],
      last30Days: [
        {
          date: String,
          count: Number
        }
      ]
    },
    difficultyBreakdown: [
      {
        difficulty: String,
        solved: Number
      }
    ],
    contest: {
      rating: Number,
      attended: Number,
      globalRanking: Number,
      topPercentage: Number
    },
    topics: {
      strong: [
        {
          topic: String,
          solved: Number
        }
      ],
      weak: [
        {
          topic: String,
          solved: Number
        }
      ],
      all: [
        {
          topic: String,
          solved: Number,
          category: String
        }
      ]
    },
    recentSubmissions: [
      {
        title: String,
        titleSlug: String,
        timestamp: String
      }
    ],
    resumeSummary: String
  },
  {
    timestamps: true
  }
);

weeklySnapshotSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export const WeeklySnapshot = mongoose.model("WeeklySnapshot", weeklySnapshotSchema);
