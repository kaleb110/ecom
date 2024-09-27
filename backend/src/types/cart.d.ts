export interface Cart {
  clerkUserId: string;
  productId: number;
  quantity: number;
}

export interface CartItem {
  cartId?: number;
  productId?: number;
  quantity?: number;
  price?: number
}