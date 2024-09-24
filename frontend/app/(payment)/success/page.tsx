"use client";

import { motion } from "framer-motion";
import { CheckCircle, Mail, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessPageComponent = () => {
  const { resetCart, addOrder, calculateTotalPrice, totalAmount } = useProductStore(); // Assuming you have a resetCart action in your Zustand store
  const { user, isLoaded } = useUser(); // Assuming you have a custom hook to fetch user data
  const userEmail = user?.email || "user@example.com"; // Fallback to a default email if not available
  const router = useRouter();

  useEffect(() => {
    const handleResetCart = async () => {
      if (user && isLoaded) {
        await resetCart(user.id); // Call resetCart and wait for it to finish
      }
    };

    handleResetCart();
  }, [user, isLoaded, resetCart]);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleVeiwOrder = () => {
    const status = "success"
    addOrder(user?.id, status, totalAmount);
    router.push("/order");
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
            <div className="space-y-4">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                <span>
                  We have sent a confirmation email to{" "}
                  <strong>{userEmail}</strong>
                </span>
              </div>
              <Button className="w-full" onClick={handleVeiwOrder}>
                <FileText className="mr-2 h-4 w-4" />
                View Order Details
              </Button>
            </div>
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
