"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Eye, FileText, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import useProductStore from "@/store/zustand";
import { Order, OrderItem } from "@/types";

export default function Component() {
  const { user, isLoaded } = useUser();
  const { orders, fetchOrders, error } = useProductStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user?.id) {
      const fetchOrdersFunc = async () => {
        try {
          await fetchOrders(user.id);
        } catch (error) {
          console.error("Error fetching orders", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrdersFunc();
    }
  }, [isLoaded, user, fetchOrders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <OrdersSkeleton />
        ) : orders.length === 0 ? (
          <p className="text-gray-500 p-4">You have no orders yet.</p>
        ) : (
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: Order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{order.address || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Order</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              // TODO: add reciept
                              console.log("View receipt", order.id)
                            }
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            <span>View Receipt</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">
                Order #{selectedOrder.id}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Placed on{" "}
                {format(new Date(selectedOrder.createdAt), "MMM d, yyyy")}
              </p>
              <div className="space-y-4">
                {selectedOrder.items.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={
                          item.product.imageUrl ||
                          "/placeholder.svg?height=50&width=50"
                        }
                        alt={item.product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium">
                  Total: ${selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
