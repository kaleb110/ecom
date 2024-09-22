import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set) => ({
  // Store State
  user: null, // authticated user
  products: [], // Stores the product list
  cartItems: [], // Stores the cart items
  productDetail: null, // Stores the detailed product data
  isLoading: false, // Loading state for async operations
  error: null, // Error state to capture errors

  signInUser: async (clerkUserId, email, name) => {
    set({ isLoading: true });

    try {
      // Sync the user with the backend
      const response = await axios.post("http://localhost:5000/signin", {
        clerkUserId,
        email,
        name,
      });

      // Store the user data in Zustand state
      set({ user: response.data, isLoading: false });
    } catch (error) {
      console.error(
        "Error syncing user:",
        error.response?.data || error.message
      );
      set({ error: "Failed to sync user", isLoading: false });
    }
  },

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("http://localhost:5000/products"); // Update with your API endpoint
      set({ products: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  // handleCheckout: async () => {
  //   set({ isLoading: true });

  //   try {
  //     const response = axios.post("http://localhost:5000/api/checkout");
  //     set({})
  //   } catch (error) {
  //     console.error("Error handling checkout")
  //     set({error: "Failed to handle checkout!"})
  //   }
  // },

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

  fetchCartItems: async (clerkUserId: string) => {
    set({ isLoading: true, error: null });

    if (!clerkUserId) {
      set({ error: "No clerkUserId provided", isLoading: false });
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/cart/${clerkUserId}`
      );

      // Validate the response format to avoid potential issues
      if (response.data && response.data.items) {
        set({ cartItems: response.data.items, isLoading: false });
      } else {
        set({ cartItems: [], isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      set({ error: "Failed to fetch cart items!", isLoading: false });
    }
  },

  // Add a product to the cart
  addToCartOptimistic: (clerkUserId, productId, quantity) => {
    set((state) => ({
      cartItems: [
        ...(Array.isArray(state.cartItems) ? state.cartItems : []),
        {
          id: `${clerkUserId}-${productId}`, // Unique ID for the cart item
          quantity,
          product: { id: productId }, // Simplified product structure
        },
      ],
    }));

    // Send the API request to persist the cart addition
    axios
      .post(`http://localhost:5000/cart/items`, {
        clerkUserId,
        productId,
        quantity,
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
        // Optionally, implement rollback logic here
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
  updateCartItemOptimistic: (cartId, productId, quantity) => {
    // Update cart items immediately in state (Optimistic Update)
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: quantity } : item
      ),
    }));

    // Make API call to persist the update
    axios
      .put(`http://localhost:5000/cart/items`, {
        cartId, // cartId should represent the cart's user or the cart itself
        productId,
        quantity,
      })
      .catch((error) => {
        console.error("Failed to update cart item:", error);
        // Optionally handle failure and rollback the optimistic update here
      });
  },

  // Optimistically remove an item from the cart
  removeFromCartOptimistic: (cartId: number, productId: number) => {
    // Optimistically remove the item from the state first
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.product.id !== productId
      ),
    }));

    // Make the API call to remove the item from the server
    axios
      .delete(`http://localhost:5000/cart/items/${cartId}/${productId}`)
      .catch((error) => {
        console.error("Failed to remove item from cart:", error);
        // Optionally handle failure and rollback the optimistic removal here
      });
  },
}));

export default useProductStore;
