import { prisma } from "../config";
import { CartItem } from "../types/cart";
import { Order } from "../types/order";


export const createOrder = async (orderData: any) => {
  const { clerkUserId, totalAmount, items, status, address } = orderData;

  if (
    !clerkUserId ||
    !totalAmount ||
    !items ||
    items.length === 0 ||
    !address
  ) {
    throw new Error("Missing order data");
  }

  // Find the user by their Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Create the order in the database
  const createdOrder = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount,
      status,
      address,
    },
  });

  // Create order items linked to the order
  const orderItems = items.map((item: any) => ({
    quantity: item.quantity,
    price: item.price,
    orderId: createdOrder.id,
    productId: item.productId,
  }));

  // Bulk create order items
  await prisma.orderItem.createMany({ data: orderItems });

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

export const getLatestOrders = async () => {
  const orders = await prisma.order.findMany({
    where: { status: "success" }, 
    orderBy: { createdAt: "desc" }, 
    take: 5, 
    include: { user: true, items: { include: { product: true } } },
  });

  console.log("Latest orders from database:", orders);
  return orders;
};

