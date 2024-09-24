import { getUser, createUser } from "../services/user";
import { Request, Response } from "express";
// user

export const addUserController = async (req: Request, res: Response) => {
  try {
    const {
      clerkUserId,
      email,
      name,
    }: { clerkUserId: string; email: string; name: string } = req.body;

    // Validate that we have necessary fields
    if (!clerkUserId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the user already exists in your database
    const existingUser = await getUser(clerkUserId);
    if (!existingUser) {
      // Create the user in your database with a fallback name if needed
      const newUser = await createUser({
        clerkUserId,
        email,
        name: name || "Unknown User",
      });

      console.log("New user created:", newUser);
      return res.status(201).json(newUser);
    }

    // Return existing user
    return res.status(200).json(existingUser);
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

