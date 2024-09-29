"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const searchParams = useSearchParams();

  const [orderCreated, setOrderCreated] = useState(false);
  const sessionId = searchParams.get("session_id"); // Extract session ID from the URL

  useEffect(() => {
    const fetchCartAndCreateOrder = async () => {
      if (isLoaded && user && sessionId) {
        await fetchCartItems(user.id); // Fetch user's cart items
        const { cartItems: updatedCartItems } = useProductStore.getState();

        if (updatedCartItems.length > 0) {
          const total = calculateTotalPrice();

          if (total > 0) {
            const status = "success";
            try {
              // Directly call addOrder with sessionId and cartItems
              await addOrder(
                user.id,
                status,
                total,
                updatedCartItems,
                sessionId
              );
              setOrderCreated(true);
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
  }, [
    user,
    isLoaded,
    sessionId,
    addOrder,
    resetCart,
    calculateTotalPrice,
    fetchCartItems,
  ]);

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
            <p className="text-muted-foreground mb-6">
              {orderCreated
                ? "Your order has been created successfully."
                : "Creating your order..."}
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              className="w-full"
              onClick={() => router.push("/order")}
              disabled={isLoading}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isLoading && cartItems.length > 0
                ? "Creating Order..."
                : "View Order Details"}
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
