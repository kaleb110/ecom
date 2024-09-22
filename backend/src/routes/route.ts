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
const router = Router();

// user signup route
router.post("/signin", addUserController);

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

// Order routes
router.post("/orders", addOrderController);
router.post("/orderitem", addOrderItemController);

export default router;
