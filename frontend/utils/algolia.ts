"use client";
import { algoliasearch } from "algoliasearch";
import { useEffect } from "react";
import useProductStore from "./zustand";

// Connect and authenticate with your Algolia app
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY as string
);

// Custom hook for processing records and searching
const useAlgolia = () => {
  const { fetchProducts } = useProductStore();

  // Function to process and index records
  const processRecords = async () => {
    try {
      // Fetch product data from your API
      const products = await fetchProducts();

      if (products.length > 0) {
        // Ensure each product has an `objectID` key for indexing
        const productsToIndex = products.map((product) => ({
          objectID: product.id, // Algolia requires a unique `objectID` for each record
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          // Include any other fields you want to index for searching
        }));

        // Save the products in Algolia, specifying the index name directly
        const result = await client.saveObjects(
          "products_index",
          productsToIndex
        );
        console.log("Successfully indexed products!", result);
      }
    } catch (error) {
      console.error("Error fetching and indexing products:", error);
    }
  };

  // Function to search products in Algolia
const searchProducts = async (query: string) => {
    try {
      const searchResults = await client.search("products_index", query);
      console.log("Search results:", searchResults.hits); // `hits` contains the search results
      return searchResults.hits;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  };

  // Run the indexing process when the component mounts
  useEffect(() => {
    processRecords();
  }, []);

  return { searchProducts };
};

export default useAlgolia;
