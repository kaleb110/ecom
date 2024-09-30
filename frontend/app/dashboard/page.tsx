"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NewProductForm from "@/app/addproduct/page";
import Orders from "@/app/order/page";
import ProductsPage from "../productlist/page";

const navItems = [
  { id: "create", label: "Create", icon: PlusCircle },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn("mr-4", activeTab === item.id && "bg-gray-100")}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
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
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DashboardPage;
