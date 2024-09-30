"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import useProductStore from "@/utils/zustand";
import { Product } from "@/types";

export default function ProductsPage() {
  const { user } = useUser();
  const { products, fetchProducts, deleteProduct } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts()
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error fetching products:", error);
          setIsLoading(false);
        });
    }
  }, [user, fetchProducts]);

  const handleEdit = (productId: string) => {
    console.log(`Edit product with id: ${productId}`);
    // Implement edit functionality
  };

  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  if (isLoading) {
    return <ProductTableSkeleton />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductTableSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-[200px] h-[36px] mb-4" />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-[40px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[50px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-[60px]" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-4 w-[60px] ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-[40px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[50px] w-[50px] rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[150px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-[60px]" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
