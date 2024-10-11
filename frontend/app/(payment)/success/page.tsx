"use client";
import { motion } from "framer-motion";
import { CheckCircle, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const SuccessPageComponent = () => {
  const {
    resetCart,
    addOrder,
    error,
    fetchCartItems,
    calculateTotalPrice,
  } = useProductStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id"); // Extract session ID from the URL


  useEffect(() => {
    const fetchCartAndCreateOrder = async () => {
      if (isLoaded && user && sessionId) {
        await fetchCartItems(user.id); // Fetch user's cart items
        const { cartItems: updatedCartItems } = useProductStore.getState();

        if (updatedCartItems.length > 0) {
          const total = calculateTotalPrice();

          // Fix: Ensure total is a number before comparison
          if (typeof total === "number" && total > 0) {
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
      <Confetti
        width={1200}
        height={400}
        recycle={false}
        numberOfPieces={200}
      />
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
            <Button
              className="w-full"
              onClick={() => router.push("/order")}
            >
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
