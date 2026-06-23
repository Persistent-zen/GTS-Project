// src/prismaClient.ts
import { PrismaClient } from "@prisma/client";

// Use NodeJS.GlobalThis type so TS understands global variables
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Optional: helps in debugging
  });

// Store prisma instance globally only in dev mode to avoid duplicates
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
