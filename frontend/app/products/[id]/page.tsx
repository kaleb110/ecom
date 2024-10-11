"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import useProductStore from "@/utils/zustand";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/nextjs";

const ProductDetailsComponent = () => {
  const { user } = useUser();
  const {
    fetchProductDetail,
    isLoading,
    error,
    productDetail,
    addToCartOptimistic,
    fetchCartItems,
  } = useProductStore();
  const { id } = useParams();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetail(id);
  }, [fetchProductDetail, id]);

  const clerkUserId = user?.id;

  const handleAddCartButton = async () => {
    if (!clerkUserId) {
      toast({
        title: "Error",
        description: "User not logged in",
        duration: 3000,
      });
      return;
    }

    addToCartOptimistic(clerkUserId, productDetail?.id, quantity);
   
    await fetchCartItems(user.id);

    toast({
      title: "Added to Cart",
      description: `${quantity} ${
        quantity > 1 ? "items" : "item"
      } added to your cart`,
      duration: 3000,
    });
  };

  if (error) return <p>{error}</p>;

  const LoadingSkeleton = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full h-[70vh]" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-1/3" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-12 w-full md:w-1/2" />
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (!productDetail) return <p>No Product</p>;

  const { name, description, price, stock, imageUrl, categories } =
    productDetail;

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 h-[70vh]">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                className="object-cover"
                layout="fill"
                priority
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{name}</h1>
              <div className="flex flex-wrap gap-3">
                {categories.length > 0
                  ? categories.map((category) => (
                      <Badge
                        key={category.name}
                        variant="secondary"
                        className="text-sm"
                      >
                        {category.name}
                      </Badge>
                    ))
                  : "unknown"}
              </div>
            </div>
            <div className="text-4xl font-bold">${price.toFixed(2)}</div>
            <p className="text-gray-500">{description}</p>
            <div className="flex items-center space-x-2">
              {stock ? (
                <Badge variant="default" className="bg-green-500">
                  <Check className="mr-1 h-4 w-4" /> In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <X className="mr-1 h-4 w-4" /> Out of Stock
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button variant="outline" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto"
              disabled={!stock}
              onClick={handleAddCartButton}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add {quantity} to Cart
            </Button>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default ProductDetailsComponent;
