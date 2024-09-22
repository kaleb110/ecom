export interface Order {
  clerkUserId: string;
  status: string;
  totalAmount: number;
}

export interface OrderItem {
  orderId: number;
  productId: number;
  price:  number;
  quantity: number;
}