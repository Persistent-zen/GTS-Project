import { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responseHandler"; // ✅

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json(errorResponse(err.message || "Internal Server Error"));
};
