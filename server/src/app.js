import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { requireAuth } from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import { missingRequiredVariables } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "LeetTrack AI API",
    config: {
      ready: missingRequiredVariables.length === 0,
      missing: missingRequiredVariables
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", requireAuth, profileRoutes);
app.use("/api/dashboard", requireAuth, dashboardRoutes);
app.use("/api/recommendations", requireAuth, recommendationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
