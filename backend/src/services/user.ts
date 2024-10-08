// Service: user.ts
import { prisma } from "../config";
import { User } from "../types/user";

// Fetch user by Clerk ID or Email
export const getUser = async (clerkUserId: string) => {
  return await prisma.user.findUnique({ where: { clerkUserId } });
};

// Create or fetch user
// Service: user.ts

// Create or fetch user
export const createUser = async (user: User) => {
  const { clerkUserId, email, name } = user;

  try {
    // Check if the user already exists by Clerk ID or Email
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkUserId: clerkUserId },
          { email: email },
        ],
      },
    });

    if (existingUser) {
      return existingUser; // User already exists, return it
    }

    // Create a new user in the database if not exists
    return await prisma.user.create({
      data: {
        clerkUserId,
        email,
        name: name || "John Doe", // Default name if none provided
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Unable to create user."); // Throw an error to handle in controller
  }
};
