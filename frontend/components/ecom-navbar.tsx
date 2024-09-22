"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cart from "@/app/cart/page";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
const categories = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Garden" },
];

export function EcomNavbarComponent() {
  const { signInUser, user: storedUser } = useProductStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isLoaded } = useUser(); // Now this hook is inside a valid React component
  console.log(user);

  useEffect(() => {
    if (isLoaded && user) {
      const clerkUserId = user.id; // Clerk user ID

      // Extract email, prioritizing primaryEmailAddress and fallback to others if necessary
      let email = user.primaryEmailAddress?.emailAddress || null;
      if (!email && user.emailAddresses?.length > 0) {
        email = user.emailAddresses[0]?.emailAddress;
      }

      // Extract name, fallback to "Unknown User" if not available
      let name =
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (!name || name.length === 0) {
        console.warn("No name provided. Using 'Unknown User' as a fallback.");
        name = "Unknown User";
      }

      // Proceed only if we have a valid email
      if (!email || typeof email !== "string") {
        console.error("Invalid email:", email);
        return;
      }

      // Sync user with the backend
      signInUser(clerkUserId, email, name);
    }
  }, [user, isLoaded]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary">ecom</span>
          </div>

          {/* Search bar - hidden on mobile, visible on larger screens */}
          <div className="hidden md:flex flex-1 max-w-3xl mx-4">
            <div
              className={cn(
                "relative w-full transition-all duration-300 ease-in-out rounded-md bg-gray-100",
                searchFocused ? "ring-2 ring-primary" : ""
              )}
            >
              <Select>
                <SelectTrigger className="w-[130px] absolute left-0 top-0 bottom-0 rounded-l-md border-0 bg-transparent focus:ring-0">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-[140px] pr-[90px] h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 bottom-0 rounded-r-md px-3 h-10 hover:bg-gray-200 transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* account */}
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            {/* Cart button */}
            <Cart />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4"
            >
              <div className="flex flex-col space-y-4">
                <div className="relative bg-gray-100 rounded-md">
                  <Select>
                    <SelectTrigger className="w-full border-0 bg-transparent focus:ring-0">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative bg-gray-100 rounded-md">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pr-[90px] h-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-0 bottom-0 rounded-r-md px-3 h-10 hover:bg-gray-200 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
