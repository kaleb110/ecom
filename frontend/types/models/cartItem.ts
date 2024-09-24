import { Cart } from "./cart";
import { Product } from "./product";

export interface CartItem {
  id: number;
  quantity: number;
  cartId: number;
  productId: number;

  cart: Cart;
  product: Product;
}
