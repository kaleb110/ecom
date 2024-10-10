"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCartItem = exports.removeProductFromCart = exports.deleteCartItem = exports.getCartItems = exports.addProductToCart = void 0;
const config_1 = require("../config");
const addProductToCart = (cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkUserId, productId, quantity } = cartItem;
    // Find the user by their Clerk ID
    const user = yield config_1.prisma.user.findUnique({
        where: { clerkUserId },
    });
    if (!user) {
        throw new Error("User not found"); // This error can be logged as needed
    }
    // Create or fetch the user's cart
    const cart = yield config_1.prisma.cart.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }, // Create a new cart if it doesn't exist
    });
    // Check if the product already exists in the cart
    const existingCartItem = yield config_1.prisma.cartItem.findUnique({
        where: {
            cartId_productId: { cartId: cart.id, productId: productId },
        },
    });
    if (existingCartItem) {
        // Update quantity if the item already exists in the cart
        return yield config_1.prisma.cartItem.update({
            where: {
                cartId_productId: { cartId: cart.id, productId: productId },
            },
            data: {
                quantity: { increment: quantity },
            },
        });
    }
    else {
        // Create a new cart item if it doesn't exist
        return yield config_1.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId: productId,
                quantity: quantity,
            },
        });
    }
});
exports.addProductToCart = addProductToCart;
const getCartItems = (clerkUserId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!clerkUserId) {
            throw new Error("Invalid clerkUserId provided");
        }
        // Find the user by their Clerk ID
        const user = yield config_1.prisma.user.findUnique({
            where: { clerkUserId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Fetch the cart
        const cart = yield config_1.prisma.cart.findUnique({
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
    }
    catch (error) {
        console.error("Error fetching cart items:", error.message);
        throw error; // Re-throw to handle in controller
    }
});
exports.getCartItems = getCartItems;
const deleteCartItem = (cartItemId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield config_1.prisma.cartItem.delete({
        where: { id: cartItemId },
    });
});
exports.deleteCartItem = deleteCartItem;
const removeProductFromCart = (cartData) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, productId } = cartData;
    const cart = yield config_1.prisma.cart.findUnique({
        where: { id: Number(cartId) }, // Make sure the `id` is the correct primary key of the cart
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    // Remove the cart item
    yield config_1.prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
            productId: Number(productId),
        },
    });
});
exports.removeProductFromCart = removeProductFromCart;
const updateCartItem = (cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, productId, quantity } = cartItem;
    // First, find the cart by `cartId`
    const cart = yield config_1.prisma.cart.findUnique({
        where: { id: cartId }, // Assuming cartId is the primary key of the cart
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    // Update the cart item or create it if it doesn't exist
    return yield config_1.prisma.cartItem.upsert({
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
});
exports.updateCartItem = updateCartItem;
