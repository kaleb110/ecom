"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Package, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewProductForm from "@/app/(admin)/addproduct/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProductsPage from "../productlist/page";
import useProductStore from "@/store/zustand";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const navItems = [
  { id: "create", label: "Create", icon: PlusCircle },
  { id: "products", label: "Products", icon: Package },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [revenueTimeframe, setRevenueTimeframe] = useState("week");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "mr-2 flex items-center justify-center",
                  activeTab === item.id
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "create" && <NewProductForm />}
              {activeTab === "products" && <ProductsPage />}
              {activeTab === "analytics" && (
                <AnalyticsContent
                  revenueTimeframe={revenueTimeframe}
                  setRevenueTimeframe={setRevenueTimeframe}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const AnalyticsContent = ({ revenueTimeframe, setRevenueTimeframe }) => {
  const { fetchLatestSales, sales, error } = useProductStore();

  const initializeRevenueData = (timeframe: string) => {
    if (timeframe === "week") {
      return [
        { name: "Mon", revenue: 0 },
        { name: "Tue", revenue: 0 },
        { name: "Wed", revenue: 0 },
        { name: "Thu", revenue: 0 },
        { name: "Fri", revenue: 0 },
        { name: "Sat", revenue: 0 },
        { name: "Sun", revenue: 0 },
      ];
    } else if (timeframe === "month") {
      return [
        { name: "Week 1", revenue: 0 },
        { name: "Week 2", revenue: 0 },
        { name: "Week 3", revenue: 0 },
        { name: "Week 4", revenue: 0 },
        { name: "Week 5", revenue: 0 },
      ];
    }
    return [];
  };

  const calculateRevenue = (timeframe: string) => {
    const revenueData = initializeRevenueData(timeframe);

    sales.forEach((sale) => {
      const totalRevenue = sale.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const date = new Date(sale.createdAt);
      if (timeframe === "week") {
        const dayName = date.toLocaleString("en-US", { weekday: "short" });
        const index = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(
          dayName
        );
        if (index !== -1) {
          revenueData[index].revenue += totalRevenue;
        }
      } else if (timeframe === "month") {
        const weekNumber = Math.ceil(date.getDate() / 7) - 1;
        if (weekNumber < revenueData.length) {
          revenueData[weekNumber].revenue += totalRevenue;
        }
      }
    });

    return revenueData;
  };

  const revenueData = {
    week: calculateRevenue("week"),
    month: calculateRevenue("month"),
  };

  useEffect(() => {
    const fetchSalesFunc = async () => {
      try {
        await fetchLatestSales();
      } catch (error) {
        console.error("Error fetching sales", error);
      }
    };

    fetchSalesFunc();
  }, [fetchLatestSales]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.user.name}</TableCell>
                      <TableCell>{sale.items[0].product.name}</TableCell>
                      <TableCell>{sale.address}</TableCell>
                      <TableCell>
                        <Badge>
                          {sale.status.charAt(0).toUpperCase() +
                            sale.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(sale.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        $
                        {(sale.items[0].price * sale.items[0].quantity).toFixed(
                          2
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end space-x-2 mb-4">
            <Button
              variant={revenueTimeframe === "week" ? "default" : "outline"}
              onClick={() => setRevenueTimeframe("week")}
            >
              This Week
            </Button>
            <Button
              variant={revenueTimeframe === "month" ? "default" : "outline"}
              onClick={() => setRevenueTimeframe("month")}
            >
              This Month
            </Button>
          </div>
          <div className="h-[300px] w-full md:w-3/4 lg:w-2/3 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData[revenueTimeframe]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
