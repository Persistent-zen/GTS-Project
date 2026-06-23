import { prisma } from "../prismaClient";
import bcrypt from "bcryptjs";

// Helper function to remove password hash from user object
const excludePassword = <User extends { passwordHash: string | null }>(user: User) => {
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Create a new user
export const createUserService = async (data: { name: string; email: string; password: string }) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    },
  });

  return excludePassword(user);
};

// Fetch a single user by ID
export const fetchUserByIdService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user ? excludePassword(user) : null;
};

// Fetch all users
export const fetchAllUsersService = async () => {
  const users = await prisma.user.findMany();
  return users.map(excludePassword);
};

// Fetch user by email (including passwordHash) for auth checks
export const fetchUserByEmailWithPassword = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Verify user in the database
export const verifyUserService = async (id: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: { isVerified: true },
  });
  return excludePassword(user);
};

// Update user details (name, email, password)
export const updateUserService = async (
  id: string,
  data: { name?: string; email?: string; password?: string }
) => {
  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return excludePassword(user);
};
