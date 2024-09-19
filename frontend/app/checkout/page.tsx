"use client";

import { useEffect, useState } from "react";
import useProductStore from "@/utils/zustand";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const CheckoutPage = () => {
  const { cartItems, fetchCartItems, calculateTotalPrice } = useProductStore();
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoaded } = useUser(); // Clerk provides `isLoaded` to check if the user data is ready
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch cart items once user is loaded and user.id is available
    if (isLoaded && user) {
      fetchCartItems(user.id);
    }
  }, [fetchCartItems, isLoaded, user]);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          cartItems,
        }),
      });
      const session = await response.json();
      router.push(session.url);
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Something went wrong during checkout",
        duration: 3000,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* Cart Summary */}
      <div className="mt-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border-b"
            >
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {/* Total Price */}
      <div className="mt-4">
        <h2 className="text-xl font-bold">
          Total: ${calculateTotalPrice().toFixed(2)}
        </h2>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || loading}
        className="mt-6 w-full"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </Button>
    </div>
  );
};

export default CheckoutPage;
