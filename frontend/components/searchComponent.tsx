"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import Link from "next/link";
import useProductStore from "@/utils/zustand";
import { Product } from "@/types";

const categories = [
  { value: "all", label: "All" },
  { value: "tech", label: "Tech" },
  { value: "car", label: "Car" },
  { value: "health", label: "Health" },
];

const SearchComponent = () => {
  const { products, chooseCategory } = useProductStore();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (query.trim() !== "") {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredProducts);
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [query, products]);

  const handleProductClick = () => {
    setSearchResults([]);
    setQuery("");
  };

  const handleCategoryChange = (value: string) => {
    chooseCategory(value);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative w-full flex items-center transition-all duration-300 ease-in-out rounded-md bg-gray-100">
        <Select onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[100px] md:w-[130px] h-12 rounded-l-md border-0 bg-transparent focus:ring-0 text-sm md:text-base">
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
          className="flex-grow h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          size="sm"
          variant="ghost"
          className="h-12 px-3 rounded-r-md hover:bg-gray-200 transition-colors"
          onClick={handleSearch}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {searchResults.length > 0 && (
        <div className="absolute bg-white border border-gray-300 w-full mt-1 z-10 rounded-md shadow-lg max-h-80 overflow-y-auto">
          <ul className="py-2">
            {searchResults.map((product: Product) => (
              <li key={product.id} className="px-4 py-2 hover:bg-gray-100">
                <Link
                  href={`/products/${product.id}`}
                  onClick={handleProductClick}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-sm md:text-base">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    ${product.price.toFixed(2)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
