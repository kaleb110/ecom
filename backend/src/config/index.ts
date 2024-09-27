import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

export const PORT = process.env.PORT || 6000;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
export const CLERK_API_KEY = process.env.CLERK_API_KEY;
export const prisma = new PrismaClient();