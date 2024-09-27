import { prisma } from "../config";
import { CartItem } from "../types/cart";
import { Order } from "../types/order";
export const createOrder = async (orderData: Order) => {
  const { clerkUserId, totalAmount, items, status } = orderData;

  if (!clerkUserId || !totalAmount || !items || items.length === 0) {
    throw new Error("Missing order data");
  }

  console.log("Order data received:", orderData); 

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

  console.log("Orders from database:", orders);
  return orders;
};

