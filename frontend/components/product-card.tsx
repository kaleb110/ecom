"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import useProductStore from "@/utils/zustand";

export function ProductCardComponent() {
  const { products, error, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="w-full overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
            <CardFooter className="p-4">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => {
        const { id, name, price, description, imageUrl } = product;
        const productId = id.toString();
        const rating = 4; // Assuming a fixed rating for now
        const category = "car"; // Assuming a fixed category for now

        return (
          <motion.div
            key={productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/products/${productId}`}>
              <Card className="w-full h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="relative aspect-w-16 aspect-h-9">
                  <Image
                    src={imageUrl}
                    alt={name}
                    objectFit="cover"
                    className="rounded-t-lg w-full"
                    width={400}
                    height={400}
                  />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    {category}
                  </Badge>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold text-primary">${price.toFixed(2)}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({rating.toFixed(1)})
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}