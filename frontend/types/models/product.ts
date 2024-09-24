import { CartItem } from "./cartItem";
import { OrderItem } from "./orderItem";
import { ProductCategory } from "./productCategory";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;

  categories: ProductCategory[];
  cartItems: CartItem[];
  orders: OrderItem[];
}
