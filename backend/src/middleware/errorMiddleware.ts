import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHandler"; // ✅

export const validationErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "ZodError") {
    return res.status(400).json(errorResponse("Validation failed", 400, err.errors));
  }
  return res.status(500).json(errorResponse(err.message || "Internal Server Error"));
};
