import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const paymentController = async (req: Request, res: Response) => {
  const { cartItems } = req.body; // Expecting cartItems from frontend

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "No cart items provided" });
  }

  try {
    let totalAmount = 0; // Initialize totalAmount

    const line_items = cartItems.map((item: any) => {
      const priceInCents = Math.round(item.product.price * 100); // Convert price to cents
      if (typeof priceInCents !== "number" || isNaN(priceInCents)) {
        throw new Error(`Invalid price for item: ${JSON.stringify(item)}`);
      }
      if (typeof item.quantity !== "number" || isNaN(item.quantity)) {
        throw new Error(`Invalid quantity for item: ${JSON.stringify(item)}`);
      }

      totalAmount += priceInCents * item.quantity; // Calculate total amount

      return {
        price_data: {
          currency: "usd", // Change this as per your requirement
          product_data: {
            name: item.product.name, // Product name from cart
          },
          unit_amount: priceInCents, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/success`, // Redirect URL after success
      cancel_url: `${process.env.CLIENT_URL}/cancel`, // Redirect URL after cancel
    });

    // Return session URL and total amount
    res.json({ url: session.url, totalAmount });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};
