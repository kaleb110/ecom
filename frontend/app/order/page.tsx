"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import useProductStore from "@/utils/zustand";
import { Order } from "@/types";

const Orders = () => {
  const { user, isLoaded } = useUser();
  const { orders, fetchOrders, isLoading, error } = useProductStore();

  useEffect(() => {
    if (isLoaded && user?.id) {
      console.log("User ID:", user.id); // Log user ID
      fetchOrders(user.id); // Fetch orders for the logged-in user
    }
  }, [isLoaded, user, fetchOrders]);

  if (isLoading) {
    return <p>Loading orders...</p>; // You could replace this with a loading spinner component
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Styling for error message
  }

  if (orders.length === 0) {
    return <p className="text-gray-500">You have no orders yet.</p>; // Message when no orders exist
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Address</TableHead> {/* New Address Header */}
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
                <TableCell>{order.address || "N/A"}</TableCell>{" "}
                {/* New Address Column */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
