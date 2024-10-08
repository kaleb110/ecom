import { NextApiRequest, NextApiResponse } from "next";
import { algoliasearch } from "algoliasearch";
import useProductStore from "@/utils/zustand";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_ADMIN_API_KEY! // Admin API Key should be kept server-side
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // Fetch product data from Zustand or any other data source
      const { fetchProducts } = useProductStore.getState();
      const products = await fetchProducts();

      // Prepare products for Algolia
      const productsToIndex = products.map((product) => ({
        objectID: product.id, // Algolia requires an objectID
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        // Include any other fields you want indexed
      }));

      // Initialize the Algolia index
      const index = client.initIndex("products");
      // Index products
      const result = await index.saveObjects(productsToIndex);

      res
        .status(200)
        .json({ message: "Successfully indexed products!", result });
    } catch (error) {
      console.error("Error indexing products:", error);
      res.status(500).json({ message: "Error indexing products", error });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
