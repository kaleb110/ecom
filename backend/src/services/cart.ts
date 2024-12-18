import { prisma } from "../config";
import { Cart, CartItem } from "../types/cart";

export const addProductToCart = async (cartItem: Cart) => {
  const { clerkUserId, productId, quantity } = cartItem;

  // Find the user by their Clerk ID
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    throw new Error("User not found"); // This error can be logged as needed
  }

  // Create or fetch the user's cart
  const cart = await prisma.cart.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id }, // Create a new cart if it doesn't exist
  });

  // Check if the product already exists in the cart
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: productId },
    },
  });

  if (existingCartItem) {
    // Update quantity if the item already exists in the cart
    return await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId: productId },
      },
      data: {
        quantity: { increment: quantity },
      },
    });
  } else {
    // Create a new cart item if it doesn't exist
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });
  }
};

export const getCartItems = async (clerkUserId: string) => {
  try {
    if (!clerkUserId) {
      throw new Error("Invalid clerkUserId provided");
    }

    // Find the user by their Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Fetch the cart
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check if the cart exists; if not, return an empty cart
    if (!cart) {
      return { items: [] }; // Return an empty array for items
    }

    return cart; // Return the found cart with items
  } catch (error: any) {
    console.error("Error fetching cart items:", error.message);
    throw error; // Re-throw to handle in controller
  }
};



export const deleteCartItem = async (cartItemId: number) => {
  return await prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};

export const removeProductFromCart = async (cartData: CartItem) => {
  const { cartId, productId } = cartData;

  const cart = await prisma.cart.findUnique({
    where: { id: Number(cartId) }, // Make sure the `id` is the correct primary key of the cart
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Remove the cart item
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
      productId: Number(productId),
    },
  });
};

export const updateCartItem = async (cartItem: CartItem) => {
  const { cartId, productId, quantity } = cartItem;

  // First, find the cart by `cartId`
  const cart = await prisma.cart.findUnique({
    where: { id: cartId }, // Assuming cartId is the primary key of the cart
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Update the cart item or create it if it doesn't exist
  return await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: cart.id, productId: Number(productId) },
    },
    update: {
      quantity: quantity, // Update the quantity if the item already exists
    },
    create: {
      cartId: cart.id,
      productId: Number(productId),
      quantity: Number(quantity), // Create a new item if it doesn't exist
    },
  });
};

