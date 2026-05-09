import dotenv from "dotenv";

dotenv.config();

export const missingRequiredVariables = ["MONGO_URI", "JWT_SECRET"].filter(
  (variable) => !process.env[variable]
);

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5-mini",
  leetCodeGraphqlUrl: process.env.LEETCODE_GRAPHQL_URL || "https://leetcode.com/graphql/"
};

export const ensureRequiredEnv = () => {
  if (missingRequiredVariables.length > 0) {
    throw new Error(`Missing required environment variable: ${missingRequiredVariables.join(", ")}`);
  }
};
