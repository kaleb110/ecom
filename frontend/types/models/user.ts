import { Order } from "./order";
import { Cart } from "./cart";
export interface User {
  id?: number;
  clerkUserId: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Relationships
  orders?: Order[];
  cart?: Cart;
}
