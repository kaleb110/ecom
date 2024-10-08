"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import Cart from "@/app/cart/page";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types";
import Link from "next/link";

export function EcomNavbarComponent() {
  const { signInUser } = useProductStore();
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

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
            <span className="text-2xl font-bold text-primary">ecom</span>
          </Link>

          <div className="flex items-center justify-center gap-4">
            <div>
              <SignedOut>
                <SignInButton>
                  <Button variant="outline">Sign In</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            {isAdmin && (
              <Link href="/dashboard" passHref>
                <Button variant="ghost" size="icon" className="relative">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="sr-only">Dashboard</span>
                </Button>
              </Link>
            )}

            <Cart />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default EcomNavbarComponent;
