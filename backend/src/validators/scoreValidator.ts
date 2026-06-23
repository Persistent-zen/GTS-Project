import { z } from "zod";

export const scoreSchema = z.object({
  userId: z.string().min(1),
  dr: z.number().min(0).max(100),
  cf: z.number().min(0).max(100),
  pi: z.number().min(0).max(100),
  dh: z.number().min(0).max(100),
  iv: z.number().min(0).max(100),
});
