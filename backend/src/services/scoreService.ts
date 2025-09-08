import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createScore = async (data: {
  userId: string;
  dr: number;
  cf: number;
  pi: number;
  dh: number;
  iv: number;
  gts: number;
}) => {
  try {
    const newScore = await prisma.score.create({
      data,
    });
    return newScore;
  } catch (err) {
    console.error("Prisma createScore error:", err);
    throw err;
  }
};

export const getScoresByUser = async (userId: string) => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return scores;
  } catch (err) {
    console.error("Prisma getScoresByUser error:", err);
    throw err;
  }
};
