import { Router } from "express";
import { getProfile, syncProfile } from "../controllers/profileController.js";

const router = Router();

router.get("/me", getProfile);
router.post("/sync", syncProfile);

export default router;
