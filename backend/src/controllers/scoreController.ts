import { Response } from "express";
import { createScoreService, getScoresByUser } from "../services/scoreService";
import { calculateGTS } from "../utils/calculateGTS";
import { scoreSchema } from "../validators/scoreValidator";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export const createScore = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(errorResponse("Unauthorized", 401));
    }

    // Force the userId to be the authenticated user's ID
    const parsed = scoreSchema.parse({ ...req.body, userId: req.user.userId });

    const gts = calculateGTS(parsed.dr, parsed.cf, parsed.pi, parsed.dh, parsed.iv);
    const score = await createScoreService({ ...parsed, gts });

    return res.status(201).json(successResponse(score, "Score created successfully"));
  } catch (err: any) {
    console.error(err);
    if (err.name === "ZodError") {
      return res.status(400).json(errorResponse("Validation failed", 400, err.errors));
    }
    return res.status(500).json(errorResponse(err.message || "Failed to create score"));
  }
};

export const getAllScores = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json(errorResponse("userId is required", 400));

    if (!req.user || req.user.userId !== userId) {
      return res.status(403).json(errorResponse("Forbidden: You can only view your own scores", 403));
    }

    const scores = await getScoresByUser(userId);
    return res.status(200).json(successResponse(scores, "Scores fetched successfully"));
  } catch (err: any) {
    console.error(err);
    return res.status(500).json(errorResponse(err.message || "Failed to fetch scores"));
  }
};
