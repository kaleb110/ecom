"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import useProductStore from "@/store/zustand";
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
    <div className="grid md:grid-cols-[35%_55%] gap-8 items-start w-full">
      <div className="space-y-4 w-full">
        <Skeleton className="w-full h-[40vh] sm:h-[70vh] rounded-lg" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-10 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
        <Skeleton className="h-12 w-full sm:w-48" />
      </div>
    </div>
  </div>
);

  if (isLoading || !productDetail) return <LoadingSkeleton />;

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
        <div className="grid md:grid-cols-[35%_55%] gap-4 items-start w-full">
          <div className="space-y-4 w-full pr-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 h-[40vh] sm:h-[70vh]">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                className="object-cover"
                layout="fill"
                priority
              />
            </div>
          </div>
          <div className="space-y-4 pl-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0
                  ? categories.map((category) => (
                      <Badge
                        key={category.name}
                        variant="secondary"
                        className="text-xs"
                      >
                        {category.name}
                      </Badge>
                    ))
                  : "unknown"}
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold">
              ${price.toFixed(2)}
            </div>
            <p className="text-sm md:text-base text-gray-500">{description}</p>
            <div className="flex items-center space-x-2">
              {stock ? (
                <Badge variant="default" className="bg-green-500">
                  <Check className="mr-1 h-3 w-3" /> In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <X className="mr-1 h-3 w-3" /> Out of Stock
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="text-lg font-semibold">{quantity}</span>
              <Button variant="outline" size="sm" onClick={increaseQuantity}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto"
              disabled={!stock}
              onClick={handleAddCartButton}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
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
