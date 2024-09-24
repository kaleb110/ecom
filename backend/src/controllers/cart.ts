// cart
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import {
  addProductToCart,
  deleteCartItem,
  getCartItems,
  removeProductFromCart,
  updateCartItem,
} from "../services/cart";
import { Request, Response } from "express";
import { Cart } from "../types/cart";
import { resetCart } from "../services/cart";

export const addProductToCartController = async (req: Request, res:Response) => {

  const cartItem: Cart = {...req.body}
  try {
    await addProductToCart(cartItem);
    res.status(201).json({ message: "Product added to cart successfully!" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

export const updateCartItemController = async (req: Request, res: Response) => {
  const { cartId, productId, quantity } = req.body; // Extract relevant fields

  try {
    await updateCartItem({ cartId, productId, quantity });
    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ message: "Cannot update cart item!" });
  }
};


export const getCartItemsController = async (req: Request, res: Response) => {
  const {clerkUserId} = req.params;

  try {
    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing clerkUserId" });
    }

    const cartItems = await getCartItems(clerkUserId);
    res.status(200).json(cartItems);
  } catch (error: any) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCartItemController = async (req: Request, res: Response) => {
  const { cartItemId } = req.params;

  try {
    await deleteCartItem(cartItemId);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error happened:", error);
    res.status(500).json({ error: "Cannot delete cart item" });
  }
};

export const removeProductFromCartController = async (
  req: Request,
  res: Response
) => {
  const { cartId, productId } = req.params;

  try {
    await removeProductFromCart({
      cartId: Number(cartId),
      productId: Number(productId),
    }); // Ensure both values are numbers
    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

export const resetCartController = async (req: Request, res: Response) => {
  const { clerkUserId } = req.body;

  try {
    // Find the user by clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    // Find the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart Not Found" });
    }

    // Delete cart items associated with the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res.status(200).json({ message: "Cart reset successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Error resetting cart", details: error.message });
  }
};

