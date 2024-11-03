"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@clerk/nextjs";

export function LandingPageComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">FetanGebeya</div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome to FetanGebeya
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8"
          >
            Your one-stop destination for hassle-free online shopping. Join us
            today and experience the ease of modern e-commerce.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SignInButton>
              <Button size="lg">Sign In</Button>
            </SignInButton>
          </motion.div>
        </div>

        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ShopEase?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-6 w-6" />
                  Wide Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Browse through thousands of products from top brands and local
                  sellers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-6 w-6" />
                  Fast Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Enjoy quick and reliable delivery right to your doorstep.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-6 w-6" />
                  Secure Shopping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Shop with confidence knowing your information is protected.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-24">
          <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of satisfied customers and experience the ShopEase
              difference today.
            </p>
            <SignInButton>
              <Button size="lg" variant="secondary">
                Sign In Now
              </Button>
            </SignInButton>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div>
            <h3 className="font-bold mb-4 text-center">Follow Us</h3>
            <ul className="flex justify-center space-x-4">
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p>&copy; 2024 FetanGebeya. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
