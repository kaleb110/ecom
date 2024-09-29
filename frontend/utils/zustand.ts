import { create } from "zustand";
import axios from "axios";
import { Product, Store } from "@/types";

const useProductStore = create<Store>((set, get) => ({
  user: null,
  products: [],
  cartItems: [],
  productDetail: null,
  isLoading: false,
  error: null,
  orders: [],
  totalAmount: 0,

  addProduct: async (product: Product) => {
    set({ isLoading: true, error: null });
    try {
      // Sending the product with the uploaded image URL to the backend
      const response = await axios.post(
        "http://localhost:5000/products/add",
        product
      );
      console.log("Product added successfully!", response.data);
    } catch (error) {
      console.error("Failed to add product!", error);
      set({ isLoading: false, error: error.message });
    }
  },
  // Sign in the user on page load
  signInUser: async (userData) => {
    set({ isLoading: true });
    const { clerkUserId, email, name } = userData;
    try {
      const response = await axios.post("http://localhost:5000/signin", {
        clerkUserId,
        email,
        name,
      });
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
      const response = await axios.get("http://localhost:5000/products");
      set({ products: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  // Calculate the total price of the cart items
  calculateTotalPrice: () => {
    const { cartItems } = get();
    const total = cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    set({ totalAmount: total });
    return total; // Ensure it returns the total amount
  },

  // Go to Stripe payment page
  proceedToCheckout: async () => {
    const { cartItems, calculateTotalPrice } = get();
    if (cartItems.length === 0) {
      return set({ error: "No items in cart" });
    }

    try {
      set({ isLoading: true });

      // Calculate total amount and store it in state
      calculateTotalPrice();

      // Proceed to payment
      const response = await axios.post("http://localhost:5000/payment", {
        cartItems,
      });

      const { url } = response.data;
      if (url) {
        window.location.href = url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      set({
        error:
          error?.response?.data?.message ||
          "Checkout failed. Please try again.",
        isLoading: false,
      });
    } finally {
      set({ isLoading: false }); // Always remove loading state after the request
    }
  },

  // Fetch product details for a single product by ID
  fetchProductDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:5000/products/${id}`);
      set({ productDetail: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch product details", isLoading: false });
    }
  },

  // Display a list of cart items on the cart
  fetchCartItems: async (clerkUserId) => {
    set({ isLoading: true, error: null });
    if (!clerkUserId) {
      set({ error: "No clerkUserId provided", isLoading: false });
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/cart/${clerkUserId}`
      );
      if (response.data && response.data.items) {
        set({ cartItems: response.data.items, isLoading: false });
        // Calculate total price whenever cart items are fetched
        get().calculateTotalPrice();
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
      .then(() => {
        get().calculateTotalPrice(); // Recalculate total amount after adding item
      })
      .catch((error) => {
        console.error("Failed to add item to cart:", error);
        // Optionally, implement rollback logic here
      });
  },

  // Optimistically update cart item quantity
  updateCartItemOptimistic: (cartId, productId, quantity) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: quantity } : item
      ),
    }));

    // Make API call to persist the update
    axios
      .put(`http://localhost:5000/cart/items`, {
        cartId,
        productId,
        quantity,
      })
      .then(() => {
        get().calculateTotalPrice(); // Recalculate total amount after updating item
      })
      .catch((error) => {
        console.error("Failed to update cart item:", error);
        // Handle failure and rollback the optimistic update here
      });
  },

  // Optimistically remove an item from the cart
  removeFromCartOptimistic: (cartId, productId) => {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.product.id !== productId
      ),
    }));

    // Make the API call to remove the item from the server
    axios
      .delete(`http://localhost:5000/cart/items/${cartId}/${productId}`)
      .then(() => {
        get().calculateTotalPrice(); // Recalculate total amount after removing item
      })
      .catch((error) => {
        console.error("Failed to remove item from cart:", error);
        // Optionally handle failure and rollback the optimistic removal here
      });
  },

  addOrder: async (clerkUserId, status, totalAmount, cartItems) => {
    if (totalAmount <= 0) {
      throw new Error("Total amount is zero, cannot create order."); // Throw an error for failure
    }

    try {
      set({ isLoading: true, error: null });

      const response = await axios.post("http://localhost:5000/orders", {
        clerkUserId,
        totalAmount,
        status,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });

      if (response.data) {
        // Handle successful order creation
        set((state) => ({
          orders: [...state.orders, response.data],
          cartItems: [], // Clear cart items after order
          totalAmount: 0, // Reset total amount
          isLoading: false,
        }));
      } else {
        throw new Error("Order creation failed.");
      }
    } catch (error) {
      set({ error: "Failed to create order", isLoading: false });
      throw error; // Re-throw the error so it can be caught in `useEffect`
    }
  },

  resetCart: async (clerkUserId) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`http://localhost:5000/cart/reset`, { clerkUserId });
      set({ cartItems: [], isLoading: false });
    } catch (error) {
      console.error("Failed to reset cart:", error);
      set({ error: "Failed to reset cart", isLoading: false });
    }
  },

  fetchOrders: async (clerkUserId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `http://localhost:5000/orders/${clerkUserId}`
      );
      set({ orders: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ error: "Failed to fetch orders", isLoading: false });
    }
  },
}));

export default useProductStore;
