"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const product_1 = require("../controllers/product");
const cart_1 = require("../controllers/cart");
const order_1 = require("../controllers/order");
const validate_1 = require("../middlewares/validate");
const validator_1 = require("../validator/validator");
const stripe_1 = require("../controllers/stripe");
const cart_2 = require("../controllers/cart");
const router = (0, express_1.Router)();
// Product routes
router.get("/products", product_1.getProductsController);
// router.get("/products/search", searchProductsController);
router.get("/products/:id", product_1.getSingleProductController);
router.delete("/products/:id", product_1.deleteProductController);
router.post("/products/add", validator_1.addProductValidator, validate_1.validate, product_1.addProductController);
// Cart routes
router.post("/cart/items", cart_1.addProductToCartController);
router.put("/cart/items", cart_1.updateCartItemController);
router.get("/cart/:clerkUserId", cart_1.getCartItemsController);
router.delete("/cart/items/:cartItemId", cart_1.deleteCartItemController);
router.delete("/cart/items/:cartId/:productId", cart_1.removeProductFromCartController);
//TODO: reset cart 
router.post("/cart/reset", cart_2.resetCartController);
// Order routes
router.post("/orders", order_1.createOrderController);
router.get("/orders/:clerkUserId", order_1.getOrdersByUserController);
router.get("/sales", order_1.getLatestOrdersController);
// user signup route
router.post("/signin", user_1.addUserController);
// stripe payment
router.post("/payment", stripe_1.paymentController);
exports.default = router;
