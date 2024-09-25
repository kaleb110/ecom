import { Request, Response } from "express";
import { createOrder, getOrders } from "../services/order";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, totalAmount, items, status } = req.body;

    if (!clerkUserId || !totalAmount || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing order data" });
    }

    console.log("Creating order with data:", req.body); // Log order data

    const order = await createOrder({
      clerkUserId,
      totalAmount,
      items,
      status: status || "pending", // Default to pending
    });

    res.status(201).json(order);
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
};


export const getOrdersByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { clerkUserId } = req.params;

    console.log("Fetching orders for clerkUserId:", clerkUserId); // Log the received user ID

    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const orders = await getOrders(clerkUserId);

    console.log("Orders fetched:", orders); // Log fetched orders
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
};
