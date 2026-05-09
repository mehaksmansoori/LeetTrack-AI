import mongoose from "mongoose";
import { ensureRequiredEnv, env } from "./env.js";

export const connectDatabase = async () => {
  ensureRequiredEnv();

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");

  return mongoose.connection;
};
