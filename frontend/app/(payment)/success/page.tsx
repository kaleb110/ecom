"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti"; // Import canvas-confetti

const SuccessPageComponent = () => {
  const { resetCart, addOrder, error, fetchCartItems, calculateTotalPrice } =
    useProductStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Function to launch confetti
  const fireConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#bb0000", "#ffffff", "#00ff00"],
      shapes: ["circle", "square"],
    });
  };

  useEffect(() => {
    // Trigger confetti when the order is successfully created
    fireConfetti();
    
    const fetchCartAndCreateOrder = async () => {
      if (isLoaded && user && sessionId) {
        await fetchCartItems(user.id);
        const { cartItems: updatedCartItems } = useProductStore.getState();

        if (updatedCartItems.length > 0) {
          const total = calculateTotalPrice();

          if (typeof total === "number" && total > 0) {
            const status = "success";
            try {
              await addOrder(
                user.id,
                status,
                total,
                updatedCartItems,
                sessionId
              );
              await resetCart(user.id);
            } catch (error) {
              console.error("Error creating order:", error);
            }
          } else {
            console.error("Total amount is invalid, cannot create order.");
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
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was successful and your order has been placed.
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <Button className="w-full" onClick={() => router.push("/order")}>
              <FileText className="mr-2 h-4 w-4" />
              View Order Details
            </Button>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={handleContinueShopping}
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
