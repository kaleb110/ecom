"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessPageComponent = () => {
  const {
    resetCart,
    addOrder,
    isLoading,
    error,
    cartItems,
    fetchCartItems,
    calculateTotalPrice,
  } = useProductStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  console.log(cartItems);
  

useEffect(() => {
  const fetchCartAndCreateOrder = async () => {
    // Ensure user is loaded before proceeding
    if (isLoaded && user) {
      console.log("Fetching cart items for user:", user.id);

      // Fetch cart items from your API or store
      await fetchCartItems(user.id); // This function should populate cartItems

      // Re-fetch the latest state after fetching cart items
      const { cartItems: updatedCartItems } = useProductStore.getState();

      // Check if cart items are available
      if (updatedCartItems.length > 0) {
        // Calculate total after fetching cart items
        const total = calculateTotalPrice();
        console.log("Calculated total price:", total);

        // Only create order if totalAmount is greater than 0
        if (total > 0) {
          const status = "success";
          try {
            console.log("Creating order with totalAmount:", total);
            await addOrder(user.id, status, total, updatedCartItems);
            console.log("Order created successfully");

            // Reset cart after successful order creation
            await resetCart(user.id);
          } catch (error) {
            console.error("Error creating order:", error);
          }
        } else {
          console.error("Total amount is zero, cannot create order.");
        }
      } else {
        console.error("Cart items are empty, cannot proceed.");
      }
    }
  };

  fetchCartAndCreateOrder();
}, [user, isLoaded, addOrder, resetCart, calculateTotalPrice, fetchCartItems]);



  const handleContinueShopping = () => {
    router.push("/");
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was successful and your order has been placed.
            </p>
            {error && <p className="text-red-500">{error}</p>}{" "}
            {/* Show error message if any */}
            <Button
              className="w-full"
              onClick={() => router.push("/order")}
              disabled={isLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isLoading && cartItems.length > 0 ? "Creating Order..." : "View Order Details"}
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={handleContinueShopping}
              disabled={isLoading}
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPageComponent;
