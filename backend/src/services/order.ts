import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Order, OrderItem } from "../types/order";
export const addOrder = async (orderData: Order) => {
  const { clerkUserId, status, totalAmount } = orderData;

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    return new Error("User Not Found")
  }

  return await prisma.order.create({
    data: {
      userId: user?.id,
      status: status,
      totalAmount: totalAmount,
    },
  });
};

export const addOrderItem = async (orderItemData: OrderItem) => {
  const { orderId, productId, price, quantity } = orderItemData;
  return await prisma.orderItem.create({
    data: {
      orderId: orderId,
      productId: productId,
      price: price,
      quantity: quantity,
    },
  });
};
