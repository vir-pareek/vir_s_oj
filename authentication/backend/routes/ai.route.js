import express from "express";
import { getHint } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// This route is protected; only logged-in users can get hints.
router.post("/hint", verifyToken, getHint);

export default router;