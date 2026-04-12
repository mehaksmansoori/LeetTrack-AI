import { Router } from "express";
import { generateRecommendations, getLatestRecommendation } from "../controllers/recommendationController.js";

const router = Router();

router.get("/latest", getLatestRecommendation);
router.post("/generate", generateRecommendations);

export default router;
