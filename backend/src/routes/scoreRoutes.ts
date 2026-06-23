import { Router } from "express";
import { getAllScores, createScore } from "../controllers/scoreController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Scores
 *   description: API for managing user scores
 */

/**
 * @swagger
 * /api/score/{userId}:
 *   get:
 *     summary: Get all scores for a user
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: List of scores for the user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No scores found
 */
router.get("/:userId", authMiddleware, getAllScores);

/**
 * @swagger
 * /api/score:
 *   post:
 *     summary: Create a new score entry
 *     tags: [Scores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               dr:
 *                 type: integer
 *               cf:
 *                 type: integer
 *               pi:
 *                 type: integer
 *               dh:
 *                 type: integer
 *               iv:
 *                 type: integer
 *               gts:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Score created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, createScore);

export default router;
