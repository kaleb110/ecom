import { Router } from "express";
import { addUserController } from "../controllers/user";
import {
  getProductsController,
  addProductController,
  getSingleProductController,
} from "../controllers/product";
import {
  addProductToCartController,
  deleteCartItemController,
  getCartItemsController,
  removeProductFromCartController,
  updateCartItemController,
} from "../controllers/cart";
import {
  addOrderController,
  addOrderItemController,
} from "../controllers/order";
import { validate } from "../middlewares/validate";
import { addProductValidator } from "../validator/validator";
import { paymentController } from "../controllers/stripe";
import { resetCartController } from "../controllers/cart";

const router = Router();
// user signup route
router.post("/signin", addUserController);

// stripe payment
router.post("/payment", paymentController)

// Product routes
router.get("/products", getProductsController);
// router.get("/products/search", searchProductsController);
router.get("/products/:id", getSingleProductController);
router.post(
  "/products/add",
  addProductValidator,
  validate,
  addProductController
);

// Cart routes
router.post("/cart/items", addProductToCartController);
router.put("/cart/items", updateCartItemController);
router.get("/cart/:clerkUserId", getCartItemsController);
router.delete("/cart/items/:cartItemId", deleteCartItemController);
router.delete(
  "/cart/items/:cartId/:productId",
  removeProductFromCartController
);
//TODO: reset cart 
router.post("/cart/reset", resetCartController)
// Order routes
router.post("/orders", addOrderController);
router.post("/orderitem", addOrderItemController);

export default router;
