import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set) => ({
  // Store State
  products: [], // Stores the product list
  cartItems: [], // Stores the cart items
  productDetail: null, // Stores the detailed product data
  isLoading: false, // Loading state for async operations
  error: null, // Error state to capture errors

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true, error: null }); // Set loading state
    try {
      const response = await axios.get("http://localhost:5000/products");
      set({ products: response.data, isLoading: false }); // Update products and reset loading state
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false }); // Handle error
    }
  },

  // Fetch product details for a single product by ID
  fetchProductDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      set({ productDetail: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch product details", isLoading: false });
    }
  },

  // Fetch cart items for a specific user
  fetchCartItems: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/cart/${userId}`);
      set({ cartItems: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch cart items!", isLoading: false });
    }
  },

  // Add a product to the cart
  addToCartOptimistic: (userId, productId, quantity) => {
    set((state) => ({
      // Ensure we spread the existing cartItems array
      cartItems: [
        ...(Array.isArray(state.cartItems) ? state.cartItems : []), // Ensure cartItems is always an array
        {
          id: productId,
          quantity,
          product: { id: productId }, // Simplified product structure
        },
      ],
    }));

    // Send the API request to persist the cart addition
    axios
      .post(`http://localhost:5000/cart/items`, {
        userId,
        productId,
        quantity,
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
        // Optionally, you can implement rollback logic here
      });
  },

  // Calculate the total price of the cart items
  calculateTotalPrice: (cartItems = []) => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  // Optimistically update cart item quantity
  updateCartItemOptimistic: (cartId, productId, newQuantity) => {
    // Update cart items immediately in state
    set((state) => ({
      cartItems: {
        ...state.cartItems,
        items: state.cartItems.items.map((item) =>
          item.cartId === cartId && item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        ),
      },
    }));

    // Make API call to persist the update
    axios
      .put(`http://localhost:5000/cart/items`, {
        userId: cartId,
        productId,
        quantity: newQuantity,
      })
      .catch(() => {
        // Optionally handle failure and rollback the optimistic update
      });
  },

  // Optimistically remove an item from the cart
  removeFromCartOptimistic: (cartId, productId) => {
    // Optimistically remove the item from the state first
    set((state) => ({
      cartItems: {
        ...state.cartItems,
        items: state.cartItems.items.filter(
          (item) => item.cartId !== cartId || item.productId !== productId
        ),
      },
    }));

    // Make the API call to remove the item from the server
    axios
      .delete(`http://localhost:5000/cart/items/${cartId}/${productId}`)
      .catch(() => {
        // Optionally handle failure and rollback the optimistic removal
      });
  },
}));

export default useProductStore;
