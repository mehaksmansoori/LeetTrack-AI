import { env } from "../config/env.js";
import { extractLeetCodeUsername } from "../utils/extractLeetCodeUsername.js";
import { parseSubmissionCalendar } from "./analyticsService.js";

const PROFILE_QUERY = `
  query publicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        ranking
        reputation
        aboutMe
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      tagProblemCounts {
        advanced {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
        fundamental {
          tagName
          problemsSolved
        }
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
  }
`;

const CALENDAR_QUERY = `
  query publicCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

const RECENT_SUBMISSION_QUERY = `
  query recentAcSubmissions($username: String!) {
    recentAcSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
    }
  }
`;

const requestGraphQl = async (query, variables) => {
  const response = await fetch(env.leetCodeGraphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com/"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`LeetCode request failed with status ${response.status}.`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message || "LeetCode GraphQL query failed.");
  }

  return payload.data;
};

export const fetchLeetCodeProfile = async (profileInput) => {
  const username = extractLeetCodeUsername(profileInput);

  const [profileData, calendarData, recentSubmissionData] = await Promise.all([
    requestGraphQl(PROFILE_QUERY, { username }),
    requestGraphQl(CALENDAR_QUERY, { username }),
    requestGraphQl(RECENT_SUBMISSION_QUERY, { username })
  ]);

  const matchedUser = profileData.matchedUser;

  if (!matchedUser) {
    throw new Error("LeetCode profile not found. Check that the username is public and valid.");
  }

  const calendar = calendarData.matchedUser?.userCalendar;

  return {
    username,
    profile: matchedUser.profile || {},
    submitStats: matchedUser.submitStatsGlobal?.acSubmissionNum || [],
    tagProblemCounts: matchedUser.tagProblemCounts || {},
    languageProblemCount: matchedUser.languageProblemCount || [],
    submissionCalendar: parseSubmissionCalendar(calendar?.submissionCalendar),
    streak: Number(calendar?.streak || 0),
    totalActiveDays: Number(calendar?.totalActiveDays || 0),
    contest: {
      rating: Number(profileData.userContestRanking?.rating || 0),
      attended: Number(profileData.userContestRanking?.attendedContestsCount || 0),
      globalRanking: Number(profileData.userContestRanking?.globalRanking || 0),
      topPercentage: Number(profileData.userContestRanking?.topPercentage || 0)
    },
    recentSubmissions: (recentSubmissionData.recentAcSubmissionList || []).slice(0, 8)
  };
};
