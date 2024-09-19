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

const ProductDetailsComponent = () => {
  const {
    fetchProductDetail,
    isLoading,
    error,
    productDetail,
    addToCartOptimistic,
  } = useProductStore();
  const { id } = useParams();
  const { toast } = useToast();

  // State for quantity
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetail(id);
  }, [fetchProductDetail, id]);

  // Replace this with your actual user ID
  const userId = 1; // Set your logged-in user's ID here

  const handleAddCartButton = () => {
    // Optimistically add to cart
    addToCartOptimistic(userId, productDetail.id, quantity);

    // Display the toast notification
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
        <Skeleton className="aspect-square w-full h-full" />
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

  const { name, description, price, stock, imageUrl } = productDetail;
  const category = "car";

  // Function to increase quantity
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Function to decrease quantity
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={imageUrl}
              alt={name}
              className="object-cover w-full h-full"
              width={1200}
              height={400}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{name}</h1>
            {category && (
              <Badge variant="secondary" className="text-sm">
                {category}
              </Badge>
            )}
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

          {/* Quantity Selector */}
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

          {/* Add to Cart Button */}
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
  );
};

export default ProductDetailsComponent;
