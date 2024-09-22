import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getUser = async (clerkUserId: string) => {
  return await prisma.user.findUnique({ where: { clerkUserId } });
};

export const createUser = async (userData: { clerkUserId: string; email: string; name: string }) => {
  const { clerkUserId, email, name } = userData;
  return await prisma.user.create({
    data: {
      clerkUserId,
      email,
      name,
    },
  });
};
