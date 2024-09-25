// order
import { getOrders } from "../services/order";
import { Request, Response } from "express";
import { OrderItem } from "../types/order";
import { createOrder } from "../services/order";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, totalAmount, items, status } = req.body;

    if (!clerkUserId || !totalAmount || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing order data" });
    }

    const order = await createOrder({
      clerkUserId,
      totalAmount,
      items,
      status: status || "pending", // Default to pending
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

export const getOrdersByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const { clerkUserId } = req.params;

    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const orders = await getOrders(clerkUserId);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
