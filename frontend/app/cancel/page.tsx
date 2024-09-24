"use client";

import { motion } from "framer-motion";
import { XCircle, RefreshCcw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation"; // Hook to get query params

const PaymentFailurePageComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the error message from query params (or use a default one)
  const errorMessage =
    searchParams.get("error") ||
    "There was an issue processing your payment. Please try again.";

  return (
    <div className="container max-w-md mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <CardContent className="pt-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage} {/* Display the dynamic error message */}
            </p>
            <div className="space-y-4">
              <Button className="w-full" onClick={() => router.push("/")}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry Payment
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={() => router.push("/")}
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

export default PaymentFailurePageComponent;
