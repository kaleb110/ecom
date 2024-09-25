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
  const { resetCart, addOrder, totalAmount } = useProductStore();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // Reset cart after payment
      resetCart(user.id);
    }
  }, [user, isLoaded, resetCart]);

  const handleViewOrder = async () => {
    if (user && totalAmount > 0) {
      // Add order manually after successful payment
      const status = "success"; // Set status as "success" for now
      await addOrder(user.id, status, totalAmount);
    }
    router.push("/order");
  };

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
            <Button className="w-full" onClick={handleViewOrder}>
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
