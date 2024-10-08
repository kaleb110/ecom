import { getUser, createUser } from "../services/user";
import { Request, Response } from "express";
import { User } from "../types/user";

// User Controller
export const addUserController = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, email, name }: User = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if the user already exists
    const existingUser = await getUser(clerkUserId);

    if (!existingUser) {
      const newUser = await createUser({
        clerkUserId,
        email,
        name: name || "John Doe",
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


