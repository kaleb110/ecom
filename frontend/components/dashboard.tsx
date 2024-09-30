"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Package, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import NewProductForm from '@/app/addproduct/page'
import Orders from '@/app/order/page'

const navItems = [
  { id: 'create', label: 'Create', icon: PlusCircle },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
]

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('create')

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
            {activeTab === "products" && <ProductsContent />}
            {activeTab === "orders" && <Orders />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

const CreateContent = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
    <p>Here you can create a new product. Form components would go here.</p>
  </div>
)

const ProductsContent = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Products List</h2>
    <p>Here you can view and manage your products. A table or grid of products would go here.</p>
  </div>
)

const OrdersContent = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Orders</h2>
    <p>Here you can view and manage orders. An orders table would go here.</p>
  </div>
)

export default DashboardPage