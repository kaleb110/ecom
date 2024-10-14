"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useProductStore from "@/store/zustand";

export function ProductCardComponent() {
  const { products, error, fetchProducts, category } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products by category
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) =>
          product.categories.some((cat) => cat.name === category)
        );

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {filteredProducts.map((product) => {
        const { id, name, price, imageUrl, categories } = product;

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/products/${id}`}>
              <Card className="w-full h-full overflow-hidden transition-all duration-300 hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={imageUrl || ""}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Badge
                          key={category.id}
                          className="bg-primary text-primary-foreground"
                        >
                          {category.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge className="bg-gray-500 text-white">Unknown</Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col pt-2 pb-6 pr-4 pl-2 mt-2">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <div className="text-2xl font-bold text-primary">
                      ${price.toFixed(2)}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
