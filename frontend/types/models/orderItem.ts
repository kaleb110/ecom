import { Order } from "./order";
import { Product } from "./product";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  orderId: number;
  productId: number;

  order: Order;
  product: Product;
}
