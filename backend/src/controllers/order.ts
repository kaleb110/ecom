// order
import { addOrder, addOrderItem } from "../services/order";
import { Request, Response } from "express";
import { Order, OrderItem } from "../types/order";

export const addOrderController = async (req: Request, res: Response) => {
  const { clerkUserId, status, totalAmount }: Order = req.body;
  try {
    await addOrder({ clerkUserId, status, totalAmount });
    res.status(201).json({ message: "Order created successfully!" });
  } catch (error: any) {
    console.error("Error happened:", error.message);
    res.status(500).json({ error: "Cannot create order!" });
  }
};

export const addOrderItemController = async (req: Request, res: Response) => {
  const orderItem: OrderItem = { ...req.body };

  try {
    await addOrderItem(orderItem);
    res.status(201).json({ message: "Order item created successfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Cannot create order item!" });
  }
};
