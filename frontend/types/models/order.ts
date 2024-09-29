import { User } from "./user";
import { OrderItem } from "./orderItem";

export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  address: string
  createdAt: Date;
  updatedAt: Date;

  userId: number;
  user: User;
  items: OrderItem[];
}
