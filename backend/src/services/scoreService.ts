import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createScoreService = async (data: {
  userId: string;
  dr: number;
  cf: number;
  pi: number;
  dh: number;
  iv: number;
  gts: number;
}) => {
  return await prisma.score.create({ data });
};

export const getScoresByUser = async (userId: string) => {
  return await prisma.score.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};
