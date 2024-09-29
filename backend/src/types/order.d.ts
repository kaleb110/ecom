import { CartItem } from "./cart";
export interface Order {
  clerkUserId: string;
  status: string;
  totalAmount: number;
  address: string;
  items: CartItem[] | any[];
}

export interface OrderItem {
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
}
