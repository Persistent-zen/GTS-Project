import { Router } from "express";
import { getAllScores, createScore } from "../controllers/scoreController";

const router = Router();

router.get("/:userId", getAllScores);
router.post("/", createScore);

export default router;
