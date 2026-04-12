import OpenAI from "openai";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { env } from "../config/env.js";

const recommendationSchema = z.object({
  summary: z.string(),
  focusAreas: z.array(z.string()).min(3).max(5),
  dailyTargets: z.array(
    z.object({
      day: z.string(),
      target: z.string()
    })
  ).min(5).max(7),
  weeklyPlan: z.array(
    z.object({
      title: z.string(),
      action: z.string()
    })
  ).min(4).max(6),
  recommendedProblems: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
      difficulty: z.enum(["Easy", "Medium", "Hard"])
    })
  ).min(3).max(5),
  coachNote: z.string()
});

const buildPrompt = ({ snapshot, mode }) => {
  const preferenceText =
    mode === "placement"
      ? "Prioritize advanced DSA patterns, contest readiness, and a light system design touchpoint."
      : "Prioritize core DSA fluency, interview confidence, and medium problem progression.";

  return `
You are an interview prep coach helping a student prepare for ${mode} hiring rounds.

Student performance snapshot:
- Total solved: ${snapshot.metrics.totalSolved}
- This week: ${snapshot.metrics.solvedThisWeek}
- Last 30 days: ${snapshot.metrics.solvedLast30Days}
- Difficulty split: Easy ${snapshot.metrics.totalEasy}, Medium ${snapshot.metrics.totalMedium}, Hard ${snapshot.metrics.totalHard}
- Streak: ${snapshot.metrics.streak}
- Consistency score: ${snapshot.metrics.consistencyScore}
- Contest rating: ${snapshot.contest.rating || "N/A"}
- Strong topics: ${snapshot.topics.strong.map((topic) => topic.topic).join(", ") || "N/A"}
- Weak topics: ${snapshot.topics.weak.map((topic) => topic.topic).join(", ") || "N/A"}
- Recent submissions: ${snapshot.recentSubmissions.map((item) => item.title).join(", ") || "N/A"}

Guidance:
- ${preferenceText}
- Keep the plan realistic for one week.
- Balance revision and new practice.
- Mention specific DSA themes and interview outcomes, not generic advice.
- Recommended problems can be canonical titles and do not need URLs.
  `.trim();
};

const buildHeuristicPlan = ({ snapshot, mode }) => {
  const weakTopics = snapshot.topics.weak.map((topic) => topic.topic);
  const focusAreas = [
    weakTopics[0] || "Array and string patterns",
    weakTopics[1] || "Binary search",
    mode === "placement" ? "Dynamic programming depth" : "Medium problem speed",
    mode === "placement" ? "System design foundations" : "Mock interview storytelling"
  ];

  return {
    source: "heuristic",
    summary: `Your recent pace is ${snapshot.metrics.solvedThisWeek} problems this week with a consistency score of ${snapshot.metrics.consistencyScore}. This plan targets ${mode} preparation by strengthening your lowest-coverage topics while preserving momentum in your stronger areas.`,
    focusAreas,
    dailyTargets: [
      { day: "Monday", target: "Solve 2 medium problems from your weakest topic and review alternate approaches." },
      { day: "Tuesday", target: "Do 1 easy warm-up and 2 medium problems focused on implementation speed." },
      { day: "Wednesday", target: "Revise previously solved questions and write pattern notes for reusable tricks." },
      { day: "Thursday", target: mode === "placement" ? "Attempt 1 hard problem and 1 medium variant." : "Solve 3 medium problems from a core interview pattern." },
      { day: "Friday", target: "Complete a 60-minute mixed set to simulate interview pressure." },
      { day: "Saturday", target: mode === "placement" ? "Study one system design concept and solve 2 DSA questions." : "Run a focused revision session and solve 2 confidence-building mediums." },
      { day: "Sunday", target: "Review the week, summarize mistakes, and queue next week's top 5 problems." }
    ],
    weeklyPlan: [
      { title: "Weak topic repair", action: `Spend two sessions on ${focusAreas[0]} and ${focusAreas[1]} with post-problem reflection.` },
      { title: "Interview pacing", action: "Practice timed mediums to reduce hesitation and improve solution articulation." },
      { title: "Revision block", action: "Re-solve 3 earlier questions without hints to reinforce pattern recall." },
      { title: "Progress checkpoint", action: "Compare end-of-week solves and consistency with the previous week before planning ahead." }
    ],
    recommendedProblems: [
      { title: "Two Sum", reason: "Good warm-up for hash map reflexes and explanation clarity.", difficulty: "Easy" },
      { title: "Longest Substring Without Repeating Characters", reason: "Improves sliding window precision for interviews.", difficulty: "Medium" },
      { title: mode === "placement" ? "Word Break" : "3Sum", reason: "Strengthens a classic placement-focused pattern.", difficulty: mode === "placement" ? "Hard" : "Medium" }
    ],
    coachNote: mode === "placement"
      ? "Keep one demanding problem in the week, but do not let hard problems replace volume and revision."
      : "Internship hiring rewards consistency, clarity, and medium-level comfort more than occasional hard spikes."
  };
};

export const generateStudyPlan = async ({ snapshot, mode }) => {
  if (!env.openAiApiKey) {
    return buildHeuristicPlan({ snapshot, mode });
  }

  const client = new OpenAI({ apiKey: env.openAiApiKey });
  const response = await client.responses.parse({
    model: env.openAiModel,
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "You create precise, realistic weekly LeetCode study plans for interview prep."
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildPrompt({ snapshot, mode })
          }
        ]
      }
    ],
    text: {
      format: zodTextFormat(recommendationSchema, "study_plan")
    }
  });

  return {
    source: "openai",
    ...response.output_parsed
  };
};
