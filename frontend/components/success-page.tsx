"use client"

import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPageComponent = () => {
  const {
    resetCart,
    addOrder,
    isLoading,
    error,
    fetchCartItems,
    calculateTotalPrice,
  } = useProductStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchCartAndCreateOrder = async () => {
      if (isLoaded && user && sessionId) {
        await fetchCartItems(user.id);
        const { cartItems: updatedCartItems } = useProductStore.getState();

        if (updatedCartItems.length > 0) {
          const total = calculateTotalPrice();

          if (typeof total === "number" && total > 0) {
            const status = "success";
            try {
              await addOrder(user.id, status, total, updatedCartItems, sessionId);
              await resetCart(user.id);
              
              // Show celebration toast
              toast({
                title: (
                  <div className="flex items-center">
                    <PartyPopper className="w-5 h-5 mr-2 text-yellow-400" />
                    Order Placed Successfully!
                  </div>
                ),
                description: "Thank you for your purchase!",
                duration: 5000,
              });
            } catch (error) {
              console.error("Error creating order:", error);
              toast({
                title: "Oops! Something went wrong.",
                description: "We couldn't process your order. Please try again.",
                variant: "destructive",
              });
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
  }, [user, isLoaded, sessionId, addOrder, resetCart, calculateTotalPrice, fetchCartItems, toast]);

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
        <Card className="text-center shadow-lg">
          <CardContent className="pt-10 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment was successful and your order has been placed.
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button
              className="w-full text-lg py-6"
              onClick={() => router.push("/order")}
              disabled={isLoading}
            >
              <FileText className="mr-2 h-5 w-5" />
              View Order Details
            </Button>
          </CardContent>
          <CardFooter className="justify-center pb-8">
            <Button
              variant="outline"
              size="lg"
              className="text-base"
              onClick={handleContinueShopping}
              disabled={isLoading}
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuccessPageComponent;