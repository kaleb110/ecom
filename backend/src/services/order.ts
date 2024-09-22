import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Order, OrderItem } from "../types/order";
export const addOrder = async (orderData: Order) => {
  const { clerkUserId, status: statusData, totalAmount } = orderData;
  return await prisma.order.create({
    data: {
      userId: 1,
      status: statusData,
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
