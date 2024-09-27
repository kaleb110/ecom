import { prisma } from "../config";
import { User } from "../types/user";

export const getUser = async (clerkUserId: string) => {
  return await prisma.user.findUnique({ where: { clerkUserId } });
};

export const createUser = async (user: User) => {
  const { clerkUserId, email, name } = user;
  return await prisma.user.create({
    data: {
      clerkUserId,
      email,
      name,
    },
  });
};
