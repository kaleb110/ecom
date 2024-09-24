import React, { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,c
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import useProductStore from "@/utils/zustand";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const Cart = () => {
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
    cartId: string,
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    updateCartItemOptimistic(cartId, productId, newQuantity);
  };

  const handleRemoveItemOptimistic = (cartId: number, productId: number) => {
    removeFromCartOptimistic(cartId, productId);
  };

  const handleCheckout = async () => {
    await proceedToCheckout();
  };

  return (
    <div className="flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
            <span className="absolute -top-2 -right-2 h-5 w-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {totalItems}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader className="space-y-2.5">
            <SheetTitle className="text-2xl">Shopping Cart</SheetTitle>
            <SheetDescription>
              You have {totalItems} item(s) in your cart
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="flex-grow mt-6 -mr-4 pr-4">
            <AnimatePresence initial={false}>
              {cartArray.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center justify-between py-4 border-b"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ${item.product.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
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
                        disabled={item.quantity === 1} // Disable if quantity is 1
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
                        handleRemoveItemOptimistic(item.cartId, item.productId)
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
          <SheetFooter className="mt-6">
            <div className="w-full space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? "processing..." : "Checkout"}
              </Button>
              {error && <p>error on checkout</p>}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Cart;
