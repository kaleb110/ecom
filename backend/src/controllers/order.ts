import { Request, Response } from "express";
import { createOrder, getOrders } from "../services/order";
import { Order } from "../types/order";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const order: Order = {...req.body};

    

    console.log("Creating order with data:", req.body); // Log order data

    const orderData = await createOrder(order);

    res.status(201).json(orderData);
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

    console.log("Fetching orders for clerkUserId:", clerkUserId);

    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const orders = await getOrders(clerkUserId);

    console.log("Orders fetched:", orders); 
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message || "Failed to fetch orders" });
  }
};
