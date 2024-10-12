"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "@/utils/zustand";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { CartItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const {
    fetchCartItems,
    cartItems,
    updateCartItemOptimistic,
    removeFromCartOptimistic,
    proceedToCheckout,
    isLoading,
    error,
  } = useProductStore();

  const { user, isLoaded } = useUser();

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchCartItems(user.id);
    }
  }, [isLoaded, user, fetchCartItems]);

  const cartArray = Array.isArray(cartItems) ? cartItems : [];

  const totalItems = cartArray.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartArray.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const updateQuantityOptimistic = (
    cartId: number,
    productId: number,
    quantity: number
  ) => {
    if (quantity < 1) return;
    updateCartItemOptimistic(cartId, productId, quantity);
  };

  const handleRemoveItemOptimistic = (cartId: number, productId: number) => {
    removeFromCartOptimistic(cartId, productId);
  };

  const handleCheckout = async () => {
    setProcessing(true);
    await proceedToCheckout();
    setProcessing(false);
  };

  const CartItemSkeleton = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
        <Skeleton className="w-24 h-24 rounded-md" />
        <div>
          <Skeleton className="h-4 w-[150px] mb-2" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {isLoading && !processing ? (
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              {[...Array(3)].map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </div>
          ) : cartArray.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
              <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-600">
                Your cart is empty
              </p>
              <p className="text-gray-500 mt-2">
                Add some items to get started!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-auto max-h-[calc(100vh-200px)] pr-4">
              <AnimatePresence initial={false}>
                {cartArray.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantityOptimistic(
                              item.cartId,
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity === 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantityOptimistic(
                              item.cartId,
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() =>
                          handleRemoveItemOptimistic(
                            item.cartId,
                            item.productId
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-muted p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Price:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={cartArray.length === 0 || processing}
            >
              {isLoading && processing
                ? "Processing..."
                : "Proceed to Checkout"}
            </Button>
            {error && (
              <p className="text-destructive text-sm mt-2">Error on checkout</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
