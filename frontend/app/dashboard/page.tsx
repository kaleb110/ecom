"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Package, ShoppingCart, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewProductForm from "@/app/addproduct/page";
import Orders from "@/app/order/page";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProductsPage from "../productlist/page";

const navItems = [
  { id: "create", label: "Create", icon: PlusCircle },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart },
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
      <main className="flex-1 p-8 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "create" && <NewProductForm />}
            {activeTab === "products" && <ProductsPage />}
            {activeTab === "orders" && <Orders />}
            {activeTab === "analytics" && (
              <AnalyticsContent
                revenueTimeframe={revenueTimeframe}
                setRevenueTimeframe={setRevenueTimeframe}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const AnalyticsContent = ({
  revenueTimeframe,
  setRevenueTimeframe,
}) => {
  const salesData = [
    { customer: "John Doe", item: "Product A", price: 50, quantity: 2 },
    { customer: "Jane Smith", item: "Product B", price: 30, quantity: 3 },
    { customer: "Bob Johnson", item: "Product C", price: 75, quantity: 1 },
    { customer: "Alice Brown", item: "Product A", price: 50, quantity: 1 },
    { customer: "Charlie Davis", item: "Product D", price: 100, quantity: 2 },
  ];

  const revenueData = {
    week: [
      { name: "Mon", revenue: 500 },
      { name: "Tue", revenue: 700 },
      { name: "Wed", revenue: 600 },
      { name: "Thu", revenue: 800 },
      { name: "Fri", revenue: 900 },
      { name: "Sat", revenue: 1200 },
      { name: "Sun", revenue: 1000 },
    ],
    month: [
      { name: "Week 1", revenue: 5000 },
      { name: "Week 2", revenue: 6000 },
      { name: "Week 3", revenue: 7000 },
      { name: "Week 4", revenue: 8000 },
    ],
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((sale, index) => (
                <TableRow key={index}>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.item}</TableCell>
                  <TableCell>${sale.price.toFixed(2)}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>
                    ${(sale.price * sale.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData[revenueTimeframe]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
