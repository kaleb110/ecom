"use client"; // Ensure this is at the top
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Cart from "@/app/cart/page";
import { cn } from "@/lib/utils";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import useProductStore from "@/utils/zustand";
import { useUser } from "@clerk/nextjs";
import { User } from "@/types";
import Link from "next/link";
import useAlgolia from "@/utils/algolia"; // Ensure this imports your custom hook

const categories = [
  { value: "all", label: "All Categories" },
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "books", label: "Books" },
  { value: "home", label: "Home & Garden" },
];

export function EcomNavbarComponent() {
  const { signInUser } = useProductStore();
  const { searchProducts } = useAlgolia(); // Get the search function from the hook
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, isLoaded } = useUser();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    }
  }, [user, isLoaded, signInUser]);

  // Handle the search input and trigger Algolia search
  const handleSearch = async () => {
    if (query.trim() !== "") {
      const results = await searchProducts(query); // Use the search function from the hook
      setSearchResults(results);
    } else {
      setSearchResults([]); // Clear results if query is empty
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-primary">ecom</span>
          </Link>

          {/* Search bar */}
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(); // Trigger search on Enter key
                  }
                }}
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 bottom-0 rounded-r-md px-3 h-10 hover:bg-gray-200 transition-colors"
                onClick={handleSearch} // Use handleSearch for button click
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          </div>

          {/* Account */}
          <div className="flex items-center justify-center gap-4">
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            {/* Dashboard icon */}
            <Link href="/dashboard" passHref>
              <Button variant="ghost" size="icon" className="relative">
                <LayoutDashboard className="h-6 w-6" />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>

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

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden"
            >
              {/* Add mobile menu items here */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Render search results */}
      {searchResults.length > 0 && (
        <div className="absolute bg-white border border-gray-300 w-full mt-1 z-10">
          <ul>
            {searchResults.map((product) => (
              <li key={product.objectID} className="p-2 hover:bg-gray-100">
                <Link href={`/product/${product.objectID}`}>
                  {product.name} - ${product.price}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default EcomNavbarComponent;
