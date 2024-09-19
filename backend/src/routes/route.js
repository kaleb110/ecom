import { Router } from "express";
import {
  getProductsController,
  searchProductsController,
  addProductController,
  getSingleProductController,
  addProductToCartController,
  getCartItemsController,
  deleteCartItemController,
  postUserController,
  postOrderController,
  postOrderItemController,
  removeProductFromCartController,
  updateCartItemController,
} from "../controllers/controller.js";
const router = Router();

router.get("/products", getProductsController);
router.get("/products/search", searchProductsController);
router.get("/products/:id", getSingleProductController);
router.post("/products/add", addProductController);
router.post("/cart/items", addProductToCartController);
router.put("/cart/items", updateCartItemController);
router.get("/cart/:userId", getCartItemsController);
router.delete("/cart/items/:cartItemId", deleteCartItemController);
router.post("/user", postUserController)
router.post("/orders", postOrderController);
router.post("/orderitem", postOrderItemController);
router.delete("/cart/items/:userId/:productId", removeProductFromCartController);

export default router;
