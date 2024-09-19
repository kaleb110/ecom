import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProductsModel = async () => {
  return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
};

export const getSingleProductModel = async (id) => {
  return await prisma.product.findUnique({ where: { id: id } });
};

export const searchProductsModel = async (search, category) => {
  return await prisma.product.findMany({
    where: {
      name: {
        contains: search || "",
        mode: "insensitive",
      },
      category: category || undefined,
    },
  });
};

export const addProductModel = async (product) => {
  const { name, description, price, stock, imageUrl, categoryIds } = product;
  return await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      categories: {
        connect: categoryIds.map((id) => ({ id })), // Link product to categories
      },
    },
  });
};

export const addProductToCartModel = async (product) => {
  const { userId, productId, quantity } = product;

  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });

  if (!existingProduct) {
    throw new Error(`Product with ID ${productId} does not exist`);
  }

  // Find or create a cart for the user
  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  // Check if the cart already contains the product
  const existingCartItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: { cartId: cart.id, productId: parseInt(productId) },
    },
  });

  if (existingCartItem) {
    // Update the quantity of the existing cart item
    return await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId: parseInt(productId) },
      },
      data: {
        quantity: { increment: parseInt(quantity) }, // Ensure quantity is a number
      },
    });
  } else {
    // Create a new cart item if it doesn't exist
    return await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity: parseInt(quantity), // Ensure quantity is a number
      },
    });
  }
};


export const getCartItemsModel = async (userId) => {
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });
};

export const deleteCartItemModel = async (cartItemId) => {
  return await prisma.cartItem.delete({
    where: { id: parseInt(cartItemId) },
  });
};

export const postUserModel = async (userData) => {
  return await prisma.user.create({ data: userData });
};

export const postOrderModel = async (orderData) => {
  return await prisma.order.create({ data: orderData });
};

export const postOrderItemModel = async (orderItemData) => {
  const { orderId, productId } = orderItemData;
  // Check if the product exists
  const existingProduct = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });

  const existingOrder = await prisma.order.findUnique({
    where: { id: parseInt(orderId) },
  });

  if (!existingProduct) {
    throw new Error(`Product with ID ${productId} does not exist`);
  }

  if (!existingOrder) {
    throw new Error(`Order with ID ${orderId} does not exist`);
  }

  return await prisma.orderItem.create({ data: orderItemData });
};

export const removeProductFromCartModel = async (user) => {
  const { userId, productId } = user;

  const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(userId) },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the product from the cart
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId),
        },
      },
    });
  
  return cart
}

export const updateCartItemModel = async (cartData) => {
  const { userId, productId, quantity } = cartData;

  // Find the user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId: parseInt(userId) },
  });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Update the quantity of the product in the cart
  return await prisma.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: parseInt(productId),
      },
    },
    data: {
      quantity: parseInt(quantity),
    },
  });
};