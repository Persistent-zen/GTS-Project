import { Request, Response } from "express";
import {
  createUserService,
  fetchUserByIdService,
  fetchAllUsersService,
  verifyUserService,
  updateUserService
} from "../services/userService";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { createUserSchema, updateUserSchema } from "../validators/userValidator";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);
    const user = await createUserService(parsed);
    return res.status(201).json(successResponse(user, "User created successfully"));
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json(errorResponse("Validation failed", 400, error.errors));
    }
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      return res.status(400).json(errorResponse("Email already exists", 400));
    }
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};

// Fetch user by ID
export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const user = await fetchUserByIdService(req.params.id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found", 404));
    }
    return res.status(200).json(successResponse(user, "User fetched successfully"));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};

// Fetch all users
export const fetchAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await fetchAllUsersService();
    return res.status(200).json(successResponse(users, "Users fetched successfully"));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};

// Verify user account
export const verifyUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    if (!req.user || req.user.userId !== userId) {
      return res.status(403).json(errorResponse("Forbidden: You can only verify your own account", 403));
    }

    const user = await verifyUserService(userId);
    return res.status(200).json(successResponse(user, "User account verified successfully"));
  } catch (error: any) {
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};

// Update user details
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.id;
    if (!req.user || req.user.userId !== userId) {
      return res.status(403).json(errorResponse("Forbidden: You can only update your own account", 403));
    }

    const parsed = updateUserSchema.parse(req.body);
    const user = await updateUserService(userId, parsed);
    return res.status(200).json(successResponse(user, "User updated successfully"));
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json(errorResponse("Validation failed", 400, error.errors));
    }
    if (error.code === "P2002") {
      return res.status(400).json(errorResponse("Email already exists", 400));
    }
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};
