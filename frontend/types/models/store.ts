import { CartItem, Product, User, Order } from "@/types";

export interface Store {
  user: User | null;
  cartItems: CartItem[];
  products: Product[];
  productDetail: Product | null;
  isLoading: boolean;
  error: string | null;
  totalAmount: number;
  orders: Array<Order>;
  sales: Array<Order>;
  category: string;
  chooseCategory: (category: string) => void;
  addProduct: (product: Product) => void;
  signInUser: (userData: User) => void;
  updateCartItemOptimistic: (
    cartId: number,
    productId: number,
    quantity: number
  ) => void;
  fetchProducts: () => void;
  deleteProduct: (productid: number) => void;
  fetchCartItems: (clerkUserId: string) => void;
  removeFromCartOptimistic: (cartId: number, productId: number) => void;
  proceedToCheckout: () => void;
  fetchProductDetail: (id: string | string[]) => void;
  resetCart: (clerkUserId: string) => void;
  addToCartOptimistic: (
    clerkUserId: string,
    productId: number | undefined,
    quantity: number
  ) => void;
  addOrder: (
    clerkUserId: string,
    status: string,
    totalAmount: number,
    cartItems: CartItem[],

    address: string
  ) => void;
  fetchOrders: (clerkUserId: string) => void;
  fetchLatestSales: () => void;
  calculateTotalPrice: () => void;
}
