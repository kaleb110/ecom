import { User } from "./user";
import { CartItem } from "./cartItem";

export interface Cart {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  userId: number;
  user: User;

  items: CartItem[];
}
