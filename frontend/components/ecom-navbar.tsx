"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import useProductStore from "@/store/zustand";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types";
import Link from "next/link";
import { ShoppingCart, Package } from "lucide-react";

export function EcomNavbarComponent() {
  const { signInUser, cartItems } = useProductStore();
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  const cartArray = Array.isArray(cartItems) ? cartItems : [];

  const totalItems = cartArray.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (isLoaded && user) {
      const clerkUserId = user.id;
      let email = user.primaryEmailAddress?.emailAddress || null;
      if (!email && user.emailAddresses?.length > 0) {
        email = user.emailAddresses[0]?.emailAddress;
      }

      let name =
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (!name || name.length === 0) {
        console.warn("No name provided. Using 'Unknown User' as a fallback.");
        name = "Unknown User";
      }

      if (!email || typeof email !== "string") {
        console.error("Invalid email:", email);
        return;
      }

      const userData: User = { clerkUserId, email, name };
      signInUser(userData);

      if (user.publicMetadata && user.publicMetadata.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, [user, isLoaded, signInUser]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-primary">FetanGebeya</span>
          </Link>

          <div className="flex items-center justify-center gap-4">
            {/* admin dashboard button */}
            {isAdmin && (
              <Link href="/dashboard" passHref>
                <Button variant="ghost" size="icon" className="relative">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="sr-only">Dashboard</span>
                </Button>
              </Link>
            )}

            {/* order button */}
            <Link href="/order">
              <Button
                variant="outline"
                size="icon"
                className={`relative`}
                aria-label="View Orders"
              >
                <Package className="h-5 w-5 text-primary" />
              </Button>
            </Link>

            {/* cart button */}
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
                <span className="absolute -top-2 -right-2 h-5 w-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              </Button>
            </Link>

            {/* user button */}
            <div>
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default EcomNavbarComponent;
