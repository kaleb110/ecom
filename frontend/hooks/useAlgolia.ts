"use client";

import { algoliasearch } from "algoliasearch";

// Connect and authenticate with your Algolia app (using Search API Key)
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY! // Search API Key
);

// Custom hook for searching products
const useAlgolia = () => {
  // Function to search products in Algolia
  const searchProducts = async (query: string) => {
    try {
      const index = searchClient.initIndex("products");
      const searchResults = await index.search(query);
      console.log("Search results:", searchResults.hits);
      return searchResults.hits;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  return { searchProducts };
};

export default useAlgolia;
