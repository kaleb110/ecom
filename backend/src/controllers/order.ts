import { Request, Response } from "express";
import { createOrder, getOrders } from "../services/order";
import { Order } from "../types/order";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { clerkUserId, status, totalAmount, items, sessionId } = req.body; // Receive sessionId and items from the frontend

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    // Retrieve the Stripe session using the sessionId
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["shipping_details"], // Include shipping details
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if shipping details are present in the session
    const shipping = session.shipping_details;

    if (!shipping || !shipping.address) {
      return res
        .status(400)
        .json({ error: "No shipping address found in session" });
    }

    // Create order data from the session
    const orderData = {
      clerkUserId: clerkUserId, // Assuming user ID is set in client_reference_id
      totalAmount: totalAmount, // Total amount in cents
      status: status,
      address: `${shipping.address.line1}, ${shipping.address.city}, ${shipping.address.country}`, // Construct address string
      items, // Pass the items from the frontend
    };

    // Call the service to create the order
    const createdOrder = await createOrder(orderData);

    res.status(201).json(createdOrder); // Return the created order data
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
