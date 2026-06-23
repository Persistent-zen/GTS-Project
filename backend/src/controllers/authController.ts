import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validators/authValidator";
import { fetchUserByEmailWithPassword } from "../services/userService";
import { successResponse, errorResponse } from "../utils/responseHandler";

export const login = async (req: Request, res: Response) => {
  try {
    // Validate inputs
    const parsed = loginSchema.parse(req.body);

    // Find user by email
    const user = await fetchUserByEmailWithPassword(parsed.email);
    if (!user) {
      return res.status(401).json(errorResponse("Invalid email or password", 401));
    }

    // Check password
    if (!user.passwordHash) {
      return res.status(401).json(errorResponse("Invalid email or password", 401));
    }
    
    const isPasswordValid = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse("Invalid email or password", 401));
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || "supersecretkey";
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "24h" });

    // Return JWT and user info (excluding password hash)
    const { passwordHash, ...userWithoutPassword } = user;

    return res.status(200).json(
      successResponse(
        {
          token,
          user: userWithoutPassword,
        },
        "Login successful"
      )
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json(errorResponse("Validation failed", 400, error.errors));
    }
    return res.status(500).json(errorResponse(error.message || "Internal Server Error", 500));
  }
};
