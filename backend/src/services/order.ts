import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// Ensure your Prisma client is imported

// : {
//   clerkUserId: string;
//   totalAmount: number;
//   items: { productId: number; quantity: number; price: number }[];
//   status: string; // "pending", "paid", etc.
// }

export const createOrder = async (orderData: any) => {
  const { clerkUserId, totalAmount, items, status } = orderData;

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return new Error("User Not Found!");
  }

  return await prisma.order.create({
    data: {
      userId: user?.id,
      totalAmount: totalAmount,
      status: status,
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });
};

export const getOrders = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return new Error("User Not Found!");
  }

  return await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
};
