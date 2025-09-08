import { Request, Response } from "express";
import * as scoreService from "../services/scoreService";

export const getAllScores = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const scores = await scoreService.getScoresByUser(userId);
    res.json(scores);
  } catch (err: any) {
    console.error("Error fetching scores:", err);
    res.status(500).json({ error: "Failed to fetch scores", details: err.message });
  }
};

export const createScore = async (req: Request, res: Response) => {
  try {
    console.log("Incoming score:", req.body);

    const { userId, dr, cf, pi, dh, iv } = req.body;

    if (!userId || [dr, cf, pi, dh, iv].some((v) => v === undefined)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Compute GTS automatically
    const gts = Math.round(0.4 * dr + 0.3 * cf + 0.15 * pi + 0.1 * dh + 0.05 * iv);

    const newScore = await scoreService.createScore({
      userId,
      dr,
      cf,
      pi,
      dh,
      iv,
      gts,
    });

    res.status(201).json(newScore);
  } catch (err: any) {
    console.error("Error creating score:", err.message);
    console.error(err);
    res.status(500).json({ error: "Failed to create score", details: err.message });
  }
};
