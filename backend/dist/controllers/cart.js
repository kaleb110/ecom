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
exports.resetCartController = exports.removeProductFromCartController = exports.deleteCartItemController = exports.getCartItemsController = exports.updateCartItemController = exports.addProductToCartController = void 0;
const config_1 = require("../config");
const cart_1 = require("../services/cart");
const addProductToCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItem = Object.assign({}, req.body);
    try {
        yield (0, cart_1.addProductToCart)(cartItem);
        res.status(201).json({ message: "Product added to cart successfully!" });
    }
    catch (error) {
        console.error("Error happened:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
});
exports.addProductToCartController = addProductToCartController;
const updateCartItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItem = Object.assign({}, req.body);
    try {
        yield (0, cart_1.updateCartItem)(cartItem);
        res.status(200).json({ message: "Cart item updated successfully" });
    }
    catch (error) {
        console.error("Error happened:", error);
        res.status(500).json({ message: "Cannot update cart item!" });
    }
});
exports.updateCartItemController = updateCartItemController;
const getCartItemsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkUserId } = req.params;
    try {
        if (!clerkUserId) {
            return res.status(400).json({ error: "Missing clerkUserId" });
        }
        const cartItems = yield (0, cart_1.getCartItems)(clerkUserId);
        res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items:", error.message);
        res.status(500).json({ error: error.message });
    }
});
exports.getCartItemsController = getCartItemsController;
const deleteCartItemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId } = req.params;
    try {
        yield (0, cart_1.deleteCartItem)(cartId);
        res.status(200).json({ message: "Item removed from cart" });
    }
    catch (error) {
        console.error("Error happened:", error);
        res.status(500).json({ error: "Cannot delete cart item" });
    }
});
exports.deleteCartItemController = deleteCartItemController;
const removeProductFromCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cartId, productId } = req.params;
    try {
        yield (0, cart_1.removeProductFromCart)({ cartId, productId }); // Ensure both values are numbers
        res.status(200).json({ message: "Product removed from cart" });
    }
    catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ message: "Failed to remove product from cart" });
    }
});
exports.removeProductFromCartController = removeProductFromCartController;
const resetCartController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clerkUserId } = req.body;
    try {
        // Find the user by clerkUserId
        const user = yield config_1.prisma.user.findUnique({
            where: { clerkUserId },
        });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        // Find the user's cart
        const cart = yield config_1.prisma.cart.findUnique({
            where: { userId: user.id },
        });
        if (!cart) {
            return res.status(404).json({ error: "Cart Not Found" });
        }
        // Delete cart items associated with the cart
        yield config_1.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return res.status(200).json({ message: "Cart reset successfully" });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: "Error resetting cart", details: error.message });
    }
});
exports.resetCartController = resetCartController;
