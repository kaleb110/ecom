import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createOrder = async (orderData: {
  clerkUserId: string;
  totalAmount: number;
  items: { productId: number; quantity: number; price: number }[];
  status: string;
}) => {
  const { clerkUserId, totalAmount, items, status } = orderData;

  console.log("Order data received:", orderData); // Log received data

  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    console.error("User not found for clerkUserId:", clerkUserId);
    throw new Error("User Not Found!");
  }

  // Create the order first
  const createdOrder = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      status,
    },
  });

  // Create order items separately
  const orderItems = items.map((item) => ({
    quantity: item.quantity,
    price: item.price,
    orderId: createdOrder.id,
    productId: item.productId,
  }));

  await prisma.orderItem.createMany({ data: orderItems });

  console.log("Order created:", createdOrder); // Log the created order

  return createdOrder;
};

export const getOrders = async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User Not Found!");
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });

  console.log("Orders from database:", orders); // Log the orders from the database
  return orders;
};

